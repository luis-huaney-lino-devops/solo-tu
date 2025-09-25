"use client";
import React from "react";
import {
  Pause,
  Play,
  SkipBack,
  SkipForward,
  Volume as VolumeLow,
  Volume1,
  Volume2,
  VolumeX,
} from "lucide-react";

interface PlaybackControlsProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
  onSkipBack: () => void;
  onSkipForward: () => void;
  disabled: boolean;
  onMuteToggle: () => void;
  isMuted: boolean;
  volume: number;
  compact?: boolean;
  powered?: boolean;
}

const getVolumeIcon = (isMuted: boolean, volume: number) => {
  if (isMuted || volume === 0) return <VolumeX />;
  if (volume < 30) return <VolumeLow />;
  if (volume < 70) return <Volume1 />;
  return <Volume2 />;
};

export const PlaybackControls: React.FC<PlaybackControlsProps> = ({
  isPlaying,
  onTogglePlay,
  onSkipBack,
  onSkipForward,
  disabled,
  onMuteToggle,
  isMuted,
  volume,
  compact = false,
  powered = true,
}) => {
  const isPoweredOff = !powered;
  const isDisabled = disabled || isPoweredOff;
  
  return (
    <div 
      className={`
        flex items-center justify-center gap-1
        ${compact ? "gap-1 scale-90" : "gap-3"}
        ${isPoweredOff ? "opacity-30 grayscale brightness-50" : ""}
        transition-all duration-500 ease-out
      `}
    >
      <button
        title="Retroceder 5 seg. (←)"
        onClick={onSkipBack}
        className={`
          player-button transition-all duration-300
          ${compact ? "p-1.5" : "p-2"}
          ${isDisabled
            ? "opacity-50 grayscale cursor-not-allowed pointer-events-none"
            : "hover:scale-110 hover:bg-amber-800/20"
          }
          ${isPoweredOff ? "filter brightness-75" : ""}
        `}
        disabled={isDisabled}
      >
        <SkipBack className={compact ? "w-3.5 h-3.5" : "w-5 h-5"} />
      </button>

      <button
        title={isPlaying ? "Pausar (Espacio)" : "Reproducir (Espacio)"}
        onClick={onTogglePlay}
        className={`
          player-button play-button transition-all duration-300
          ${compact ? "w-8 h-8 p-1.5" : "w-12 h-12 p-2"}
          ${isDisabled
            ? "opacity-50 grayscale cursor-not-allowed pointer-events-none"
            : "hover:scale-110 hover:shadow-lg hover:shadow-amber-900/30"
          }
          ${isPoweredOff ? "filter brightness-75 bg-gray-600" : ""}
        `}
        disabled={isDisabled}
      >
        {isPlaying ? (
          <Pause className={compact ? "w-4 h-4" : "w-6 h-6"} />
        ) : (
          <Play className={compact ? "w-4 h-4" : "w-6 h-6"} />
        )}
      </button>

      <button
        title="Adelantar 5 seg. (→)"
        onClick={onSkipForward}
        className={`
          player-button transition-all duration-300
          ${compact ? "p-1.5" : "p-2"}
          ${isDisabled
            ? "opacity-50 grayscale cursor-not-allowed pointer-events-none"
            : "hover:scale-110 hover:bg-amber-800/20"
          }
          ${isPoweredOff ? "filter brightness-75" : ""}
        `}
        disabled={isDisabled}
      >
        <SkipForward className={compact ? "w-3.5 h-3.5" : "w-5 h-5"} />
      </button>
      
      <button
        title="Mutear (M)"
        onClick={onMuteToggle}
        className={`
          player-button transition-all duration-300
          ${compact ? "p-1.5" : "p-2"}
          ${isDisabled
            ? "opacity-50 grayscale cursor-not-allowed pointer-events-none"
            : "hover:scale-110 hover:bg-amber-800/20"
          }
          ${isPoweredOff ? "filter brightness-75" : ""}
        `}
        disabled={isDisabled}
      >
        {getVolumeIcon(isMuted, volume)}
      </button>
    </div>
  );
};
