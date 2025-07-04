import "../components/styles/PlayerPlaying.css";
import "../components/styles/General.css";
import { Player } from "../gameLogic/Player";
import SliderInput from "../components/SliderInput";
import React, { useState, useEffect, useRef } from "react";
import { Card } from "../gameLogic/Card";
import { useLanguage } from "../context/LanguageContext";
import norwegianFlag from "../assets/Norge.png";
import americanFlag from "../assets/USA.png";
import handRanking from "../assets/hand_ranking.png";

function PlayerPlaying() {
  const socketRef = useRef<WebSocket | null>(null);
  const playerNameRef = useRef<string | null>(null);
  const { language, toggleLanguage } = useLanguage();

  const [myPlayer, setMyPlayer] = useState<Player | null>(null);
  const [isMyTurnMessage, setIsMyTurnMessage] = useState(false);
  const [isRaiseActive, setIsRaiseActive] = useState(false);
  const [showFoldedCards, setShowFoldedCards] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  const canAct =
    isMyTurnMessage &&
    myPlayer !== null &&
    !myPlayer.hasFolded &&
    !isRaiseActive;

  const buyInorLeave =
    !isMyTurnMessage && myPlayer !== null && !isRaiseActive && !showFoldedCards;

  useEffect(() => {
    const socket = new WebSocket("ws://yourIPAdress:3000");
    socketRef.current = socket;

    const playerName = sessionStorage.getItem("currentPlayer");
    playerNameRef.current = playerName;

    socket.onopen = () => {
      if (playerName) {
        socket.send(JSON.stringify({ type: "reconnect", name: playerName }));
      }
    };

    socket.onmessage = (msg) => {
      const data = JSON.parse(msg.data);

      if (data.type === "player") {
        setMyPlayer(data.player);
        sessionStorage.setItem("myPlayer", JSON.stringify(data.player));
        if (data.isMyTurn) {
          setIsMyTurnMessage(true);
          sessionStorage.setItem("isMyTurn", "true");
        }
      }

      if (data.type === "yourTurn") {
        setIsRaiseActive(false);
        setShowFoldedCards(false);
        setIsMyTurnMessage(true);
        sessionStorage.setItem("isMyTurn", "true");
      }

      if (data.type === "showFoldedCards") {
        setShowFoldedCards(true);
      }
    };

    return () => socket.close();
  }, []);

  const sendMove = (action: string, amount?: number) => {
    if (socketRef.current && myPlayer) {
      socketRef.current.send(JSON.stringify({ type: action, amount }));
    }
    setIsMyTurnMessage(false);
    sessionStorage.setItem("isMyTurn", "false");
  };

  const sendShownCards = (action: string) => {
    if (socketRef.current && myPlayer) {
      socketRef.current.send(JSON.stringify({ type: action }));
    }
    setShowFoldedCards(false);
  };

  const getCardImage = (card: Card): string => {
    return `../cards/${card.suit[0].toUpperCase()}${card.rank}.png`;
  };

  return (
    <div className="player-playing-container">
      <div className="top-bar">
        <button onClick={toggleLanguage} className="language-toggle-button">
          <img
            src={language === "no" ? norwegianFlag : americanFlag}
            alt="Language Flag"
            className="flag-img"
          />
        </button>
        <img
          src={`../avatars/${myPlayer?.avatar}.png`}
          alt="Avatar"
          className="avatar-img"
        />
        <h1 className="player-name">
          {myPlayer?.name}: {myPlayer?.chips} kr
        </h1>
      </div>
      <div className="card-row">
        {myPlayer?.hand?.map((card, i) => (
          <img
            key={i}
            src={getCardImage(card)}
            className="card-img"
            alt={`Card ${i}`}
          />
        ))}
      </div>

      {showInfo && (
        <div
          className="info-modal"
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 9999,
            padding: "2px",
            borderRadius: "8px",
          }}
        >
          <img
            src={handRanking}
            alt="Hand Ranking"
            style={{ maxWidth: "90vw", maxHeight: "90vh" }}
          />
        </div>
      )}

      {canAct && (
        <div className="action-buttons">
          <button onClick={() => sendMove("call")} className="action-button">
            {language === "en" ? "Call" : "Syn"}
          </button>
          <button
            onClick={() => setIsRaiseActive(true)}
            className="action-button"
          >
            {language === "en" ? "Raise" : "Høyne"}
          </button>
          <button
            onClick={() => sendMove("fold")}
            className="fold-leave-button"
          >
            {language === "en" ? "Fold" : "Kast"}
          </button>
        </div>
      )}
      {buyInorLeave && (
        <div className="buyin-leave-buttons">
          {myPlayer.chips < 150 && (
            <button onClick={() => sendMove("addOn")} className="action-button">
              {language === "en"
                ? myPlayer && myPlayer.chips === 0
                  ? "Rebuy to 150 kr"
                  : "Add-on to 150 kr"
                : myPlayer?.chips === 0
                  ? "Kjøp deg inn for 150 kr"
                  : "Kjøp deg opp til 150 kr"}
            </button>
          )}
          <button
            onClick={() => sendMove("leave")}
            className="fold-leave-button"
          >
            {language === "en" ? "Leave Game" : "Forlat Spill"}
          </button>
        </div>
      )}
      <div className="info-button">
        <button
          onClick={() => setShowInfo(!showInfo)}
          className="action-button"
        >
          {language === "en" ? "Hand ranking" : "Rangering av hånd"}
        </button>
      </div>

      {showFoldedCards && (
        <div className="folded-cards-buttons">
          <button
            onClick={() => sendShownCards("showLeftCard")}
            className="action-button"
          >
            {language === "en" ? "Show left card" : "Vis venstre kort"}
          </button>
          <button
            onClick={() => sendShownCards("showRightCard")}
            className="action-button"
          >
            {language === "en" ? "Show right card" : "Vis høyre kort"}
          </button>
          <button
            onClick={() => sendShownCards("showBothCards")}
            className="action-button"
          >
            {language === "en" ? "Show both cards" : "Vis begge kort"}
          </button>
          {/* <button
            onClick={() => sendShownCards("showNone")}
            className="action-button"
          >
            {language === "en" ? "Show none" : "Ikke vis kort"}
          </button> */}
        </div>
      )}
      {isRaiseActive && (
        <div className="raise-slider-wrapper">
          <SliderInput
            min={0}
            max={myPlayer?.chips || 0}
            initialValue={0}
            onConfirm={(value) => {
              sendMove("raise", value);
              setIsRaiseActive(false);
            }}
            onReject={() => {
              setIsRaiseActive(false);
              setIsMyTurnMessage(true);
              sessionStorage.setItem("isMyTurn", "true");
            }}
          />
        </div>
      )}
    </div>
  );
}

export default PlayerPlaying;
