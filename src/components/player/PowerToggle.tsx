"use client";
import React from "react";
import "./css/boton_apagado.css";
interface PowerToggleProps {
  powered: boolean;
  onToggle: () => void;
  disabled: boolean;
}

export const PowerToggle: React.FC<PowerToggleProps> = ({
  powered,
  onToggle,
  disabled,
}) => {
  return (
    <div 
      className={`
        flex items-center gap-3
        ${!powered ? "opacity-60 grayscale brightness-75" : ""}
        transition-all duration-500 ease-out
      `}
    >
      <div className="relative">
        <input
          id="checkbox"
          type="checkbox"
          checked={powered}
          onChange={() => {
            if (disabled) return;
            try {
              const nextPowered = !powered;
              const src = nextPowered
                ? "/sources/audio/on.mp3"
                : "/sources/audio/of.mp3";
              const audio = new Audio(src);
              audio.volume = 0.7;
              void audio.play();
            } catch {
              // noop
            } finally {
              onToggle();
            }
          }}
          disabled={disabled}
          className="sr-only"
        />
        <label
          htmlFor="checkbox"
          className={`
            switch 
            ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
            ${!powered ? "grayscale brightness-50" : ""}
            transition-all duration-500
          `}
          title={powered ? "Apagar rocola" : "Prender rocola"}
          aria-disabled={disabled}
          onClick={(e) => {
            if (disabled) {
              e.preventDefault();
              e.stopPropagation();
            }
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
            className={`
              slider w-8 h-8 transition-all duration-500
              ${powered 
                ? "text-emerald-500 drop-shadow-md filter-none" 
                : "text-gray-400 grayscale brightness-75"
              }
            `}
            fill="currentColor"
          >
            <path d="M288 32c0-17.7-14.3-32-32-32s-32 14.3-32 32V256c0 17.7 14.3 32 32 32s32-14.3 32-32V32zM143.5 120.6c13.6-11.3 15.4-31.5 4.1-45.1s-31.5-15.4-45.1-4.1C49.7 115.4 16 181.8 16 256c0 132.5 107.5 240 240 240s240-107.5 240-240c0-74.2-33.8-140.6-86.6-184.6c-13.6-11.3-33.8-9.4-45.1 4.1s-9.4 33.8 4.1 45.1c38.9 32.3 63.5 81 63.5 135.4c0 97.2-78.8 176-176 176s-176-78.8-176-176c0-54.4 24.7-103.1 63.5-135.4z"></path>
          </svg>
        </label>
      </div>
      
      {/* Indicador de estado visual */}
      <div className="flex items-center gap-2">
        <div 
          className={`
            w-2 h-2 rounded-full transition-all duration-500
            ${powered 
              ? "bg-emerald-500 shadow-emerald-500/50 shadow-md animate-pulse" 
              : "bg-gray-500 shadow-gray-500/30 shadow-sm"
            }
          `}
        />
        <span
          className={`
            text-xs font-medium transition-all duration-500
            ${powered ? "text-emerald-600" : "text-gray-500"}
          `}
        >
          {powered ? "ON" : "OFF"}
        </span>
      </div>
    </div>
  );
};
