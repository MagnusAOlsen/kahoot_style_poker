import { Player } from "../gameLogic/Player";
import { useLocation } from "react-router-dom";
import React from "react";
import { Card } from "../gameLogic/Card";
import SliderInput from "../components/SliderInput";
import { useState, useEffect, useRef } from "react";

function PlayerPlaying() {
  const socketRef = useRef<WebSocket | null>(null);
  const location = useLocation();
  const [myPlayer, setMyPlayer] = useState<Player>(() => {
    return (
      (location.state as { myPlayer?: Player })?.myPlayer ||
      (JSON.parse(localStorage.getItem("myPlayer") || "{}") as Player)
    );
  });
  const firstCard = myPlayer?.hand[0];
  const secondCard = myPlayer?.hand[1];
  const twoPlayersRemainding: boolean = true;
  const [isRaiseActive, setIsRaiseActive] = useState(false);
  const [isFoldActive, setIsFoldActive] = useState<boolean>(() => {
    return myPlayer?.hasFolded || false;
  });
  const [showFoldedCards, setShowFoldedCards] = useState<boolean>(false);

  useEffect(() => {
    localStorage.setItem("myPlayer", JSON.stringify(myPlayer));
    const socket = new WebSocket("ws://192.168.86.28:3000");
    socketRef.current = socket;

    socket.onopen = () => {
      const playerName = sessionStorage.getItem("currentPlayer");
      if (playerName) {
        socket.send(JSON.stringify({ type: "reconnect", name: playerName }));
      }
    };

    socket.onmessage = (msg) => {
      const data = JSON.parse(msg.data);
      if (data.type === "player") {
        setMyPlayer(data.player);
        sessionStorage.setItem("myPlayer", JSON.stringify(data.player));
      }
    };
    return () => socket.close();
  }, []);

  const call = () => {
    return;
  };

  const raise = () => {
    return;
  };

  const fold = () => {
    return;
  };

  const handleRaise = () => {
    setIsRaiseActive(true);
  };
  const handleFold = () => {
    setShowFoldedCards(true);
  };

  return (
    <>
      <h1>
        {myPlayer?.name}: {myPlayer?.chips} kr
      </h1>
      <div className="CardContainer">
        <div className="Card1">
          <p>{firstCard?.toString()}</p>
        </div>
        <div className="Card2">
          <p>{secondCard?.toString()}</p>
        </div>
      </div>
      <button onClick={call}>Call</button>
      <button onClick={handleRaise}>Raise</button>
      <button onClick={handleFold}>Fold</button>

      {showFoldedCards && (
        <div className="FoldDiv">
          {twoPlayersRemainding && (
            <div>
              <button>Show first card</button>
              <button>Show second card</button>
              <button>Show both cards</button>
            </div>
          )}
        </div>
      )}

      {isRaiseActive && (
        <div className="RaiseDiv">
          <label>Or use the slider</label>
          <SliderInput
            min={0}
            max={myPlayer.chips}
            initialValue={0}
            onConfirm={(value) => {
              if (socketRef.current) {
                socketRef.current.send(
                  JSON.stringify({ type: "raise", amount: value })
                );
                setIsRaiseActive(false);
              }
            }}
          />
        </div>
      )}
    </>
  );
}

export default PlayerPlaying;
