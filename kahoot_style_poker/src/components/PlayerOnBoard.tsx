import poker_chips from "../assets/poker_chips.png";
import card_backside from "../assets/card_backside.png";
import { Player } from "../gameLogic/Player.ts";
import { Card } from "../gameLogic/Card.ts";
import React from "react";
import "./styles/PlayerOnBoard.css";
import dealer_button from "../assets/dealer_button.png";

type PlayerProps = {
  x: number;
  y: number;
  player: Player;
};

const getCardImage = (card: Card): string => {
  return `../cards/${card.suit[0].toUpperCase()}${card.rank}.png`;
};

const getAvatar = (player: Player): string => {
  return `../avatars/${player.avatar}.png`;
};

function PlayerOnBoard({ x, y, player }: PlayerProps) {
  return (
    <>
      <div
        className="player"
        style={{
          display: "flex",
          flexDirection: "column",
          position: "absolute",
          left: `${x}px`,
          top: `${y}px`,
          transform: "translate(-50%, -50%)",
          zIndex: 5,
          /* backgroundColor: "white", */
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {player.currentBet > 0 && (
          <div
            className="betBox"
            style={{
              position: "absolute",
              top: "-15px", // adjust as needed
              left: "-20px",
              transform: "translateX(-50%)",
              zIndex: 10,
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <img
              src={poker_chips}
              style={{ width: "40px", marginRight: "5px" }}
            />
            <p style={{ color: "white", fontSize: "25px" }}>
              {player.currentBet} kr
            </p>
          </div>
        )}

        <div className="playerCards" style={{ display: "flex", gap: "4px" }}>
          <div>
            {player.showLeftCard && (
              <>
                <img
                  src={getCardImage(player.hand[0])}
                  style={{
                    width: "120px",
                    marginRight: "3px",
                  }}
                />
                <img src={card_backside} style={{ width: "50px" }} />
              </>
            )}
            {player.showRightCard && (
              <>
                <img
                  src={card_backside}
                  style={{ width: "50px", marginRight: "3px" }}
                />
                <img
                  src={getCardImage(player.hand[1])}
                  style={{ width: "120px" }}
                />
              </>
            )}
            {player.showBothCards && (
              <>
                <img
                  src={getCardImage(player.hand[0])}
                  style={{ width: "120px", marginRight: "3px" }}
                />
                <img
                  src={getCardImage(player.hand[1])}
                  style={{ width: "120px" }}
                />
              </>
            )}
            {!player.showLeftCard &&
              !player.showRightCard &&
              !player.showBothCards && (
                <>
                  <img
                    src={card_backside}
                    style={{ width: "50px", marginRight: "3px" }}
                  />
                  <img src={card_backside} style={{ width: "50px" }} />
                </>
              )}
          </div>
        </div>
        <div
          className="playerDetails"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            backgroundColor: "rgba(211, 196, 196, 0.95)",
            padding: "5px",
            borderRadius: "10px",
          }}
        >
          <div
            className="userName"
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <img
              src={getAvatar(player)}
              alt="Avatar"
              style={{ width: "45px", marginRight: "5px" }}
            />
            <h2 style={{ marginRight: "5px" }}>{player.name}</h2>
            {player.isSmallBlind && (
              <h2 style={{ color: "black", marginLeft: "10px" }}>SB</h2>
            )}
            {player.isBigBlind && (
              <h2 style={{ color: "black", marginLeft: "10px" }}>BB</h2>
            )}
            {player.isDealer && (
              <img src={dealer_button} style={{ width: "45px" }}></img>
            )}
          </div>

          <div
            className="chipsStatus"
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <img
              src={poker_chips}
              style={{ width: "45px", marginRight: "5px" }}
            />
            <h2 style={{ color: "black", marginRight: "5px" }}>
              {player.chips} kr
            </h2>
          </div>
        </div>
      </div>
    </>
  );
}

export default PlayerOnBoard;
