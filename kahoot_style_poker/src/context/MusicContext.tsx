import React, {
  createContext,
  useContext,
  useRef,
  useState,
  useEffect,
} from "react";
import track1 from "../assets/music/ballerina.mp3";
import track2 from "../assets/music/ballerina.mp3";
import track3 from "../assets/music/ballerina.mp3";
import track4 from "../assets/music/ballerina.mp3";
import track5 from "../assets/music/ballerina.mp3";

const playlist = [track1, track2, track3, track4, track5];

type MusicContextType = {
  isPlaying: boolean;
  toggleMusic: () => void;
};

const MusicContext = createContext<MusicContextType | null>(null);

export const useMusic = () => {
  const context = useContext(MusicContext);
  if (!context) throw new Error("useMusic must be used within MusicProvider");
  return context;
};

export const MusicProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [trackIndex, setTrackIndex] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio(playlist[trackIndex]);
    audioRef.current.volume = 0.5;
    audioRef.current.loop = false;

    const handleEnded = () => {
      const next = (trackIndex + 1) % playlist.length;
      setTrackIndex(next);
    };

    audioRef.current.addEventListener("ended", handleEnded);

    return () => {
      audioRef.current?.pause();
      audioRef.current?.removeEventListener("ended", handleEnded);
    };
  }, [trackIndex]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = playlist[trackIndex];
      if (isPlaying) {
        audioRef.current.play();
      }
    }
  }, [trackIndex]);

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <MusicContext.Provider value={{ isPlaying, toggleMusic }}>
      {children}
    </MusicContext.Provider>
  );
};
