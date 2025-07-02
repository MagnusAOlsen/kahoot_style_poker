import "./styles/General.css";
import { useState } from "react";
import React from "react";
import { useLanguage } from "../context/LanguageContext";

type UserNameFieldProps = {
  onSubmit: (name: string) => void;
};

function UserNameField({ onSubmit }: UserNameFieldProps) {
  const [newPlayer, setNewPlayer] = useState(() => {
    return sessionStorage.getItem("currentPlayer") || "";
  });

  const { language } = useLanguage();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (newPlayer.trim() === "") return;
    sessionStorage.setItem("currentPlayer", newPlayer.trim());
    onSubmit(newPlayer.trim());
  }

  return (
    <form onSubmit={handleSubmit} style={{ width: "100%" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "16px",
        }}
      >
        <label
          htmlFor="username"
          style={{
            fontSize: "1.2rem",
            fontWeight: "bold",
            color: "white",
          }}
        >
          {language === "en"
            ? "Enter your name to join"
            : "Skriv inn brukernavn for å bli med"}
        </label>
        <input
          id="username"
          type="text"
          value={newPlayer}
          onChange={(e) => setNewPlayer(e.target.value)}
          placeholder="Your name"
          autoFocus
          style={{
            padding: "12px 16px",
            fontSize: "1.1rem",
            borderRadius: "10px",
            border: "none",
            width: "100%",
            maxWidth: "400px",
            boxSizing: "border-box",
          }}
        />
        <button
          type="submit"
          style={{
            padding: "16px",
            fontSize: "1.2rem",
            backgroundColor: "#ffffff",
            color: "#0b5e0b",
            borderRadius: "50px",
            border: "none",
            fontWeight: "bold",
            width: "100%",
            maxWidth: "400px",
            cursor: "pointer",
          }}
        >
          {language === "en" ? "Join Game!" : "Bli med i spillet!"}
        </button>
      </div>
    </form>
  );
}

export default UserNameField;
