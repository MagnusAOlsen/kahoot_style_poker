import React from "react";
import "./LoginField.css";
import Player from "../gameLogic/Player";

type LoginFieldProps = {
  currentPlayers: Player[];
};

function LoginField({ currentPlayers }: LoginFieldProps) {
  console.log("currentPlayers prop in LoginField:", currentPlayers);

  return (
    <>
      <div className="login-field">
        <h1>Scan QR-code to join!</h1>
        <img src="/qr-code.png" alt="QR Code" />
        <h2>Current Players:</h2>
        <ul>
          {currentPlayers.map((player, index) => (
            <li key={index}>{player.name}</li>
          ))}
        </ul>
        {currentPlayers.length < 8 && <p>Waiting for players to join...</p>}
        {currentPlayers.length == 8 && <p>Lobby full! Let's start</p>}
      </div>
      <button className="startGame" />
    </>
  );
}

export default LoginField;
