import PokerBackground from "./PokerBackground";
import deck_of_cards from "../assets/deck_of_cards.png";
import PlayerOnBoard from "./PlayerOnBoard";
import { Player } from "../gameLogic/Player.ts";
import React from "react";
import HA from "../assets/cards/HA.png";
import { Card } from "../gameLogic/Card.ts";
import thePot from "../assets/poker_chips.png";

type PlayingProps = {
  playersPlaying: Player[];
  communityCards?: Card[];
  potSize: number;
};

function Playing({ playersPlaying, communityCards, potSize }: PlayingProps) {
  const centerX = 800;
  const centerY = 440;

  const curveRadiusX = 150;
  const curveRadiusY = 170;
  const bottomPlayerSpacing = 320;

  const totalSeats = 8;
  const seatPositions: { x: number; y: number }[] = [];

  // Pre-calculate the seat positions for up to 8 players
  // Right curve first (seats 0–1)
  for (let i = 0; i < 2; i++) {
    const angle = 1.5 * Math.PI + (i / 1) * (Math.PI / 2); // 270° to 360°
    let x = centerX + 575 + curveRadiusX * Math.cos(angle);
    let y = centerY + curveRadiusY * Math.sin(angle);
    if (i === 0) {
      x -= 100;
      y -= 20;
    }
    seatPositions.push({ x, y });
  }

  // Bottom line (seats 2–5)
  for (let i = 0; i < 4; i++) {
    const x = centerX + 1.85 * bottomPlayerSpacing - i * bottomPlayerSpacing;
    const y = centerY + 120 + curveRadiusY;
    seatPositions.push({ x, y });
  }

  // Left curve last (seats 6–7)
  for (let i = 0; i < 2; i++) {
    const angle = Math.PI + (i / 1) * (Math.PI / 2); // 180° to 270°
    let x = centerX - 350 + curveRadiusX * Math.cos(angle);
    let y = centerY + curveRadiusY * Math.sin(angle);
    if (i !== 0) {
      x += 100;
      y -= 20;
    }
    seatPositions.push({ x, y });
  }

  // 🎯 Use only as many positions as players
  const players = playersPlaying.map((player, i) => {
    const { x, y } = seatPositions[i];
    return <PlayerOnBoard key={i} x={x} y={y} player={player} />;
  });

  const getCardImage = (card: Card): string => {
    return `../cards/${card.suit[0].toUpperCase()}${card.rank}.png`;
  };

  return (
    <div
      style={{
        position: "relative",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      <PokerBackground />

      <img
        src={deck_of_cards}
        alt="Deck"
        style={{
          position: "absolute",
          width: "70px",
          top: "20px",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 5,
        }}
      />
      <div
        className="communityCards"
        style={{
          display: "flex",
          flexDirection: "row",
          position: "absolute",
          top: "30%",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 5,
          marginTop: "100px",
          marginLeft: "20px",
        }}
      >
        {communityCards?.map((card, i) => (
          <img
            key={i}
            src={getCardImage(card)}
            style={{ width: "80px", marginRight: "10px" }}
          />
        ))}
        {potSize > 0 && (
          <div
            style={{
              textAlign: "center",
              marginTop: "10px",
              marginLeft: "20px",
            }}
          >
            <img src={thePot} style={{ width: "50px" }} alt="Pot" />
            <div
              style={{ color: "white", fontWeight: "bold", fontSize: "20px" }}
            >
              {potSize} kr
            </div>
          </div>
        )}
      </div>

      {players}
    </div>
  );
}

export default Playing;
