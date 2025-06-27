import React from "react";
import smallStack from "../assets/poker_chips.png";

type PotSizeProps = {
  pot: number;
};

function PotSize({ pot }: PotSizeProps) {
  return (
    <div className="pot-size">
      <img src={smallStack} />
      <span className="pot-size-label">Pot Size:</span>
      <span className="pot-size-value">{pot}</span>
    </div>
  );
}

export default PotSize;
