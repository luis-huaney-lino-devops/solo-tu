"use client";
import React from "react";
import Image from "next/image";

interface RotatingDiscProps {
  isPlaying: boolean;
  powered?: boolean;
  albumImage?: string;
}

export const RotatingDisc: React.FC<RotatingDiscProps> = ({ 
  isPlaying, 
  powered = true, 
  albumImage 
}) => {
  const isPoweredOff = !powered;
  
  return (
    <div 
      className={`
        disc-container relative
        ${isPoweredOff ? "opacity-40 grayscale brightness-75" : ""}
        transition-all duration-500 ease-out
      `}
    >
      {/* Disco principal */}
      <Image
        width={230}
        height={230}
        className={`
          disc-image disc-rotating 
          ${isPlaying && !isPoweredOff ? "playing" : ""}
          ${isPoweredOff ? "grayscale brightness-50" : ""}
          transition-all duration-500
        `}
        src="/img/disc.png"
        alt="Disco"
      />
      
      {/* Imagen del álbum en el centro */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div 
          className={`
            relative w-20 h-20 rounded-full overflow-hidden
            border-2 shadow-lg
            ${isPlaying && !isPoweredOff ? "animate-spin" : ""}
            ${isPoweredOff 
              ? "grayscale brightness-50 border-gray-500/30" 
              : "border-amber-400/30"
            }
            transition-all duration-500
          `}
          style={{
            animationDuration: isPlaying && !isPoweredOff ? "3s" : "0s",
            animationTimingFunction: "linear",
            animationIterationCount: "infinite"
          }}
        >
          {albumImage ? (
            <Image
              src={albumImage}
              alt="Portada del álbum"
              width={80}
              height={80}
              className={`
                w-full h-full object-cover
                ${isPoweredOff ? "grayscale brightness-75" : ""}
                transition-all duration-500
              `}
              onError={(e) => {
                console.warn('Error loading album image:', albumImage);
                const target = e.target as HTMLImageElement;
                target.style.display = "none";
                // Mostrar fallback
                const parent = target.parentElement;
                if (parent) {
                  parent.innerHTML = `
                    <div class="w-full h-full flex items-center justify-center bg-gradient-to-br ${isPoweredOff ? 'from-gray-700 to-gray-800' : 'from-amber-800 to-amber-900'}">
                      <svg class="w-8 h-8 ${isPoweredOff ? 'text-gray-400' : 'text-amber-300'}" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
                      </svg>
                    </div>
                  `;
                }
              }}
              priority={false}
              unoptimized={false}
            />
          ) : (
            // Fallback cuando no hay imagen de álbum
            <div 
              className={`
                w-full h-full flex items-center justify-center
                bg-gradient-to-br
                ${isPoweredOff 
                  ? "from-gray-700 to-gray-800" 
                  : "from-amber-800 to-amber-900"
                }
              `}
            >
              <svg 
                className={`
                  w-8 h-8
                  ${isPoweredOff ? "text-gray-400" : "text-amber-300"}
                `} 
                fill="currentColor" 
                viewBox="0 0 24 24"
              >
                <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
              </svg>
            </div>
          )}
          
          {/* Círculo central del disco */}
          <div 
            className={`
              absolute inset-0 flex items-center justify-center
              before:absolute before:w-3 before:h-3 before:rounded-full
              ${isPoweredOff 
                ? "before:bg-gray-600 before:shadow-gray-800/50" 
                : "before:bg-amber-900 before:shadow-amber-900/50"
              }
              before:shadow-lg before:transition-all before:duration-500
            `}
          />
        </div>
      </div>
      
      {/* Aguja del tocadiscos */}
      <Image
        width={230}
        height={230}
        className={`
          disc-image
          ${isPoweredOff ? "grayscale brightness-50" : ""}
          transition-all duration-500
        `}
        src="/img/pin.png"
        alt="Pin"
      />
    </div>
  );
};
