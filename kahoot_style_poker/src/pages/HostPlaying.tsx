import Playing from "../components/Playing";
import { useLocation } from "react-router-dom";
import { Player } from "../gameLogic/Player.ts";
import { useState, useEffect, useRef } from "react";
import React from "react";
import { Card } from "../gameLogic/Card.ts";
import MusicButton from "../components/MusicButton.tsx";

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
      } else if (data.type === "players") {
        setCurrentPlayers(data.players);
        sessionStorage.setItem("currentPlayers", JSON.stringify(data.players));
      }
    };

    return () => socket.close();
  }, []);

  return (
    <div>
      <Playing
        playersPlaying={currentPlayers}
        communityCards={communityCards}
      />
      <MusicButton />
    </div>
  );
}

export default HostPlaying;
