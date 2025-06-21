import Playing from "../components/Playing";
import { useLocation } from "react-router-dom";
import { Player } from "../gameLogic/Player";
import { useState, useEffect, useRef } from "react";
import React from "react";

function HostPlaying() {
  const location = useLocation();
  const socketRef = useRef<WebSocket | null>(null);
  const [currentPlayers, setCurrentPlayers] = useState<Player[]>(() => {
    return (
      (location.state as { currentPlayers?: Player[] })?.currentPlayers ||
      (JSON.parse(sessionStorage.getItem("currentPlayers") || "{}") as Player[])
    );
  });
  const [showFoldedFirstCard, setShowFoldedFirstCard] =
    useState<boolean>(false);
  const [showFoldedSecondCard, setShowFoldedSecondCard] =
    useState<boolean>(false);

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
      } else if (data.type === "playerMoves") {
        setCurrentPlayers(data.players);
        sessionStorage.setItem("currentPlayers", JSON.stringify(data.players));
      }
    };

    return () => socket.close();
  }, []);

  return (
    <div>
      <Playing playersPlaying={currentPlayers} />
    </div>
  );
}

export default HostPlaying;
