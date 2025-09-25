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
    <div className="flex items-center gap-3">
      <div className="relative">
        <input
          id="checkbox"
          type="checkbox"
          checked={powered}
          onChange={onToggle}
          disabled={disabled}
          className="sr-only"
        />
        <label
          htmlFor="checkbox"
          className={`switch ${
            disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
          }`}
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
            className={`slider w-8 h-8 transition-all duration-300 ${
              powered ? "text-emerald-500 drop-shadow-md" : "text-gray-400"
            }`}
            fill="currentColor"
          >
            <path d="M288 32c0-17.7-14.3-32-32-32s-32 14.3-32 32V256c0 17.7 14.3 32 32 32s32-14.3 32-32V32zM143.5 120.6c13.6-11.3 15.4-31.5 4.1-45.1s-31.5-15.4-45.1-4.1C49.7 115.4 16 181.8 16 256c0 132.5 107.5 240 240 240s240-107.5 240-240c0-74.2-33.8-140.6-86.6-184.6c-13.6-11.3-33.8-9.4-45.1 4.1s-9.4 33.8 4.1 45.1c38.9 32.3 63.5 81 63.5 135.4c0 97.2-78.8 176-176 176s-176-78.8-176-176c0-54.4 24.7-103.1 63.5-135.4z"></path>
          </svg>
        </label>
      </div>
      {/* <span
        className={`text-sm font-medium transition-colors duration-300 ${
          powered ? "text-emerald-600" : "text-gray-500"
        }`}
      >
        {powered ? "Rocola encendida" : "Rocola apagada"}
      </span> */}
    </div>
  );
};
