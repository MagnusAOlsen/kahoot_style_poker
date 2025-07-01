import { useLanguage } from "../context/LanguageContext";
import React, { useContext } from "react";
import norwegianFlag from "../assets/Norge.png";
import americanFlag from "../assets/USA.png";

function LanguageButton() {
  const { language, toggleLanguage } = useLanguage();

  return (
    <div
      className="start-game-container"
      style={{ width: "100px", borderColor: "black", marginTop: "30px" }}
    >
      <button
        onClick={toggleLanguage}
        className="start-game-button"
        style={{
          borderRadius: "40%",
          backgroundColor: "rgba(211, 196, 196, 0.95)",
          border: "3px solid black",
          height: "95px",
        }}
      >
        {language === "no" ? (
          <img src={norwegianFlag} alt="Start Icon" style={{ width: "100%" }} />
        ) : (
          <img src={americanFlag} alt="Start Icon" style={{ width: "100%" }} />
        )}
      </button>
    </div>
  );
}

export default LanguageButton;
