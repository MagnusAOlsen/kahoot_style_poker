import "./styles/PlayerOnBoard.css";
import poker_chips from "../assets/poker_chips.png";
import card_backside from "../assets/card_backside.png";
import { Player } from "../gameLogic/Player.ts";
import { Card } from "../gameLogic/Card.ts";
import React from "react";
import dealer_button from "../assets/dealer_button.png";
import crown from "../assets/crown.png";

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
    <div className="player" style={{ left: `${x}px`, top: `${y}px` }}>
      {player.currentBet > 0 && (
        <div className="bet-box">
          <img src={poker_chips} />
          <p>{player.currentBet} kr</p>
        </div>
      )}
      {player.called === true && player.currentBet === 0 && (
        <div className="bet-box">
          <p>Check</p>
        </div>
      )}
      {player.hasFolded && (
        <div className="bet-box">
          <p
            style={{
              color: "rgb(229, 6, 6)",
              fontSize: "50px",
              fontWeight: "bold",
            }}
          >
            Fold
          </p>
        </div>
      )}
      {player.winner && (
        <div className="bet-box">
          <img src={crown} style={{ width: "200px", marginLeft: "250px" }} />
        </div>
      )}
      <div className="player-cards">
        <div>
          {player.showLeftCard && (
            <>
              <img
                src={getCardImage(player.hand[0])}
                className="card-large card-margin-right"
              />
              <img src={card_backside} className="card-small" />
            </>
          )}
          {player.showRightCard && (
            <>
              <img
                src={card_backside}
                className="card-small card-margin-right"
              />
              <img src={getCardImage(player.hand[1])} className="card-large" />
            </>
          )}
          {player.showBothCards && (
            <>
              <img
                src={getCardImage(player.hand[0])}
                className="card-large card-margin-right"
              />
              <img src={getCardImage(player.hand[1])} className="card-large" />
            </>
          )}
          {!player.showLeftCard &&
            !player.showRightCard &&
            !player.showBothCards &&
            !player.hasFolded && (
              <>
                <img
                  src={card_backside}
                  className="card-small card-margin-right"
                />
                <img src={card_backside} className="card-small" />
              </>
            )}
        </div>
      </div>

      <div className="player-details">
        <div className="user-name">
          <img src={getAvatar(player)} alt="Avatar" />
          <h2>{player.name}</h2>
          {player.isSmallBlind && <h2 className="blind-label">SB</h2>}
          {player.isBigBlind && <h2 className="blind-label">BB</h2>}
          {player.isDealer && (
            <img src={dealer_button} className="dealer-button" />
          )}
        </div>

        <div className="chips-status">
          <img src={poker_chips} />
          <h2>{player.chips} kr</h2>
        </div>
      </div>
    </div>
  );
}

export default PlayerOnBoard;
