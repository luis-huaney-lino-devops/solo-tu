"use client";
import React from "react";
import { Minus, Plus } from "lucide-react";

interface VolumeControlsProps {
  volume: number;
  onVolumeChange: (value: number) => void;
  onIncrease: () => void;
  onDecrease: () => void;
  disabled: boolean;
  compact?: boolean;
  powered?: boolean;
}

export const VolumeControls: React.FC<VolumeControlsProps> = ({
  volume,
  onVolumeChange,
  onIncrease,
  onDecrease,
  disabled,
  compact = false,
  powered = true,
}) => {
  const isPoweredOff = !powered;
  const isDisabled = disabled || isPoweredOff;

  return (
    <div
      className={`
        flex flex-col gap-1 items-center
        ${compact ? "scale-85 gap-0.5" : "gap-2"}
        ${isPoweredOff ? "opacity-30 grayscale brightness-50" : ""}
        transition-all duration-500 ease-out
      `}
    >
      <div
        className={`flex items-center gap-1 ${compact ? "gap-0.5" : "gap-2"}`}
      >
        <button
          title="Bajar Volumen (Flecha abajo)"
          onClick={onDecrease}
          className={`
            player-button transition-all duration-300
            ${compact ? "p-1 w-6 h-6" : "p-1.5 w-8 h-8"}
            ${
              isDisabled
                ? "opacity-50 grayscale cursor-not-allowed pointer-events-none"
                : "hover:scale-110 hover:bg-amber-800/20"
            }
            ${isPoweredOff ? "filter brightness-75" : ""}
          `}
          disabled={isDisabled}
        >
          <Minus className={compact ? "w-3 h-3" : "w-4 h-4"} />
        </button>

        <input
          type="range"
          className={`
            w-[200px]
            ${compact ? "w-20 h-1" : "w-32 h-1.5"}
            bg-amber-900/30 rounded-full appearance-none cursor-pointer
            ${isPoweredOff ? "opacity-50 cursor-not-allowed" : ""}
            transition-all duration-300
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:w-3
            [&::-webkit-slider-thumb]:h-3
            [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:bg-amber-400
            [&::-webkit-slider-thumb]:shadow-lg
            [&::-webkit-slider-thumb]:shadow-amber-900/30
            [&::-webkit-slider-thumb]:transition-all
            [&::-webkit-slider-thumb]:duration-200
            ${
              !isPoweredOff
                ? "[&::-webkit-slider-thumb]:hover:scale-125 [&::-webkit-slider-thumb]:hover:bg-amber-300"
                : ""
            }
            ${isPoweredOff ? "[&::-webkit-slider-thumb]:bg-gray-500" : ""}
          `}
          style={{
            background: isPoweredOff
              ? "linear-gradient(to right, #6b7280 0%, #6b7280 100%)"
              : `linear-gradient(to right, #d4af37 0%, #d4af37 ${volume}%, #92400e ${volume}%, #92400e 100%)`,
          }}
          min="0"
          max="100"
          value={volume}
          onChange={(e) => onVolumeChange(Number(e.target.value))}
          disabled={isDisabled}
        />

        <button
          title="Subir Volumen (Flecha arriba)"
          onClick={onIncrease}
          className={`
            player-button transition-all duration-300
            ${compact ? "p-1 w-6 h-6" : "p-1.5 w-8 h-8"}
            ${
              isDisabled
                ? "opacity-50 grayscale cursor-not-allowed pointer-events-none"
                : "hover:scale-110 hover:bg-amber-800/20"
            }
            ${isPoweredOff ? "filter brightness-75" : ""}
          `}
          disabled={isDisabled}
        >
          <Plus className={compact ? "w-3 h-3" : "w-4 h-4"} />
        </button>
      </div>

      <span
        className={`
          text-amber-100 font-mono text-xs font-medium
          ${compact ? "text-xs" : "text-sm"}
          ${isPoweredOff ? "text-gray-500" : ""}
          transition-colors duration-300
        `}
      >
        {Math.round(volume)}%
      </span>
    </div>
  );
};
