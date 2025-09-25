"use client";
import React from "react";
import {
  Minus,
  Plus,
  Volume as VolumeLow,
  Volume1,
  Volume2,
  VolumeX,
} from "lucide-react";

interface VolumeControlsProps {
  volume: number;
  isMuted: boolean;
  onMuteToggle: () => void;
  onVolumeChange: (value: number) => void;
  onIncrease: () => void;
  onDecrease: () => void;
  disabled: boolean;
}

const getVolumeIcon = (isMuted: boolean, volume: number) => {
  if (isMuted || volume === 0) return <VolumeX />;
  if (volume < 30) return <VolumeLow />;
  if (volume < 70) return <Volume1 />;
  return <Volume2 />;
};

export const VolumeControls: React.FC<VolumeControlsProps> = ({
  volume,
  isMuted,
  onMuteToggle,
  onVolumeChange,
  onIncrease,
  onDecrease,
  disabled,
}) => (
  <div className="volume-controls">
    <button
      title="Mutear (M)"
      onClick={onMuteToggle}
      className="player-button"
      disabled={disabled}
    >
      {getVolumeIcon(isMuted, volume)}
    </button>
    <button
      title="Bajar Volumen (Flecha abajo)"
      onClick={onDecrease}
      className="player-button"
      disabled={disabled}
    >
      <Minus />
    </button>
    <input
      type="range"
      className="volume-slider"
      min="0"
      max="100"
      value={volume}
      onChange={(e) => onVolumeChange(Number(e.target.value))}
      disabled={disabled}
    />
    <button
      title="Subir Volumen (Flecha arriba)"
      onClick={onIncrease}
      className="player-button"
      disabled={disabled}
    >
      <Plus />
    </button>
    <span className="volume-label">{Math.round(volume)}%</span>
  </div>
);
