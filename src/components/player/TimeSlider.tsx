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
}

export const TimeSlider: React.FC<TimeSliderProps> = ({
  currentTime,
  duration,
  disabled,
  onSeek,
  onDragStart,
  onDragEnd,
  formatTime,
}) => (
  <div className="time-slider-container">
    <span className="time-label">{formatTime(currentTime)}</span>
    <input
      type="range"
      className="time-slider"
      min="0"
      max={duration || 0}
      value={currentTime}
      onChange={onSeek}
      onMouseDown={onDragStart}
      onMouseUp={onDragEnd}
      disabled={disabled}
    />
    <span className="time-label">{formatTime(duration)}</span>
  </div>
);
