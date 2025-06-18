import { useEffect, useState } from "react";
import PokerBackground from "../components/PokerBackground";
import LoginField from "../components/LoginField";

function HostWaiting() {
  console.log("HostWaiting component rendered");
  const [currentPlayers, setCurrentPlayers] = useState<string[]>(() => {
    const storedPlayers = localStorage.getItem("currentPlayers");
    try {
      const parsed = storedPlayers ? JSON.parse(storedPlayers) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("currentPlayers", JSON.stringify(currentPlayers));
    console.log("Conecting to WebSocket server...");
    const socket = new WebSocket("ws://localhost:3000");

    socket.onmessage = (msg) => {
      console.log("Received message from server:", msg.data);
      const data = JSON.parse(msg.data);
      if (data.type === "players") {
        console.log("Type:", typeof data.players);
        console.log("Is array:", Array.isArray(data.players));

        console.log("Updating current players:", data.players);
        setCurrentPlayers(data.players);
        console.log(localStorage.getItem("currentPlayers"));
        localStorage.setItem("currentPlayers", JSON.stringify(data.players));
        console.log(localStorage.getItem("currentPlayers"));
      }
    };

    return () => socket.close();
  }, []);

  return (
    <div style={{ position: "relative", height: "100vh", overflow: "hidden" }}>
      <PokerBackground />
      <LoginField currentPlayers={currentPlayers} />
      <div className="player-list">
        <h3>Current Players:</h3>
        <ul>
          {currentPlayers.map((player, i) => (
            <li key={i}>{player}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default HostWaiting;
