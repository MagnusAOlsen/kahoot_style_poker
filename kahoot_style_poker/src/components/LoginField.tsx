import React from "react";
import "./LoginField.css";

type LoginFieldProps = {
  currentPlayers: string[];
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
            <li key={index}>{player}</li>
          ))}
        </ul>

        <p>Waiting for players to join...</p>
      </div>
      <button className="startGame" />
    </>
  );
}

export default LoginField;
