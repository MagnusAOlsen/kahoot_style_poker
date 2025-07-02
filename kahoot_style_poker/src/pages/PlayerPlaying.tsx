import { Player } from "../gameLogic/Player";
import { useLocation } from "react-router-dom";
import SliderInput from "../components/SliderInput";
import React, { useState, useEffect, useRef } from "react";
import { Card } from "../gameLogic/Card";
import LanguageButton from "../components/LanguageButton";
import { useLanguage } from "../context/LanguageContext";
import norwegianFlag from "../assets/Norge.png";
import americanFlag from "../assets/USA.png";

function PlayerPlaying() {
  const socketRef = useRef<WebSocket | null>(null);
  const playerNameRef = useRef<string | null>(null);
  const location = useLocation();
  const { language, toggleLanguage } = useLanguage();

  const [myPlayer, setMyPlayer] = useState<Player | null>(null);
  const [isMyTurnMessage, setIsMyTurnMessage] = useState(false);
  const [isRaiseActive, setIsRaiseActive] = useState(false);
  const [showFoldedCards, setShowFoldedCards] = useState(false);

  const canAct =
    isMyTurnMessage &&
    myPlayer !== null &&
    !myPlayer.hasFolded &&
    !isRaiseActive;

  const buyInorLeave =
    !isMyTurnMessage && myPlayer !== null && !isRaiseActive && !showFoldedCards;

  useEffect(() => {
    const socket = new WebSocket("ws://192.168.86.28:3000");
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
    <div
      style={{
        backgroundColor: "#0a1a2f",
        width: "100vw",
        height: "100dvh",
        paddingLeft: "20px",
        paddingRight: "20px",
        boxSizing: "border-box",
        fontFamily: "Arial, sans-serif",
        color: "white",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "row",
        }}
      >
        <button
          onClick={toggleLanguage}
          style={{
            backgroundColor: "transparent",
            borderColor: "transparent",
            padding: "0",
            marginTop: "0px",
            marginRight: "10px",
          }}
        >
          {language === "no" ? (
            <img
              src={norwegianFlag}
              alt="Avatar"
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                marginRight: "10px",
                marginTop: "7px",
              }}
            />
          ) : (
            <img
              src={americanFlag}
              alt="Avatar"
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                marginRight: "10px",
                marginTop: "7px",
              }}
            />
          )}
        </button>

        <img
          src={`../avatars/${myPlayer?.avatar}.png`}
          alt="Avatar"
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            marginRight: "10px",
            marginTop: "7px",
          }}
        />
        <h1
          style={{
            fontWeight: "bold",
            fontSize: "1.5rem",
            marginBottom: "20px",
            marginRight: "45px",
          }}
        >
          {myPlayer?.name}: {myPlayer?.chips} kr
        </h1>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "10px",
          marginBottom: "30px",
          width: "100%",
        }}
      >
        {myPlayer?.hand?.map((card, i) => (
          <img
            key={i}
            src={getCardImage(card)}
            style={{ width: "42vw", height: "auto", borderRadius: "12px" }}
            alt={`Card ${i}`}
          />
        ))}
      </div>
      {canAct && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "15px",
            width: "90%",
          }}
        >
          <button onClick={() => sendMove("call")} style={actionButtonStyle}>
            {language === "en" ? "Call" : "Syn"}
          </button>
          <button
            onClick={() => setIsRaiseActive(true)}
            style={actionButtonStyle}
          >
            {language === "en" ? "Raise" : "Høyne"}
          </button>
          <button onClick={() => sendMove("fold")} style={foldLeavButton}>
            {language === "en" ? "Fold" : "Kast"}
          </button>
        </div>
      )}

      {buyInorLeave && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "15px",
            width: "90%",
          }}
        >
          {myPlayer.chips < 150 && (
            <button onClick={() => sendMove("addOn")} style={actionButtonStyle}>
              {language === "en"
                ? myPlayer && myPlayer.chips === 0
                  ? "Rebuy to 150 kr"
                  : "Add-on to 150 kr"
                : myPlayer?.chips === 0
                  ? "Kjøp deg inn for 150 kr"
                  : "Kjøp deg opp til 150 kr"}
            </button>
          )}
          <button onClick={() => sendMove("leave")} style={foldLeavButton}>
            {language === "en" ? "Leave Game" : "Forlat Spill"}
          </button>
        </div>
      )}

      {showFoldedCards && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "15px",
            width: "90%",
          }}
        >
          <button
            onClick={() => sendShownCards("showLeftCard")}
            style={actionButtonStyle}
          >
            {language === "en" ? "Show left card" : "Vis venstre kort"}
          </button>
          <button
            onClick={() => sendShownCards("showRightCard")}
            style={actionButtonStyle}
          >
            {language === "en" ? "Show right card" : "Vis høyre kort"}
          </button>
          <button
            onClick={() => sendShownCards("showBothCards")}
            style={actionButtonStyle}
          >
            {language === "en" ? "Show both cards" : "Vis begge kort"}
          </button>
          <button
            onClick={() => sendShownCards("showNone")}
            style={actionButtonStyle}
          >
            {language === "en" ? "Show none" : "Ikke vis kort"}
          </button>
        </div>
      )}

      {isRaiseActive && (
        <div
          style={{
            width: "100%",
            padding: "0 20px",
            boxSizing: "border-box",
          }}
        >
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

const actionButtonStyle: React.CSSProperties = {
  padding: "16px",
  fontSize: "1.2rem",
  backgroundColor: "#ffffff",
  color: "#0b5e0b",
  borderRadius: "50px",
  border: "none",
  fontWeight: "bold",
  width: "100%",
};

const foldLeavButton: React.CSSProperties = {
  padding: "16px",
  fontSize: "1.2rem",
  backgroundColor: "rgb(225, 44, 44)",
  color: "black",
  borderRadius: "50px",
  border: "none",
  fontWeight: "bold",
  width: "100%",
};

export default PlayerPlaying;
