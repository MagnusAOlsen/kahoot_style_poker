import "../components/styles/General.css";
import "../components/styles/PlayerLogin.css";
import Aces from "../components/Aces.tsx";
import UserNameField from "../components/UsernameField.tsx";
import { useState, useEffect, useRef } from "react";
import React from "react";
import { useNavigate } from "react-router-dom";
import AnimatedEllipsis from "../components/animatedEllipsis.tsx";
import { useLanguage } from "../context/LanguageContext.tsx";
import norwegianFlag from "../assets/Norge.png";
import americanFlag from "../assets/USA.png";

function PlayerLogin() {
  const navigate = useNavigate();
  const [playerName, setPlayerName] = useState(() => {
    return sessionStorage.getItem("currentPlayer") || "";
  });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [avatar, setAvatar] = useState(() => {
    return sessionStorage.getItem("avatar") || "";
  });

  const { language, toggleLanguage } = useLanguage();

  const listOfAvatars: string[] = [
    "batman_logo",
    "lion",
    "lsk",
    "messi",
    "pizza",
    "professor",
    "red_bull",
    "spiderman",
  ];

  const [isReady, setIsReady] = useState(() => {
    return sessionStorage.getItem("ready") === "true";
  });
  const [avatarPath, setAvatarPath] = useState(() => {
    const storedAvatar = sessionStorage.getItem("avatarPath");
    return storedAvatar || `../avatars/${listOfAvatars.at(currentIndex)}.png`;
  });

  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!sessionStorage.getItem("ready")) {
      sessionStorage.clear();
    }

    sessionStorage.setItem("ready", isReady.toString());
    sessionStorage.setItem("currentPlayer", playerName);

    const socket = new WebSocket("ws://192.168.50.76:3000");
    socketRef.current = socket;

    socket.onmessage = (msg) => {
      const data = JSON.parse(msg.data);
      if (data.type === "gameStarted") {
        navigate("/PlayerPlaying", { state: { myPlayer: data.player } });
      }
    };

    return () => socket.close();
  }, []);

  const handleSubmit = (name: string) => {
    if (!socketRef.current || !name) return;
    sessionStorage.setItem("currentPlayer", name);
    setPlayerName(name);
    sessionStorage.setItem("ready", "true");
    setIsReady(true);
    socketRef.current.send(JSON.stringify({ type: "join", name }));
  };

  const chooseAvatar = () => {
    if (!socketRef.current || !playerName) return;
    sessionStorage.setItem(
      "avatar",
      JSON.stringify(listOfAvatars.at(currentIndex) || "")
    );
    setAvatar(listOfAvatars.at(currentIndex) || "");
    socketRef.current.send(
      JSON.stringify({
        type: "chooseAvatar",
        avatar: listOfAvatars.at(currentIndex) || "",
        playerName: playerName,
      })
    );
  };

  const viewAvatar = (index: number): void => {
    let index2: number;
    if (currentIndex + index < 0) {
      index2 = listOfAvatars.length - 1;
    } else {
      index2 = (currentIndex + index) % listOfAvatars.length;
    }
    setAvatarPath(`../avatars/${listOfAvatars[index2]}.png`);
    setCurrentIndex(index2);
  };

  return (
    <div className="player-login-container">
      <div className="aces-wrapper">
        <Aces />
      </div>

      <div className="languageButton">
        <button onClick={toggleLanguage} className="language-button">
          {language === "no" ? (
            <img src={norwegianFlag} alt="flag" />
          ) : (
            <img src={americanFlag} alt="flag" />
          )}
        </button>
      </div>

      {!isReady ? (
        <div className="username-form-wrapper">
          <UserNameField onSubmit={handleSubmit} />
        </div>
      ) : (
        <div className="player-ready-wrapper">
          <h2 className="player-ready-title">
            {language === "en"
              ? `${playerName} ready to play!`
              : `${playerName} klar for spill!`}
          </h2>

          {avatar === "" ? (
            <div>
              <p>{language === "en" ? "Choose avatar" : "velg avatar"}</p>
              <div className="avatar-controls">
                <button
                  onClick={() => viewAvatar(-1)}
                  className="avatar-button"
                >
                  ◀
                </button>
                <img
                  src={avatarPath}
                  alt="avatar preview"
                  className="avatar-image"
                />
                <button onClick={() => viewAvatar(1)} className="avatar-button">
                  ▶
                </button>
              </div>
              <button onClick={chooseAvatar} className="choose-avatar-button">
                {language === "en" ? "Choose" : "Velg"}
              </button>
            </div>
          ) : (
            <div>
              <img
                src={avatarPath}
                className="avatar-image"
                alt="Selected avatar"
              />
            </div>
          )}

          {avatar !== "" && (
            <p className="waiting-text">
              {language === "en"
                ? `Waiting for the host to start the game`
                : `Venter på at spillet skal starte`}
              <AnimatedEllipsis />
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default PlayerLogin;
