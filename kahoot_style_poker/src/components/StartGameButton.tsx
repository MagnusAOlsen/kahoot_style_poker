import React from "react";
import startIcon from "../assets/play_button.png";
import { useNavigate } from "react-router-dom";
import { Player } from "../gameLogic/Player.ts";

type Props = {
  currentPlayers: Player[];
  onStartGame: () => void;
};

function StartGameButton({ currentPlayers, onStartGame }: Props) {
  const navigate = useNavigate();

  const handleClick = () => {
    onStartGame();
    navigate("/HostPlaying", { state: { currentPlayers } });
  };

  return (
    <div
      className="start-game-container"
      style={{ width: "100px", borderColor: "black", marginTop: "30px" }}
    >
      <button
        onClick={handleClick}
        className="start-game-button"
        style={{
          borderRadius: "40%",
          backgroundColor: "rgba(211, 196, 196, 0.95)",
          border: "3px solid black",
        }}
      >
        <img src={startIcon} alt="Start Icon" style={{ width: "100%" }} />
      </button>
    </div>
  );
}

export default StartGameButton;
