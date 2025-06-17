import Aces from "../components/Aces";
import UserNameField from "../components/UsernameField";
import { useState } from "react";

function PlayerLogin() {
  const [playerName, setPlayerName] = useState(() => {
    const currentPlayer = localStorage.getItem("currentPlayer");
    if (currentPlayer === null) return "";
    return currentPlayer;
  });

  const [isReady, setIsReady] = useState(() => {
    const currentPlayer = localStorage.getItem("currentPlayer");
    if (currentPlayer === null) return false;
    return true;
  });

  const makeReady = () => {
    setIsReady(true);
  };
  const addPlayerName = (name: string) => {
    setPlayerName(name);
  };

  function addPlayer(newPlayer: string) {
    addPlayerName(newPlayer);
    makeReady();
    return;
  }

  return (
    <div style={{ backgroundColor: "green", width: "100vw", height: "100vh" }}>
      <Aces />
      {!isReady && <UserNameField onSubmit={addPlayer} />}
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
