import Aces from "../components/Aces";
import UserNameField from "../components/UsernameField";
import { useState, useEffect, useRef } from "react";

function PlayerLogin() {
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

  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!sessionStorage.getItem("ready")) {
      sessionStorage.clear();
    }
    sessionStorage.setItem("ready", isReady.toString());
    sessionStorage.setItem("currentPlayer", playerName);
    const socket = new WebSocket("ws://localhost:3000");
    socketRef.current = socket;

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
