import { useState } from "react";
import { Game } from "../game/Game";
import { Card } from "../game/Card";

export function usePokerGame(playerNames: string[]) {
  const [game, setGame] = useState(() => new Game(playerNames));
  const [players, setPlayers] = useState(game.players);
  const [pot, setPot] = useState(0);

  function startRound() {
    game.startNewRound();
    setPlayers([...game.players]); // Update hands
    setPot(game.getPot());
  }

  function collectBets(amount: number) {
    game.collectBets(amount);
    setPot(game.getPot());
  }

  return {
    players,
    pot,
    startRound,
    collectBets,
  };
}
