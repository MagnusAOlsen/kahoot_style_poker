function StartGameButton() {
  const handleClick = () => {
    // Logic to start the game goes here
    console.log("Game started!");
  };

  return (
    <button onClick={handleClick} className="start-game-button">
      Start Game
    </button>
  );
}
