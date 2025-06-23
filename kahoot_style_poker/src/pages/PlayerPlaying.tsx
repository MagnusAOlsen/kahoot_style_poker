import { Player } from "../gameLogic/Player";
import { useLocation } from "react-router-dom";
import SliderInput from "../components/SliderInput";
import React, { useState, useEffect, useRef } from "react";

function PlayerPlaying() {
  const socketRef = useRef<WebSocket | null>(null);
  const playerNameRef = useRef<string | null>(null);
  const location = useLocation();

  const [myPlayer, setMyPlayer] = useState<Player | null>(null);
  const [isMyTurnMessage, setIsMyTurnMessage] = useState(false);
  const [isRaiseActive, setIsRaiseActive] = useState(false);

  const [showFoldedCards, setShowFoldedCards] = useState(false);

  // Derived state
  const canAct =
    isMyTurnMessage &&
    myPlayer !== null &&
    !myPlayer.hasFolded &&
    !isRaiseActive;

  useEffect(() => {
    const socket = new WebSocket("ws://192.168.86.28:3000");
    socketRef.current = socket;

    const playerName = sessionStorage.getItem("currentPlayer");
    playerNameRef.current = playerName;

    socket.onopen = () => {
      console.log("PLAYERNAME:::::", playerName);
      if (playerName) {
        socket.send(JSON.stringify({ type: "reconnect", name: playerName }));
      }
    };

    socket.onmessage = (msg) => {
      const data = JSON.parse(msg.data);

      if (data.type === "player") {
        console.log("Received player data:", data.player);
        setMyPlayer(data.player);
        sessionStorage.setItem("myPlayer", JSON.stringify(data.player));
        if (data.isMyTurn) {
          setIsMyTurnMessage(true);
        }
      }

      if (data.type === "yourTurn") {
        setIsRaiseActive(false);
        setShowFoldedCards(false);
        setIsMyTurnMessage(true);
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

  return (
    <>
      <h1>
        {myPlayer?.name}: {myPlayer?.chips} kr
      </h1>

      <div className="CardContainer">
        <div className="Card1">
          <p>
            {myPlayer?.hand?.[0]?.rank} of {myPlayer?.hand?.[0]?.suit}
          </p>
        </div>
        <div className="Card2">
          <p>
            {myPlayer?.hand?.[1]?.rank} of {myPlayer?.hand?.[1]?.suit}
          </p>
        </div>
      </div>

      {canAct && (
        <div>
          <button onClick={() => sendMove("call")}>Call</button>
          <button onClick={() => setIsRaiseActive(true)}>Raise</button>
          <button onClick={() => sendMove("fold")}>Fold</button>
        </div>
      )}

      {isRaiseActive && (
        <div className="RaiseDiv">
          <SliderInput
            min={0}
            max={myPlayer?.chips || 0}
            initialValue={0}
            onConfirm={(value) => {
              sendMove("raise", value);
              setIsRaiseActive(false);
            }}
          />
        </div>
      )}
    </>
  );
}

export default PlayerPlaying;
