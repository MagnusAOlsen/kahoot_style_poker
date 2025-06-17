import aces from "../assets/aces.png";

function Aces() {
  return (
    <img
      src={aces}
      alt="Player Waiting"
      style={{
        position: "fixed", // or "absolute" if inside a relatively positioned parent
        top: 0,
        left: 0,
        width: "100vw",
        marginTop: "15px",
        marginLeft: "10px",
        objectFit: "cover",
        zIndex: 1,
      }}
    />
  );
}

export default Aces;
