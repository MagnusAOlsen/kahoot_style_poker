import React from "react";
import musicImage from "../assets/music_image.png";
import redCross from "../assets/red_cross.png";

function MusicButton() {
  const [isPlaying, setIsPlaying] = React.useState(false);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div
      className="music-button"
      style={{ width: "100px", marginRight: "30px", marginTop: "30px" }}
    >
      <button
        onClick={toggleMusic}
        style={{
          borderRadius: "40%",
          backgroundColor: "rgba(211, 196, 196, 0.95)",
          border: "3px solid black",
          position: "relative",
        }}
      >
        <img src={musicImage} alt="Music Icon" style={{ width: "100%" }} />
        {isPlaying && (
          <img
            src={redCross}
            alt="red cross"
            style={{
              width: "100px",
              zIndex: "2",
              position: "absolute",
              top: "10px",
              right: "2px",
            }}
          />
        )}
      </button>
      <audio ref={audioRef} loop />
    </div>
  );
}

export default MusicButton;
