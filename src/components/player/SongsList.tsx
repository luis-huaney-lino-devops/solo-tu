"use client";
import React from "react";
import { Play } from "lucide-react";

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
}) => {
  return (
    <div className="w-full mt-4">
      <div className="bg-gray-50 rounded-lg p-3 max-h-80 overflow-y-auto">
        <div className="space-y-2">
          {songs.map((song) => (
            <button
              key={song.id}
              className={`w-full p-3 rounded-lg border transition-all duration-200 hover:shadow-md flex items-center gap-3 text-left ${
                selectedSongId === song.id
                  ? "bg-blue-100 border-blue-300 shadow-sm"
                  : "bg-white border-gray-200 hover:bg-gray-50"
              } ${
                disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
              }`}
              onClick={() => !disabled && onSelect(song)}
              disabled={disabled}
            >
              {/* Imagen del álbum */}
              <div className="flex-shrink-0">
                <img
                  src={song.foto_album}
                  alt={`Álbum de ${song.titulo}`}
                  className="w-12 h-12 rounded-md object-cover bg-gray-200"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = "none";
                    const parent = target.parentElement;
                    if (parent) {
                      parent.innerHTML = `<div class="w-12 h-12 rounded-md bg-gray-200 flex items-center justify-center"><svg class="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg></div>`;
                    }
                  }}
                />
              </div>

              {/* Información de la canción */}
              <div className="flex-grow min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-medium text-gray-900 truncate text-sm">
                    {song.titulo}
                  </h3>
                  {selectedSongId === song.id && (
                    <Play className="w-4 h-4 text-blue-600 flex-shrink-0" />
                  )}
                </div>
                <p className="text-sm text-gray-600 truncate">{song.artista}</p>
              </div>

              {/* Duración */}
              <div className="flex-shrink-0 text-sm text-gray-500 font-mono">
                {formatDuration(song.duracion)}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
