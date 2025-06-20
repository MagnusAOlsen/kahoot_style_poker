import Playing from "../components/Playing";
import { useLocation } from "react-router-dom";
import { Player } from "../gameLogic/Player";

function HostPlaying() {
  const location = useLocation();
  const currentPlayers =
    (location.state as { currentPlayers?: Player[] })?.currentPlayers ?? [];
  return (
    <div>
      <Playing playersPlaying={currentPlayers} />
    </div>
  );
}

export default HostPlaying;
