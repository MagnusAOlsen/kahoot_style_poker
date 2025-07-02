import "../components/styles/General.css";
import { useEffect, useState, useRef } from "react";
import PokerBackground from "../components/PokerBackground";
import LoginField from "../components/LoginField";
import React from "react";
import StartGameButton from "../components/StartGameButton";
import MusicButton from "../components/MusicButton";
import { Player } from "../gameLogic/Player.ts";
import LanguageButton from "../components/LanguageButton";
import { useLanguage } from "../context/LanguageContext";

function HostWaiting() {
  const [currentPlayers, setCurrentPlayers] = useState<Player[]>(() => {
    const storedPlayers = sessionStorage.getItem("currentPlayers");
    try {
      const parsed = storedPlayers ? JSON.parse(storedPlayers) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  const { language } = useLanguage();

  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    sessionStorage.setItem("currentPlayers", JSON.stringify(currentPlayers));
    const socket = new WebSocket("ws://192.168.86.28:3000"); //Must change every time the server IP changes
    socketRef.current = socket;

    socket.onmessage = (msg) => {
      const data = JSON.parse(msg.data);
      if (data.type === "players") {
        setCurrentPlayers(data.players);
        sessionStorage.setItem("currentPlayers", JSON.stringify(data.players));
      }
    };

    return () => socket.close();
  }, []);

  const startGame = () => {
    if (socketRef.current) {
      socketRef.current.send(JSON.stringify({ type: "startGame" }));
    }
  };

  return (
    <>
      <div
        className="QR-code-and-players"
        style={{ position: "relative", height: "100vh", overflow: "hidden" }}
      >
        <PokerBackground />
        <LoginField currentPlayers={currentPlayers} />
        <div className="player-list">
          {language === "en" ? <h2>Current Players</h2> : <h2>Spillere</h2>}

          <ul>
            {currentPlayers.map((player, i) => (
              <li key={i}>{player.name}</li>
            ))}
          </ul>
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          top: "0",
          right: "0",
          display: "flex",
          gap: "10px",
          padding: "10px 15px",
          zIndex: 10,
          borderBottomLeftRadius: "12px",
        }}
      >
        <LanguageButton />
        <StartGameButton
          currentPlayers={currentPlayers}
          onStartGame={startGame}
        />
        <MusicButton />
      </div>
    </>
  );
}

export default HostWaiting;
