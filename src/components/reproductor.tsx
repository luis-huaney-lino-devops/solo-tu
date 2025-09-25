"use client";
// import { useSearchParams } from "next/navigation";
import React, { useState, useRef, useEffect, useCallback } from "react";
import "../css/index.css";
import { PowerToggle } from "./player/PowerToggle";
import { VolumeControls } from "./player/VolumeControls";
import { TimeSlider } from "./player/TimeSlider";
import { PlaybackControls } from "./player/PlaybackControls";
import { SongsList } from "./player/SongsList";
import { Header } from "./player/Header";
import { PhotoCueView } from "./player/PhotoCueView";
import { Lyric, SongDetail, SongSummary } from "./player/types";
import { RotatingDisc } from "./player/RotatingDisc";
import { LyricsView } from "./player/LyricsView";

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
  // const searchParams = useSearchParams();
  // const nombre = searchParams.get("14");
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
    <div
      className="
 w-3/4
    mx-auto 
    p-2 
  
    
    rounded-2xl 
    shadow-xl
  "
      style={{ background: "linear-gradient(145deg, #8b4513, #5d2f0a)" }}
    >
      {/* Loader que se muestra mientras el audio se carga */}
      {!isLoaded && (
        <div className="loader-overlay">
          <div className="loader">Cargando mi confesion...</div>
        </div>
      )}
      {/* Encabezado con botón de encendido */}
      <div className="w-full mb-4 flex items-center gap-4">
        <div className="w-1/10">
          <PowerToggle
            powered={isPoweredOn}
            onToggle={togglePower}
            disabled={!isLoaded}
          />
        </div>
        <div className="w-full">
          <Header
            title={`${songDetail?.nombre || ""}`}
            artista={songDetail?.artista || "Cristian Castro"}
            powered={isPoweredOn}
          />
        </div>
      </div>
      {/* Grid de 3 columnas */}
      {/* player-container */}
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Columna 1: Disco giratorio */}
        <div
          style={{
            background: "radial-gradient(circle, #2c2c2c, #1a1a1a)",
            boxShadow: "inset 0 4px 8px rgba(0, 0, 0, 0.5)",
          }}
          className="flex flex-col items-center bg-black justify-center rounded-2xl"
        >
          <RotatingDisc 
            isPlaying={isPlaying} 
            powered={isPoweredOn}
            albumImage={songDetail?.foto_album}
          />
        </div>

        {/* Columna 2: Información de la canción y controles */}
        <div className="flex flex-col gap-4">
          {/* Header con información de la canción */}

          {/* Vista de letras */}
          <div>
            <LyricsView
              text={lyrics[currentLyricIndex]?.text || ""}
              index={currentLyricIndex}
              textSize="sm"
              powered={isPoweredOn}
            />
          </div>

          {/* Panel de controles */}
          <div
            style={{
              background: "radial-gradient(circle, #2c2c2c, #1a1a1a)",
              boxShadow: "inset 0 4px 8px rgba(0, 0, 0, 0.5)",
            }}
            className="bg-gradient-to-r from-amber-900/20 to-amber-800/20 rounded-lg p-4 border border-amber-700/30"
          >
            {/* Controles de reproducción */}
            <div className="flex items-center justify-center gap-4 mb-4">
              <PlaybackControls
                isPlaying={isPlaying}
                onTogglePlay={togglePlay}
                onSkipBack={() => skipAudio(-5)}
                onSkipForward={() => skipAudio(5)}
                disabled={!isLoaded || !isPoweredOn}
                onMuteToggle={toggleMute}
                isMuted={isMuted}
                volume={volume}
                compact
                powered={isPoweredOn}
              />
            </div>

            {/* Timeline y controles de tiempo */}
            <div className="flex flex-col gap-3">
              <TimeSlider
                currentTime={currentTime}
                duration={duration}
                disabled={!isLoaded || !isPoweredOn}
                onSeek={handleSeek}
                onDragStart={() => setIsDragging(true)}
                onDragEnd={() => setIsDragging(false)}
                formatTime={formatTime}
                compact
                powered={isPoweredOn}
              />

              {/* Controles de volumen */}
              <div className="flex items-center justify-center">
                <VolumeControls
                  volume={volume}
                  onVolumeChange={(val) => handleVolumeChange(val)}
                  onIncrease={increaseVolume}
                  onDecrease={decreaseVolume}
                  disabled={!isLoaded || !isPoweredOn}
                  compact
                  powered={isPoweredOn}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Columna 3: Galería de fotografías */}
        <div
          className="flex flex-col items-center justify-center rounded-2xl p-0"
          style={{
            background: "radial-gradient(circle, #2c2c2c, #1a1a1a)",
            boxShadow: "inset 0 4px 8px rgba(0, 0, 0, 0.5)",
          }}
        >
          {songDetail?.fotografias ? (
            <PhotoCueView
              currentTime={currentTime}
              cues={songDetail.fotografias}
              powered={isPoweredOn}
            />
          ) : (
            <div className="text-amber-100/50 text-center">
              <p>No hay imágenes disponibles</p>
              <p className="text-sm mt-1">para esta canción</p>
            </div>
          )}
        </div>
      </div>
      {/* Sección inferior: Lista de canciones */}
      <div className="w-full mt-8">
        <div className="bg-gradient-to-r from-amber-900/10 to-amber-800/10 rounded-lg p-6 border border-amber-700/20">
          {/* <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-amber-200 mb-2">
              Lista de Reproducción
            </h2>
            <p className="text-amber-100/70 text-sm">
              Selecciona una canción para reproducir
            </p>
          </div> */}
          <SongsList
            songs={songs}
            selectedSongId={selectedSong?.id ?? null}
            onSelect={setSelectedSong}
            disabled={!isLoaded || !isPoweredOn}
            powered={isPoweredOn}
          />
        </div>
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
