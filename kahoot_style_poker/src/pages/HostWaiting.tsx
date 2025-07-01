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
  console.log("HostWaiting component rendered");
  const [currentPlayers, setCurrentPlayers] = useState<Player[]>(() => {
    const storedPlayers = localStorage.getItem("currentPlayers");
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
    localStorage.setItem("currentPlayers", JSON.stringify(currentPlayers));
    console.log("Conecting to WebSocket server...");
    const socket = new WebSocket("ws://192.168.86.28:3000");
    socketRef.current = socket;

    socket.onmessage = (msg) => {
      console.log("Received message from server:", msg.data);
      const data = JSON.parse(msg.data);
      if (data.type === "players") {
        setCurrentPlayers(data.players);
        console.log(localStorage.getItem("currentPlayers"));
        localStorage.setItem("currentPlayers", JSON.stringify(data.players));
        console.log(localStorage.getItem("currentPlayers"));
      }
    };

    return () => socket.close();
  }, []);

  const startGame = () => {
    if (socketRef.current) {
      socketRef.current.send(JSON.stringify({ type: "startGame" }));
      console.log("NÅ HAR JEG STARTA");
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
