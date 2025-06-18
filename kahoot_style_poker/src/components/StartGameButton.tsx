import React from "react";
import startIcon from "../assets/play_button.png";
import { useNavigate } from "react-router-dom";

type Props = {
  currentPlayers: string[];
};

function StartGameButton({ currentPlayers }: Props) {
  const navigate = useNavigate();

  const handleClick = () => {
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
