"use client";
import React from "react";

interface TimeSliderProps {
  currentTime: number;
  duration: number;
  disabled: boolean;
  onSeek: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDragStart: () => void;
  onDragEnd: () => void;
  formatTime: (s: number) => string;
  compact?: boolean;
  powered?: boolean;
}

export const TimeSlider: React.FC<TimeSliderProps> = ({
  currentTime,
  duration,
  disabled,
  onSeek,
  onDragStart,
  onDragEnd,
  formatTime,
  compact = false,
  powered = true,
}) => {
  const isPoweredOff = !powered;
  const isDisabled = disabled || isPoweredOff;
  
  return (
    <div 
      className={`
        flex items-center gap-2
        ${compact ? "gap-1.5 scale-95" : "gap-3"}
        ${isPoweredOff ? "opacity-30 grayscale brightness-50" : ""}
        transition-all duration-500 ease-out
      `}
    >
      <span 
        className={`
          text-amber-100 font-mono text-xs
          ${compact ? "text-xs min-w-[2.5rem]" : "text-sm min-w-[3rem]"}
          ${isPoweredOff ? "text-gray-500" : ""}
          transition-colors duration-300
        `}
      >
        {formatTime(currentTime)}
      </span>
      
      <input
        type="range"
        className={`
          flex-grow h-1 bg-amber-900/30 rounded-full appearance-none cursor-pointer
          ${compact ? "h-1" : "h-1.5"}
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
          ${!isPoweredOff ? "[&::-webkit-slider-thumb]:hover:scale-125 [&::-webkit-slider-thumb]:hover:bg-amber-300" : ""}
          ${isPoweredOff ? "[&::-webkit-slider-thumb]:bg-gray-500" : ""}
        `}
        style={{
          background: isPoweredOff 
            ? 'linear-gradient(to right, #6b7280 0%, #6b7280 100%)'
            : `linear-gradient(to right, #d4af37 0%, #d4af37 ${(currentTime / (duration || 1)) * 100}%, #92400e ${(currentTime / (duration || 1)) * 100}%, #92400e 100%)`
        }}
        min="0"
        max={duration || 0}
        value={currentTime}
        onChange={onSeek}
        onMouseDown={onDragStart}
        onMouseUp={onDragEnd}
        disabled={isDisabled}
      />
      
      <span 
        className={`
          text-amber-100 font-mono text-xs
          ${compact ? "text-xs min-w-[2.5rem]" : "text-sm min-w-[3rem]"}
          ${isPoweredOff ? "text-gray-500" : ""}
          transition-colors duration-300
        `}
      >
        {formatTime(duration)}
      </span>
    </div>
  );
};
