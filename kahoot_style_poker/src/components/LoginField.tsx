import "./styles/LoginField.css";
import React from "react";
import { Player } from "../gameLogic/Player.ts";
import AnimatedEllipsis from "./animatedEllipsis.tsx";
import { useLanguage } from "../context/LanguageContext";

type LoginFieldProps = {
  currentPlayers: Player[];
};

function LoginField({ currentPlayers }: LoginFieldProps) {
  const { language } = useLanguage();

  return (
    <>
      <div className="login-field">
        {language === "en" ? (
          <h1>Scan QR-code to join!</h1>
        ) : (
          <h1>Les QR-koden for å bli med!</h1>
        )}
        <img src="/qr-code.png" alt="QR Code" />
        {language === "en" ? <h2>Current Players:</h2> : <h2>Spillere:</h2>}
        <ul>
          {currentPlayers.map((player, index) => (
            <li key={index}>{player.name}</li>
          ))}
        </ul>
        {currentPlayers.length < 8 && (
          <p>
            {language === "en"
              ? "Waiting for players to join"
              : "Venter på at spillere skal bli med"}
            <AnimatedEllipsis />
          </p>
        )}
        {currentPlayers.length === 8 &&
          (language === "en" ? (
            <p>Lobby full! Let's start</p>
          ) : (
            <p>Lobby er full! La oss starte</p>
          ))}
      </div>
      <button className="startGame" />
    </>
  );
}

export default LoginField;
