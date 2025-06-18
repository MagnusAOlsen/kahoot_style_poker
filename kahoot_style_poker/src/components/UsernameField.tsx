import { useState } from "react";

type UserNameFieldProps = {
  onSubmit: (name: string) => void;
};

function UserNameField({ onSubmit }: UserNameFieldProps) {
  const [newPlayer, setNewPlayer] = useState(() => {
    const currentPlayer = localStorage.getItem("currentPlayer");
    if (currentPlayer === null) return "";
    return currentPlayer;
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (newPlayer === "") return;
    localStorage.setItem("currentPlayer", newPlayer);
    onSubmit(newPlayer);
  }

  return (
    <form onSubmit={handleSubmit} className="username-form">
      <div className="username-input">
        <label htmlFor="username">Enter username</label>
        <input
          id="username"
          value={newPlayer}
          onChange={(e) => setNewPlayer(e.target.value)}
        ></input>
        <button className="btn">Add</button>
      </div>
    </form>
  );
}

export default UserNameField;
