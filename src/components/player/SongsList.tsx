"use client";
import React, { useState } from "react";
import { Play, ChevronDown, ChevronUp, Music } from "lucide-react";

// Tipos basados en tu JSON
interface SongSummary {
  id: number;
  titulo: string;
  artista: string;
  pista: string;
  foto_album: string;
  detalle_datos_musica: string;
  duracion: number;
}

interface SongsListProps {
  songs: SongSummary[];
  selectedSongId: number | null;
  onSelect: (song: SongSummary) => void;
  disabled: boolean;
  powered?: boolean;
}

// Función para convertir segundos a formato mm:ss
const formatDuration = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

export const SongsList: React.FC<SongsListProps> = ({
  songs,
  selectedSongId,
  onSelect,
  disabled,
  powered = true,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const isPoweredOff = !powered;
  const isDisabled = disabled || isPoweredOff;

  const toggleVisibility = () => {
    if (!isDisabled) {
      setIsVisible(!isVisible);
    }
  };

  return (
    <div 
      className={`
        w-full
        ${isPoweredOff ? "opacity-30 grayscale brightness-50" : ""}
        transition-all duration-500 ease-out
      `}
    >
      {/* Botón compacto para mostrar/ocultar la lista */}
      <button
        onClick={toggleVisibility}
        disabled={isDisabled}
        className={`
          w-full p-2 rounded-md mb-2 transition-all duration-300 
          bg-gradient-to-r from-amber-900/20 to-amber-800/20 
          border border-amber-700/30 
          flex items-center justify-between gap-2
          ${isDisabled 
            ? 'opacity-50 cursor-not-allowed' 
            : 'hover:from-amber-900/30 hover:to-amber-800/30 hover:border-amber-600/50 cursor-pointer'
          }
          ${isVisible ? 'shadow-md' : 'shadow-sm'}
          ${isPoweredOff ? "bg-gradient-to-r from-gray-800/20 to-gray-700/20 border-gray-600/30" : ""}
        `}
      >
        <div className="flex items-center gap-2">
          <div className={`p-1 rounded-full ${isPoweredOff ? "bg-gray-700/50" : "bg-amber-800/50"}`}>
            <Music className={`w-3 h-3 ${isPoweredOff ? "text-gray-400" : "text-amber-200"}`} />
          </div>
          <div className="text-left">
            <h3 className={`text-sm font-medium ${isPoweredOff ? "text-gray-400" : "text-amber-200"}`}>
              {isPoweredOff ? "Lista deshabilitada" : "Playlist"}
            </h3>
            <p className={`text-xs ${isPoweredOff ? "text-gray-500" : "text-amber-100/60"}`}>
              {songs.length} canciones
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <span className={`text-xs hidden sm:block ${isPoweredOff ? "text-gray-500" : "text-amber-100/70"}`}>
            {isVisible ? 'Ocultar' : 'Ver'}
          </span>
          {isVisible ? (
            <ChevronUp className={`w-4 h-4 ${isPoweredOff ? "text-gray-400" : "text-amber-200"}`} />
          ) : (
            <ChevronDown className={`w-4 h-4 ${isPoweredOff ? "text-gray-400" : "text-amber-200"}`} />
          )}
        </div>
      </button>

      {/* Lista compacta de canciones */}
      <div 
        className={`
          transition-all duration-500 ease-in-out overflow-hidden
          ${isVisible ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'}
        `}
      >
        <div className={`
          rounded-md p-2 border
          ${isPoweredOff 
            ? "bg-gradient-to-b from-gray-800/10 to-gray-700/5 border-gray-600/20" 
            : "bg-gradient-to-b from-amber-900/15 to-amber-800/5 border-amber-700/20"
          }
        `}>
          <div className="max-h-64 overflow-y-auto space-y-1 scrollbar-thin scrollbar-thumb-amber-700/30 scrollbar-track-transparent">
            {songs.map((song) => (
              <button
                key={song.id}
                className={`
                  w-full p-2 rounded-md border transition-all duration-200 
                  flex items-center gap-2 text-left group
                  ${selectedSongId === song.id
                    ? isPoweredOff 
                      ? "bg-gray-700/30 border-gray-600/40" 
                      : "bg-amber-800/30 border-amber-600/50 shadow-sm"
                    : isPoweredOff
                      ? "bg-gray-800/10 border-gray-700/20"
                      : "bg-amber-900/10 border-amber-700/20 hover:bg-amber-800/20 hover:border-amber-600/40"
                  } 
                  ${isDisabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:shadow-sm"}
                `}
                onClick={() => !isDisabled && onSelect(song)}
                disabled={isDisabled}
              >
                {/* Imagen del álbum compacta */}
                <div className="flex-shrink-0">
                  <img
                    src={song.foto_album}
                    alt={`Álbum de ${song.titulo}`}
                    className={`
                      w-8 h-8 rounded object-cover border
                      ${isPoweredOff 
                        ? "bg-gray-800/30 border-gray-600/30 grayscale" 
                        : "bg-amber-900/20 border-amber-700/30"
                      }
                    `}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = "none";
                      const parent = target.parentElement;
                      if (parent) {
                        parent.innerHTML = `
                          <div class="w-8 h-8 rounded ${isPoweredOff ? 'bg-gray-800/30 border-gray-600/30' : 'bg-amber-900/20 border-amber-700/30'} border flex items-center justify-center">
                            <svg class="w-4 h-4 ${isPoweredOff ? 'text-gray-500' : 'text-amber-400/50'}" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
                            </svg>
                          </div>
                        `;
                      }
                    }}
                  />
                </div>

                {/* Información compacta de la canción */}
                <div className="flex-grow min-w-0">
                  <div className="flex items-center gap-1">
                    <h3 className={`
                      font-medium truncate text-xs
                      ${isPoweredOff 
                        ? "text-gray-400" 
                        : selectedSongId === song.id 
                          ? "text-amber-50" 
                          : "text-amber-100 group-hover:text-amber-50"
                      }
                      transition-colors
                    `}>
                      {song.titulo}
                    </h3>
                    {selectedSongId === song.id && !isPoweredOff && (
                      <Play className="w-3 h-3 text-amber-300 flex-shrink-0 animate-pulse" />
                    )}
                  </div>
                  <p className={`
                    text-xs truncate transition-colors
                    ${isPoweredOff 
                      ? "text-gray-500" 
                      : "text-amber-200/60 group-hover:text-amber-200/80"
                    }
                  `}>
                    {song.artista}
                  </p>
                </div>

                {/* Duración compacta */}
                <div className={`
                  flex-shrink-0 text-xs font-mono transition-colors
                  ${isPoweredOff 
                    ? "text-gray-500" 
                    : "text-amber-300/70 group-hover:text-amber-300"
                  }
                `}>
                  {formatDuration(song.duracion)}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
