import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HostWaiting from "./pages/HostWaiting";
import HostPlaying from "./pages/HostPlaying";
import PlayerPlaying from "./pages/PlayerPlaying";
import PlayerLogin from "./pages/PlayerLogin";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/HostPlaying" element={<HostPlaying />} />
        <Route path="/HostWaiting" element={<HostWaiting />} />
        <Route path="/PlayerPlaying" element={<PlayerPlaying />} />
        <Route path="/PlayerLogin" element={<PlayerLogin />} />
      </Routes>
    </Router>
  );
}

export default App;
