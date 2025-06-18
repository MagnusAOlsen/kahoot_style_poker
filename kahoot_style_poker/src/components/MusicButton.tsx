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
    <div className="music-button">
      <button onClick={toggleMusic}>
        {isPlaying ? "Pause Music" : "Play Music"}
      </button>
      <audio ref={audioRef} loop />
    </div>
  );
}
