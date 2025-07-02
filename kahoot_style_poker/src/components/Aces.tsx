import aces from "../assets/aces.png";
import React from "react";

//Picture of the Aces at the Login screen in players device
function Aces() {
  return (
    <div>
      <img
        src={aces}
        style={{
          position: "absolute",
          maxWidth: "80%",
          overflow: "hidden",
        }}
      />
    </div>
  );
}

export default Aces;
