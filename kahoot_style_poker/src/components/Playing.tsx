import PokerBackground from "./PokerBackground";
import deck_of_cards from "../assets/deck_of_cards.png";
import Player from "./Player";

function Playing() {
  const centerX = 800;
  const centerY = 440;

  const curveRadiusX = 150; // horizontal size of curve
  const curveRadiusY = 160; // vertical curve size
  const bottomPlayerSpacing = 250;

  const players = [];

  // 🟢 Left curve: angles from 180° to 270°
  for (let i = 0; i < 2; i++) {
    const angle = Math.PI + (i / 1) * (Math.PI / 2); // 180° to 270°
    const x = centerX - 350 + curveRadiusX * Math.cos(angle); // left offset
    const y = centerY + curveRadiusY * Math.sin(angle);
    players.push(<Player key={`left-${i}`} x={x} y={y} />);
  }

  // 🟢 Bottom straight line
  for (let i = 0; i < 4; i++) {
    const x = centerX - 1.5 * bottomPlayerSpacing + i * bottomPlayerSpacing;
    const y = centerY + curveRadiusY;
    players.push(<Player key={`bottom-${i}`} x={x} y={y} />);
  }

  // 🟢 Right curve: angles from 270° to 360°
  for (let i = 0; i < 2; i++) {
    const angle = 1.5 * Math.PI + (i / 1) * (Math.PI / 2); // 270° to 360°
    const x = centerX + 350 + curveRadiusX * Math.cos(angle); // right offset
    const y = centerY + curveRadiusY * Math.sin(angle);
    players.push(<Player key={`right-${i}`} x={x} y={y} />);
  }

  return (
    <div style={{ position: "relative", height: "100vh", overflow: "hidden" }}>
      <PokerBackground />

      <img
        src={deck_of_cards}
        alt="Deck"
        style={{
          position: "absolute",
          width: "70px",
          top: "20px",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 5,
        }}
      />

      {players}
    </div>
  );
}

export default Playing;
