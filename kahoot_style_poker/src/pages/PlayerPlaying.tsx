import { Player } from "../gameLogic/Player";
import { useLocation } from "react-router-dom";
import React from "react";

function PlayerPlaying() {
  const location = useLocation();
  const myPlayer = (location.state as { myPlayer?: Player })?.myPlayer;
  return (
    <>
      <p>hei</p>
      <p>{myPlayer?.name}</p>
    </>
  );
}

export default PlayerPlaying;
