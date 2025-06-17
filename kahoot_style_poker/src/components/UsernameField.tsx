import { useState, useEffect } from "react";

function UserNameField({ onSubmit }) {
  const [newPlayer, setNewPlayer] = useState(() => {
    const currentPlayer = localStorage.getItem("currentPlayer");
    if (currentPlayer === null) return "";
    return currentPlayer;
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (newPlayer === "") return;
    onSubmit(newPlayer);
  }

  useEffect(() => {
    localStorage.setItem("currentPlayer", newPlayer);
  }, [newPlayer]);

  return (
    <form onSubmit={handleSubmit} className="username-form">
      <div className="username-input">
        <label htmlFor="item">Write perefered username</label>
        <input
          value={newPlayer}
          onChange={(e) => setNewPlayer(e.target.value)}
        ></input>
        <button className="btn">Add</button>
      </div>
    </form>
  );
}

export default UserNameField;
