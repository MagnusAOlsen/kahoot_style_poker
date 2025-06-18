import Playing from "../components/Playing";
import { useLocation } from "react-router-dom";

function HostPlaying() {
  const location = useLocation();
  const currentPlayers =
    (location.state as { currentPlayers?: string[] })?.currentPlayers ?? [];
  return (
    <div>
      <Playing playersPlaying={currentPlayers} />
    </div>
  );
}

export default HostPlaying;
