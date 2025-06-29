import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HostWaiting from "./pages/HostWaiting";
import HostPlaying from "./pages/HostPlaying";
import PlayerPlaying from "./pages/PlayerPlaying";
import PlayerLogin from "./pages/PlayerLogin";
import React from "react";
import { MusicProvider } from "./context/MusicContext";

function App() {
  return (
    <MusicProvider>
      <Router>
        <Routes>
          <Route path="/HostPlaying" element={<HostPlaying />} />
          <Route path="/HostWaiting" element={<HostWaiting />} />
          <Route path="/PlayerPlaying" element={<PlayerPlaying />} />
          <Route path="/PlayerLogin" element={<PlayerLogin />} />
        </Routes>
      </Router>
    </MusicProvider>
  );
}

export default App;
