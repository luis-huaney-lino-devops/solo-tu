"use client";
import { useSearchParams } from "next/navigation";
import React, { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import "../css/index.css";
import { PowerToggle } from "./player/PowerToggle";
import { VolumeControls } from "./player/VolumeControls";
import { TimeSlider } from "./player/TimeSlider";
import { PlaybackControls } from "./player/PlaybackControls";
import { SongsList } from "./player/SongsList";
import { Header } from "./player/Header";
import { LyricsView } from "./player/LyricsView";
import { PhotoCueView } from "./player/PhotoCueView";
import { Lyric, SongDetail, SongSummary } from "./player/types";

interface AudioElement extends HTMLAudioElement {
  currentTime: number;
}

interface LocalStorageItem {
  value: string;
  expiry: number;
}

// Types moved to ./player/types

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
  const [isPoweredOn, setIsPoweredOn] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [currentLyricIndex, setCurrentLyricIndex] = useState<number>(0);
  const [volume, setVolume] = useState<number>(50);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const audioRef = useRef<AudioElement | null>(null);
  const [songs, setSongs] = useState<SongSummary[]>([]);
  const [selectedSong, setSelectedSong] = useState<SongSummary | null>(null);
  const [songDetail, setSongDetail] = useState<SongDetail | null>(null);
  const [lyrics, setLyrics] = useState<Lyric[]>([]);

  // Stable callbacks used across effects
  const updateCurrentLyric = useCallback(
    (time: number): void => {
      const index = lyrics.findIndex((lyric: Lyric, i: number) => {
        const nextTime = lyrics[i + 1]?.time ?? Infinity;
        return time >= lyric.time && time < nextTime;
      });
      if (index !== -1) setCurrentLyricIndex(index);
    },
    [lyrics]
  );

  const playAudio = useCallback(() => {
    if (audioRef.current && isLoaded && isPoweredOn) {
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
  }, [isLoaded, isPoweredOn]);

  const pauseAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
      setCookie("radioPlayState", "paused", 7);
    }
  }, []);

  const toggleMute = useCallback(() => {
    if (audioRef.current) {
      const newMuteState = !isMuted;
      audioRef.current.muted = newMuteState;
      setIsMuted(newMuteState);
      setCookie("radioMute", newMuteState.toString(), 7);
    }
  }, [isMuted]);

  const handleVolumeChange = useCallback(
    (newVolume: number) => {
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
    },
    [isMuted, toggleMute]
  );

  const togglePlay = useCallback(() => {
    if (!isPoweredOn) return;
    if (isPlaying) {
      pauseAudio();
    } else {
      playAudio();
    }
  }, [isPoweredOn, isPlaying, pauseAudio, playAudio]);

  const skipAudio = useCallback(
    (seconds: number) => {
      if (audioRef.current && isLoaded) {
        const newTime = audioRef.current.currentTime + seconds;
        audioRef.current.currentTime = Math.max(0, Math.min(newTime, duration));
      }
    },
    [isLoaded, duration]
  );

  // duplicate removed; skipAudio defined earlier

  useEffect(() => {
    const audioEl = audioRef.current;
    const handleTimeUpdate = () => {
      if (audioEl && !isDragging) {
        setCurrentTime(audioEl.currentTime);
        updateCurrentLyric(audioEl.currentTime);
      }
    };

    const handleLoadedMetadata = () => {
      if (audioEl) {
        setDuration(audioEl.duration);
        setIsLoaded(true);
        audioEl.volume = volume / 100;
      }
    };

    if (audioEl) {
      audioEl.addEventListener("timeupdate", handleTimeUpdate);
      audioEl.addEventListener("loadedmetadata", handleLoadedMetadata);
      audioEl.addEventListener("canplay", handleLoadedMetadata);
    }

    return () => {
      if (audioEl) {
        audioEl.removeEventListener("timeupdate", handleTimeUpdate);
        audioEl.removeEventListener("loadedmetadata", handleLoadedMetadata);
        audioEl.removeEventListener("canplay", handleLoadedMetadata);
      }
    };
  }, [isDragging, volume, updateCurrentLyric]);

  // Load songs list from public JSON
  useEffect(() => {
    const loadSongs = async () => {
      try {
        const response = await fetch("/pistas/Canciones.json", {
          cache: "no-store",
        });
        const data = await response.json();
        const list: SongSummary[] = Array.isArray(data?.musicas)
          ? data.musicas
          : [];
        setSongs(list);
        if (list.length > 0) {
          setSelectedSong(list[0]);
        }
      } catch (error) {
        console.error("Error loading songs list:", error);
      }
    };
    loadSongs();
  }, []);

  // Load selected song detail
  useEffect(() => {
    const loadDetail = async () => {
      if (!selectedSong) return;
      setIsLoaded(false);
      setCurrentTime(0);
      setCurrentLyricIndex(0);
      setDuration(0);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      setIsPlaying(false);
      try {
        const response = await fetch(selectedSong.detalle_datos_musica, {
          cache: "no-store",
        });
        const detail: SongDetail = await response.json();
        setSongDetail(detail);
        setLyrics(detail.lyrics || []);
        // If we already had metadata for duration in list, prefer audio's real duration on load
        // The audio element will update duration on metadata load
        if (audioRef.current) {
          audioRef.current.load();
        }
      } catch (error) {
        console.error("Error loading song detail:", error);
        setSongDetail(null);
        setLyrics([]);
      }
    };
    loadDetail();
  }, [selectedSong]);

  // Controles por teclado
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!isLoaded || !isPoweredOn) return;

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
  }, [
    isLoaded,
    isPoweredOn,
    volume,
    isPlaying,
    togglePlay,
    toggleMute,
    handleVolumeChange,
    skipAudio,
  ]);

  useEffect(() => {
    const savedVolume = getCookie("radioVolume");
    const savedMute = getCookie("radioMute");

    if (savedVolume) setVolume(parseFloat(savedVolume) * 100);
    if (savedMute) setIsMuted(savedMute === "true");
  }, []);

  const togglePower = () => {
    const next = !isPoweredOn;
    setIsPoweredOn(next);
    if (!next && audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
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

  const increaseVolume = () => {
    handleVolumeChange(Math.min(100, volume + 5));
  };

  const decreaseVolume = () => {
    handleVolumeChange(Math.max(0, volume - 5));
  };

  // Internal UI moved to dedicated components under ./player

  return (
    <div className="music-player">
      {/* Loader que se muestra mientras el audio se carga */}
      {!isLoaded && (
        <div className="loader-overlay">
          <div className="loader">Cargando mi confesion...</div>
        </div>
      )}
      <div className="player-container w-full max-w-5xl">
        {/* Power and top controls row */}
        <div className="w-full mb-4 flex items-center justify-between">
          <PowerToggle
            powered={isPoweredOn}
            onToggle={togglePower}
            disabled={!isLoaded}
          />
          <VolumeControls
            volume={volume}
            isMuted={isMuted}
            onMuteToggle={toggleMute}
            onVolumeChange={(val) => handleVolumeChange(val)}
            onIncrease={increaseVolume}
            onDecrease={decreaseVolume}
            disabled={!isLoaded || !isPoweredOn}
          />
        </div>
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
        </div>
        <Header
          title={
            songDetail
              ? `${songDetail.nombre} — ${songDetail.artista}`
              : `Solamente Tu ${nombre}`
          }
        />
        <LyricsView
          text={lyrics[currentLyricIndex]?.text || ""}
          index={currentLyricIndex}
        />
        {songDetail?.fotografias && (
          <PhotoCueView
            currentTime={currentTime}
            cues={songDetail.fotografias}
          />
        )}
        <div className="controls-section">
          <TimeSlider
            currentTime={currentTime}
            duration={duration}
            disabled={!isLoaded || !isPoweredOn}
            onSeek={handleSeek}
            onDragStart={() => setIsDragging(true)}
            onDragEnd={() => setIsDragging(false)}
            formatTime={formatTime}
          />
          <PlaybackControls
            isPlaying={isPlaying}
            onTogglePlay={togglePlay}
            onSkipBack={() => skipAudio(-5)}
            onSkipForward={() => skipAudio(5)}
            disabled={!isLoaded || !isPoweredOn}
          />
        </div>
        {/* Songs list moved to bottom */}
        <SongsList
          songs={songs}
          selectedSongId={selectedSong?.id ?? null}
          onSelect={setSelectedSong}
          disabled={!isLoaded || !isPoweredOn}
        />
      </div>

      <audio
        ref={audioRef}
        src={
          songDetail?.pista || "http://localhost:3000/music/simplemente-tu.mp3"
        }
        className="hidden"
        preload="auto"
        onLoadedMetadata={() => {
          if (audioRef.current) {
            setDuration(audioRef.current.duration);
            setIsLoaded(true);
            audioRef.current.volume = volume / 100;
          }
        }}
      />
    </div>
  );
};

export default LyricsPlayer;
