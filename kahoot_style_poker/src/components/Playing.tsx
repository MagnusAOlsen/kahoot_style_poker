import PokerBackground from "./PokerBackground";
import deck_of_cards from "../assets/deck_of_cards.png";
import PlayerOnBoard from "./PlayerOnBoard";
import { Player } from "../gameLogic/Player.ts";
import React from "react";
import { Card } from "../gameLogic/Card.ts";
import thePot from "../assets/poker_chips.png";
import ShuffleAnimation from "./ShuffleAnimation.tsx";

type PlayingProps = {
  playersPlaying: Player[];
  communityCards?: Card[];
  potSize: number;
  shuffling: boolean;
};

function Playing({
  playersPlaying,
  communityCards,
  potSize,
  shuffling,
}: PlayingProps) {
  const centerX = 800;
  const centerY = 440;

  const curveRadiusX = 150;
  const curveRadiusY = 190;
  const bottomPlayerSpacing = 320;

  const seatPositions: { x: number; y: number }[] = [];

  //Seat 1-2
  for (let i = 0; i < 2; i++) {
    const angle = 1.5 * Math.PI + (i / 1) * (Math.PI / 2); // 270° to 360°
    let x = centerX + 475 + curveRadiusX * Math.cos(angle);
    let y = centerY + curveRadiusY * Math.sin(angle);
    if (i === 0) {
      x -= 90;
      y -= 50;
    } else {
      y += 20;
    }
    seatPositions.push({ x, y });
  }

  // Bottom line (seats 3-5)
  for (let i = 0; i < 3; i++) {
    const x = centerX + 1.25 * bottomPlayerSpacing - i * bottomPlayerSpacing;
    const y = centerY + 120 + curveRadiusY;
    seatPositions.push({ x, y });
  }

  // Left curve last (seats 6–7)
  for (let i = 0; i < 2; i++) {
    const angle = Math.PI + (i / 1) * (Math.PI / 2); // 180° to 270°
    let x = centerX - 350 + curveRadiusX * Math.cos(angle);
    let y = centerY + curveRadiusY * Math.sin(angle);
    if (i !== 0) {
      x += 90;
      y -= 50;
    } else {
      y += 30;
    }
    seatPositions.push({ x, y });
  }

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
      {shuffling && <ShuffleAnimation />}
      {!shuffling && (
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
      )}

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
          marginTop: "90px",
          marginLeft: "20px",
        }}
      >
        {communityCards?.map((card, i) => (
          <img
            key={i}
            src={getCardImage(card)}
            style={{ width: "120px", marginRight: "10px" }}
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
            <img src={thePot} style={{ width: "75px" }} alt="Pot" />
            <div
              style={{ color: "white", fontWeight: "bold", fontSize: "45px" }}
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
