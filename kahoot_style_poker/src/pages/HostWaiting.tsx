import PokerBackground from "../components/PokerBackground";
import LoginField from "../components/LoginField";
import { useState, useEffect } from "react";

function HostWaiting() {
  const [currentPlayers, setCurrentPlayers] = useState<string[]>(() => {
    const localValue = localStorage.getItem("currentPlayers");
    if (localValue === null) return [];
    return JSON.parse(localValue);
  });

  useEffect(() => {
    localStorage.setItem("currentPlayers", JSON.stringify(currentPlayers));
  }, [currentPlayers]);

  return (
    <div style={{ position: "relative", height: "100vh", overflow: "hidden" }}>
      <PokerBackground />
      <LoginField />
    </div>
  );
}

export default HostWaiting;
