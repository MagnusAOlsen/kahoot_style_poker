import Aces from "../components/Aces.tsx";
import UserNameField from "../components/UsernameField.tsx";
import { useState, useEffect, useRef } from "react";
import React from "react";
import { useNavigate } from "react-router-dom";
import AnimatedEllipsis from "../components/animatedEllipsis.tsx";

function PlayerLogin() {
  const navigate = useNavigate();
  const [playerName, setPlayerName] = useState(() => {
    return sessionStorage.getItem("currentPlayer") || "";
  });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [avatar, setAvatar] = useState(() => {
    return sessionStorage.getItem("avatar") || "";
  });

  const [listOfAvatars, setListOfAvatars] = useState([
    "batman_logo",
    "lion",
    "lsk",
    "messi",
    "pizza",
    "professor",
    "red_bull",
    "spiderman",
  ]);

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

    const socket = new WebSocket("ws://192.168.86.28:3000");
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
    let index2 = (currentIndex + index) % listOfAvatars.length;
    setAvatarPath(`../avatars/${listOfAvatars[index2]}.png`);
    setCurrentIndex(index2);
  };

  return (
    <div
      style={{
        backgroundColor: "#0a1a2f",
        width: "100vw",
        height: "100dvh",
        padding: "50px",
        boxSizing: "border-box",
        fontFamily: "Arial, sans-serif",
        color: "white",
        display: "flex",
        flexDirection: "row",
        overflow: "hidden",
      }}
    >
      <div style={{ marginTop: "100%" }}>
        <Aces />
      </div>

      {!isReady ? (
        <div style={{ width: "100%", maxWidth: "400px" }}>
          <UserNameField onSubmit={handleSubmit} />
        </div>
      ) : (
        <div style={{ textAlign: "center", maxWidth: "400px" }}>
          <h2
            style={{
              fontSize: "1.5rem",
              fontWeight: "bold",
              marginBottom: "10px",
            }}
          >
            User {playerName} ready to play!
          </h2>

          {avatar === "" ? (
            <div>
              <p>Choose avatar</p>
              <div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    gap: "10px",
                    justifyContent: "center",
                  }}
                >
                  <button onClick={() => viewAvatar(-1)}>◀</button>
                  <img
                    src={avatarPath}
                    alt="avatar preview"
                    style={{ width: "100px", height: "100px" }}
                  />
                  <button onClick={() => viewAvatar(1)}>▶</button>
                </div>
                <button onClick={() => chooseAvatar()}>choose Avatar</button>
              </div>
            </div>
          ) : (
            <div>
              <img
                src={avatarPath}
                style={{ width: "100px" }}
                alt="Selected avatar"
              />
            </div>
          )}
          {avatar !== "" && (
            <p style={{ fontSize: "1.2rem" }}>
              Waiting for the host to start the game
              <AnimatedEllipsis />
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default PlayerLogin;
