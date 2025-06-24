import aces from "../assets/aces.png";
import React from "react";

function Aces() {
  return (
    <div>
      <img
        src={aces}
        alt="Player Waiting"
        style={{
          position: "absolute", // or "absolute" if inside a relatively positioned parent
          maxWidth: "80%",
          overflow: "hidden",
        }}
      />
    </div>
  );
}

export default Aces;
