import poker_chips from "../assets/poker_chips.png";
import card_backside from "../assets/card_backside.png";

function Player({ x, y }) {
  return (
    <div
      className="player"
      style={{
        position: "absolute",
        left: `${x}px`,
        top: `${y}px`,
        transform: "translate(-50%, -50%)",
        zIndex: 5,
      }}
    >
      <img src={poker_chips} style={{ width: "50px", marginTop: "6px" }} />
      <div className="playerCards" style={{ display: "flex", gap: "4px" }}>
        <img src={card_backside} style={{ width: "25px" }} />
        <img src={card_backside} style={{ width: "25px" }} />
      </div>
      <h2 style={{ color: "black" }}>Player x</h2>
    </div>
  );
}

export default Player;
