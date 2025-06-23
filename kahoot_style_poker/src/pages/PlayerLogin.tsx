import Aces from "../components/Aces";
import UserNameField from "../components/UsernameField";
import { useState, useEffect, useRef } from "react";
import React from "react";
import { useNavigate } from "react-router-dom";
import { Player } from "../gameLogic/Player.ts";

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
    sessionStorage.setItem("ready", "true");
    setPlayerName(name);
    setIsReady(true);

    socketRef.current.send(JSON.stringify({ type: "join", name }));
  };

  return (
    <div className="flex flex-col items-center justify-center bg-green-700 text-white h-screen px-4">
      <div className="w-full max-w-md text-center">
        <Aces />

        {!isReady && (
          <div className="mt-8">
            <UserNameField onSubmit={handleSubmit} />
          </div>
        )}

        {isReady && (
          <div className="mt-8 bg-white text-black p-6 rounded-2xl shadow-lg">
            <h2 className="text-xl font-semibold mb-2">
              User <span className="text-green-700">{playerName}</span> is
              ready!
            </h2>
            <p className="text-sm">Waiting for the host to start the game...</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default PlayerLogin;
