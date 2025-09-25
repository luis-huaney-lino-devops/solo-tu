"use client";
import React from "react";
import "./css/titulo-cancion.css";

interface HeaderProps {
  title: string;
  artista: string;
  powered?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ title, artista, powered = true }) => {
  const isPoweredOff = !powered;
  
  return (
    <>
      {/* <div className="card__subtitle">{title}</div> */}

      <div 
        className={`
          radio-container transition-all duration-500 ease-out
          ${isPoweredOff ? "opacity-40 grayscale brightness-75" : ""}
        `}
      >
        <div className="display-frame">
          <div 
            className={`
              display-screens transition-all duration-500
              ${isPoweredOff ? "bg-gray-800/50" : ""}
            `}
          >
            <div className="segments"></div>
            <div 
              className={`
                display-text transition-all duration-500
                ${isPoweredOff ? "text-gray-500 opacity-50" : ""}
              `}
            >
              {isPoweredOff ? "--- APAGADO ---" : title}
            </div>
            <div 
              className={`
                frequency-display transition-all duration-500
                ${isPoweredOff ? "text-gray-600 opacity-50" : ""}
              `}
            >
              {isPoweredOff ? "Sin señal" : artista}
            </div>
          </div>
        </div>

        {/* <div className="radio-controls">
          <div className="led-indicator"></div>
          <div className="led-indicator green"></div>
          <div className="led-indicator orange"></div>
        </div> */}

        {/* <div className="vintage-text">CLASSIC RADIO</div> */}
      </div>
    </>
  );
};
