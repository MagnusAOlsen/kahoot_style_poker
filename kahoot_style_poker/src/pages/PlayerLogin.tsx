import Aces from "../components/Aces";
import UserNameField from "../components/UsernameField";
import { useState, useEffect, useRef } from "react";
import { Player } from "../gameLogic/Player";

function PlayerLogin() {
  /* const [player, setPlayer] = useState<Player>(() => {
    const storedName = localStorage.getItem("currentPlayer");
    if (storedName) {
      return new Player(storedName);
    }
    return new Player("");
  }); */

  const [playerName, setPlayerName] = useState(""); /* => {
    const storedName = localStorage.getItem("currentPlayer");
    if (storedName) {
      return storedName;
    }
    return "";
  }); */

  const [isReady, setIsReady] = useState(false); /* => {
    const storedReady = localStorage.getItem("ready");
    if (storedReady === "true") {
      return true;
    }
    return false;
  }); */

  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    localStorage.setItem("ready", isReady.toString());
    localStorage.setItem("currentPlayer", playerName);
    const socket = new WebSocket("ws://localhost:3000");
    socketRef.current = socket;

    return () => socket.close();
  }, []);

  const handleSubmit = (name: string) => {
    if (!socketRef.current || !name) return;
    localStorage.setItem("currentPlayer", name);
    setPlayerName(name);
    localStorage.setItem("ready", "true");
    setIsReady(true);
    /* setPlayer(new Player(name)); */
    socketRef.current.send(JSON.stringify({ type: "join", name: name }));
    setIsReady(true);
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
