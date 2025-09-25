"use client";
import React from "react";
import { Pause, Play, SkipBack, SkipForward } from "lucide-react";

interface PlaybackControlsProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
  onSkipBack: () => void;
  onSkipForward: () => void;
  disabled: boolean;
}

export const PlaybackControls: React.FC<PlaybackControlsProps> = ({
  isPlaying,
  onTogglePlay,
  onSkipBack,
  onSkipForward,
  disabled,
}) => (
  <div className="playback-controls">
    <button
      title="Retroceder 5 seg. (←)"
      onClick={onSkipBack}
      className={`player-button ${
        disabled
          ? "opacity-50 grayscale cursor-not-allowed pointer-events-none"
          : ""
      }`}
      disabled={disabled}
    >
      <SkipBack />
    </button>

    <button
      title={isPlaying ? "Pausar (Espacio)" : "Reproducir (Espacio)"}
      onClick={onTogglePlay}
      className={`player-button play-button ${
        disabled
          ? "opacity-50 grayscale cursor-not-allowed pointer-events-none"
          : ""
      }`}
      disabled={disabled}
    >
      {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
    </button>

    <button
      title="Adelantar 5 seg. (→)"
      onClick={onSkipForward}
      className={`player-button ${
        disabled
          ? "opacity-50 grayscale cursor-not-allowed pointer-events-none"
          : ""
      }`}
      disabled={disabled}
    >
      <SkipForward />
    </button>
  </div>
);
