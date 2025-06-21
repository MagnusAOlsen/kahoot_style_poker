import Aces from "../components/Aces";
import UserNameField from "../components/UsernameField";
import { useState, useEffect, useRef } from "react";
import React from "react";
import { useNavigate } from "react-router-dom";
import { Player } from "../gameLogic/Player";

function PlayerLogin() {
  const navigate = useNavigate();
  const [playerName, setPlayerName] = useState(() => {
    const storedName = sessionStorage.getItem("currentPlayer");
    if (storedName) {
      return storedName;
    }
    return "";
  });

  const [isReady, setIsReady] = useState(() => {
    const storedReady = sessionStorage.getItem("ready");
    if (storedReady === "true") {
      return true;
    }
    return false;
  });

  const [connected, setConnected] = useState(true);

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
      console.log("Received message from server:", msg.data);
      const data = JSON.parse(msg.data);
      if (data.type === "gameStarted") {
        console.log(data.player);
        console.log(playerName);
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
    socketRef.current.send(JSON.stringify({ type: "join", name: name }));
  };

  return (
    <div style={{ backgroundColor: "green", width: "100vw", height: "100vh" }}>
      <Aces />
      {!isReady && (
        <UserNameField
          onSubmit={(name) => {
            handleSubmit(name);
          }}
        />
      )}
      {isReady && (
        <div className="ready-message">
          <h2>User {playerName} ready to play!</h2>
          <p>Waiting for the host to start the game...</p>
        </div>
      )}
    </div>
  );
}

export default PlayerLogin;
