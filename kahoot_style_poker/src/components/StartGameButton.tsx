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
    <button onClick={handleClick} className="start-game-button">
      Start Game
      <img src={startIcon} alt="Start Icon" />
    </button>
  );
}

export default StartGameButton;
