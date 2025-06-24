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

  const [isReady, setIsReady] = useState(() => {
    return sessionStorage.getItem("ready") === "true";
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
      <div style={{ marginTop: "80%" }}>
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
          <p style={{ fontSize: "1.2rem" }}>
            Waiting for the host to start the game
            <AnimatedEllipsis />
          </p>
        </div>
      )}
    </div>
  );
}

export default PlayerLogin;
