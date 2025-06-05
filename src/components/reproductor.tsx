"use client";
import { useSearchParams } from "next/navigation";
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Volume2,
  VolumeX,
  SkipBack,
  SkipForward,
  Play,
  Pause,
  Volume1,
  Volume,
  Plus,
  Minus,
} from "lucide-react";
import { lyrics, Lyric } from "../data/lyrics";
import "../css/index.css";
import Image from "next/image";

interface AudioElement extends HTMLAudioElement {
  currentTime: number;
}

interface LocalStorageItem {
  value: string;
  expiry: number;
}

const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

const setCookie = (key: string, value: string, days: number): void => {
  const now = new Date();
  const item: LocalStorageItem = {
    value,
    expiry: now.getTime() + days * 24 * 60 * 60 * 1000,
  };
  localStorage.setItem(key, JSON.stringify(item));
};

const getCookie = (key: string): string | null => {
  const itemStr = localStorage.getItem(key);
  if (!itemStr) return null;
  try {
    const item: LocalStorageItem = JSON.parse(itemStr);
    const now = new Date();
    if (now.getTime() > item.expiry) {
      localStorage.removeItem(key);
      return null;
    }
    return item.value;
  } catch {
    return null;
  }
};

const LyricsPlayer: React.FC = () => {
  const searchParams = useSearchParams();
  const nombre = searchParams.get("14");
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [currentLyricIndex, setCurrentLyricIndex] = useState<number>(0);
  const [volume, setVolume] = useState<number>(50);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const audioRef = useRef<AudioElement | null>(null);

  useEffect(() => {
    const handleTimeUpdate = () => {
      if (audioRef.current && !isDragging) {
        setCurrentTime(audioRef.current.currentTime);
        updateCurrentLyric(audioRef.current.currentTime);
      }
    };

    const handleLoadedMetadata = () => {
      if (audioRef.current) {
        setDuration(audioRef.current.duration);
        setIsLoaded(true);
        audioRef.current.volume = volume / 100;
      }
    };

    if (audioRef.current) {
      audioRef.current.addEventListener("timeupdate", handleTimeUpdate);
      audioRef.current.addEventListener("loadedmetadata", handleLoadedMetadata);
      audioRef.current.addEventListener("canplay", handleLoadedMetadata);
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener("timeupdate", handleTimeUpdate);
        audioRef.current.removeEventListener(
          "loadedmetadata",
          handleLoadedMetadata
        );
        audioRef.current.removeEventListener("canplay", handleLoadedMetadata);
      }
    };
  }, [isDragging, volume]);

  // Controles por teclado
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!isLoaded) return;

      switch (e.code) {
        case "Space":
          e.preventDefault();
          togglePlay();
          break;
        case "KeyM":
          toggleMute();
          break;
        case "ArrowUp":
          e.preventDefault();
          handleVolumeChange(Math.min(100, volume + 5));
          break;
        case "ArrowDown":
          e.preventDefault();
          handleVolumeChange(Math.max(0, volume - 5));
          break;
        case "ArrowRight":
          skipAudio(5);
          break;
        case "ArrowLeft":
          skipAudio(-5);
          break;
      }
    };
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [isLoaded, volume, isPlaying]);

  useEffect(() => {
    const savedVolume = getCookie("radioVolume");
    const savedMute = getCookie("radioMute");

    if (savedVolume) setVolume(parseFloat(savedVolume) * 100);
    if (savedMute) setIsMuted(savedMute === "true");
  }, []);

  const updateCurrentLyric = (time: number): void => {
    const index = lyrics.findIndex((lyric: Lyric, i: number) => {
      const nextTime = lyrics[i + 1]?.time ?? Infinity;
      return time >= lyric.time && time < nextTime;
    });
    if (index !== -1) setCurrentLyricIndex(index);
  };

  const playAudio = () => {
    if (audioRef.current && isLoaded) {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
            setCookie("radioPlayState", "playing", 7);
          })
          .catch((error) => {
            console.error("Error playing audio:", error);
          });
      }
    }
  };

  const pauseAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
      setCookie("radioPlayState", "paused", 7);
    }
  };

  const togglePlay = () => {
    if (isPlaying) {
      pauseAudio();
    } else {
      playAudio();
    }
  };

  const handleVolumeChange = (newVolume: number) => {
    if (audioRef.current) {
      const volumeValue = newVolume / 100;
      audioRef.current.volume = volumeValue;
      setVolume(newVolume);
      setCookie("radioVolume", volumeValue.toString(), 7);

      // Si el volumen se pone a 0, se activa el mute
      if (newVolume === 0 && !isMuted) {
        toggleMute();
      }
      // Si se aumenta el volumen desde 0, se desactiva el mute
      else if (newVolume > 0 && isMuted) {
        toggleMute();
      }
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      const newMuteState = !isMuted;
      audioRef.current.muted = newMuteState;
      setIsMuted(newMuteState);
      setCookie("radioMute", newMuteState.toString(), 7);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isLoaded) return;

    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      updateCurrentLyric(time);
    }
  };

  const skipAudio = (seconds: number) => {
    if (audioRef.current && isLoaded) {
      const newTime = audioRef.current.currentTime + seconds;
      audioRef.current.currentTime = Math.max(0, Math.min(newTime, duration));
    }
  };

  const increaseVolume = () => {
    handleVolumeChange(Math.min(100, volume + 5));
  };

  const decreaseVolume = () => {
    handleVolumeChange(Math.max(0, volume - 5));
  };

  const renderLyric = (
    index: number,
    status: "current" | "previous" | "next"
  ) => {
    const variants = {
      enter: { opacity: 0, y: 20 },
      center: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5 },
      },
      exit: {
        opacity: 0,
        y: -20,
        transition: { duration: 0.3 },
      },
    };

    return (
      <motion.div
        key={`${index}-${status}`}
        initial="enter"
        animate="center"
        exit="exit"
        variants={variants}
        className="lyrics-text"
      >
        {lyrics[index]?.text || ""}
      </motion.div>
    );
  };

  const getVolumeIcon = () => {
    if (isMuted || volume === 0) return <VolumeX />;
    if (volume < 30) return <Volume />;
    if (volume < 70) return <Volume1 />;
    return <Volume2 />;
  };

  return (
    <div className="music-player">
      {/* Loader que se muestra mientras el audio se carga */}
      {!isLoaded && (
        <div className="loader-overlay">
          <div className="loader">Cargando mi confesion...</div>
        </div>
      )}
      <div className="player-container">
        <div className="top-section">
          <div className="disc-container">
            <Image
              width={230}
              height={230}
              className={`disc-image disc-rotating ${
                isPlaying ? "playing" : ""
              }`}
              src="/img/disc.png"
              alt="Disco"
            />
            <Image
              width={230}
              height={230}
              className="disc-image"
              src="/img/pin.png"
              alt="Pin"
            />
          </div>

          <div className="volume-controls">
            <button
              title="Mutear (M)"
              onClick={toggleMute}
              className="player-button"
              disabled={!isLoaded}
            >
              {getVolumeIcon()}
            </button>
            <button
              title="Bajar Volumen (Flecha abajo)"
              onClick={decreaseVolume}
              className="player-button"
              disabled={!isLoaded}
            >
              <Minus />
            </button>
            <input
              type="range"
              className="volume-slider"
              min="0"
              max="100"
              value={volume}
              onChange={(e) => handleVolumeChange(Number(e.target.value))}
              disabled={!isLoaded}
            />
            <button
              title="Subir Volumen (Flecha arriba)"
              onClick={increaseVolume}
              className="player-button"
              disabled={!isLoaded}
            >
              <Plus />
            </button>
            <span className="volume-label">{Math.round(volume)}%</span>
          </div>
        </div>
        <div className="card__subtitle">Solamente Tu {nombre}</div>
        <div className="lyrics-section">
          <div className="lyrics-container">
            <AnimatePresence mode="popLayout">
              {renderLyric(currentLyricIndex, "current")}
            </AnimatePresence>
          </div>
        </div>
        <div className="controls-section">
          <div className="time-slider-container">
            <span className="time-label">{formatTime(currentTime)}</span>
            <input
              type="range"
              className="time-slider"
              min="0"
              max={duration || 0}
              value={currentTime}
              onChange={handleSeek}
              onMouseDown={() => setIsDragging(true)}
              onMouseUp={() => setIsDragging(false)}
              disabled={!isLoaded}
            />
            <span className="time-label">{formatTime(duration)}</span>
          </div>

          <div className="playback-controls">
            <button
              title="Retroceder 5 seg. (←)"
              onClick={() => skipAudio(-5)}
              className="player-button"
              disabled={!isLoaded}
            >
              <SkipBack />
            </button>

            <button
              title={isPlaying ? "Pausar (Espacio)" : "Reproducir (Espacio)"}
              onClick={togglePlay}
              className="player-button play-button"
              disabled={!isLoaded}
            >
              {isPlaying ? (
                <Pause className="w-6 h-6" />
              ) : (
                <Play className="w-6 h-6" />
              )}
            </button>

            <button
              title="Adelantar 5 seg. (→)"
              onClick={() => skipAudio(5)}
              className="player-button"
              disabled={!isLoaded}
            >
              <SkipForward />
            </button>
          </div>
        </div>
      </div>

      <audio
        ref={audioRef}
        src="http://localhost:3000/music/simplemente-tu.mp3"
        className="hidden"
        preload="auto"
      />
    </div>
  );
};

export default LyricsPlayer;
