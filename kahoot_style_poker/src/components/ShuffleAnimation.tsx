// components/ShuffleAnimation.tsx
import React, { useEffect } from "react";
import deckImage from "../assets/deck_of_cards.png";
import "./styles/ShuffleAnimation.css";

function ShuffleAnimation() {
  return (
    <div
      style={{
        position: "absolute",
        top: "40%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: 20,
        textAlign: "center",
      }}
    >
      <img
        src={deckImage}
        alt="Shuffling deck"
        className="shuffle-animation"
        style={{ width: "100px", marginBottom: "10px" }}
      />
    </div>
  );
}

export default ShuffleAnimation;
