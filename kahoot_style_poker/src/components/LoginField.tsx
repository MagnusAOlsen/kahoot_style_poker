import React from "react";
import "./LoginField.css";
import CurrentPlayers from "./CurrentPlayers";

function LoginField() {
  return (
    <>
      <div className="login-field">
        <h1>Scan QR-code to join!</h1>
        <img src="/qr-code.png" alt="QR Code" />
        <CurrentPlayers />
      </div>
      <button className="startGame" />
    </>
  );
}

export default LoginField;
