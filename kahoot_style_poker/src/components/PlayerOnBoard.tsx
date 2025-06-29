import poker_chips from "../assets/poker_chips.png";
import card_backside from "../assets/card_backside.png";
import { Player } from "../gameLogic/Player.ts";
import { Card } from "../gameLogic/Card.ts";
import React from "react";

type PlayerProps = {
  x: number;
  y: number;
  player: Player;
};

const getCardImage = (card: Card): string => {
  return `../cards/${card.suit[0].toUpperCase()}${card.rank}.png`;
};

function PlayerOnBoard({ x, y, player }: PlayerProps) {
  return (
    <div
      className="player"
      style={{
        position: "absolute",
        left: `${x}px`,
        top: `${y}px`,
        transform: "translate(-50%, -50%)",
        zIndex: 5,
      }}
    >
      <img src={poker_chips} style={{ width: "50px", marginTop: "6px" }} />
      <div className="playerCards" style={{ display: "flex", gap: "4px" }}>
        <div>
          {player.showLeftCard && (
            <>
              <img
                src={getCardImage(player.hand[0])}
                style={{ width: "60px" }}
              />
              <img src={card_backside} style={{ width: "50px" }} />
            </>
          )}
          {player.showRightCard && (
            <>
              <img src={card_backside} style={{ width: "50px" }} />
              <img
                src={getCardImage(player.hand[1])}
                style={{ width: "60px" }}
              />
            </>
          )}
          {player.showBothCards && (
            <>
              <img
                src={getCardImage(player.hand[0])}
                style={{ width: "60px" }}
              />
              <img
                src={getCardImage(player.hand[1])}
                style={{ width: "60px" }}
              />
            </>
          )}
          {!player.showLeftCard &&
            !player.showRightCard &&
            !player.showBothCards && (
              <>
                <img src={card_backside} style={{ width: "35px" }} />
                <img src={card_backside} style={{ width: "35px" }} />
              </>
            )}
        </div>
      </div>
      <h2 style={{ color: "black" }}>{player.name}</h2>
      <h2 style={{ color: "black" }}>Total chips: {player.chips}</h2>
    </div>
  );
}

export default PlayerOnBoard;
