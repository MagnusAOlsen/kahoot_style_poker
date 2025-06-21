import { useEffect, useState, useRef } from "react";
import PokerBackground from "../components/PokerBackground";
import LoginField from "../components/LoginField";
import React from "react";
import StartGameButton from "../components/StartGameButton";
import MusicButton from "../components/MusicButton";
import { Player } from "../gameLogic/Player";

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
          <h3>Current Players:</h3>
          <ul>
            {currentPlayers.map((player, i) => (
              <li key={i}>{player.name}</li>
            ))}
          </ul>
        </div>
      </div>
      <div className="start-page-buttons">
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
