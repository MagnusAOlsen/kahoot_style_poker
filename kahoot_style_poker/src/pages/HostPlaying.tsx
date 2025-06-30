import Playing from "../components/Playing";
import { useLocation } from "react-router-dom";
import { Player } from "../gameLogic/Player.ts";
import { useState, useEffect, useRef } from "react";
import React from "react";
import { Card } from "../gameLogic/Card.ts";
import MusicButton from "../components/MusicButton.tsx";
import StartGameButton from "../components/StartGameButton.tsx";
import { Game } from "../gameLogic/Game.ts";

function HostPlaying() {
  const location = useLocation();
  const socketRef = useRef<WebSocket | null>(null);
  const [currentPlayers, setCurrentPlayers] = useState<Player[]>(() => {
    return (
      (location.state as { currentPlayers?: Player[] })?.currentPlayers ||
      (JSON.parse(sessionStorage.getItem("currentPlayers") || "{}") as Player[])
    );
  });
  const [communityCards, setCommunityCards] = useState<Card[]>([]);
  const [potSize, setPotSize] = useState<number>(() => {
    return JSON.parse(sessionStorage.getItem("potSize") || "0") as number;
  });

  useEffect(() => {
    localStorage.setItem("currentPlayers", JSON.stringify(currentPlayers));
    const socket = new WebSocket("ws://192.168.86.28:3000");
    socketRef.current = socket;

    socket.onmessage = (msg) => {
      console.log("Received message from server:", msg.data);
      const data = JSON.parse(msg.data);
      if (data.type === "playerMove") {
        setCurrentPlayers(data.players);
        sessionStorage.setItem("currentPlayers", JSON.stringify(data.players));
      } else if (data.type === "communityCards") {
        setCommunityCards(data.cards);
        sessionStorage.setItem("communityCards", JSON.stringify(data.cards));
        setPotSize(data.potSize || 0);
        sessionStorage.setItem("potSize", JSON.stringify(data.potSize || 0));
      } else if (data.type === "players") {
        setCurrentPlayers(data.players);
        sessionStorage.setItem("currentPlayers", JSON.stringify(data.players));
        setCommunityCards(
          sessionStorage.getItem("communityCards")
            ? JSON.parse(sessionStorage.getItem("communityCards") || "[]")
            : []
        );
      }
    };

    return () => socket.close();
  }, []);

  return (
    <div>
      <Playing
        playersPlaying={currentPlayers}
        communityCards={communityCards}
        potSize={potSize}
      />
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
        <MusicButton />
      </div>
    </div>
  );
}

export default HostPlaying;
