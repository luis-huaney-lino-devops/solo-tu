"use client";
import React, { useMemo, useState, useEffect } from "react";

interface PhotoCue {
  time: number;
  text: string; // image url
}

interface PhotoCueViewProps {
  currentTime: number;
  cues: PhotoCue[];
}

const gradients = [
  "from-pink-400 via-purple-500 to-indigo-600",
  "from-blue-400 via-cyan-500 to-teal-600",
  "from-rose-400 via-pink-500 to-purple-600",
  "from-orange-400 via-red-500 to-pink-600",
  "from-emerald-400 via-teal-500 to-blue-600",
  "from-violet-400 via-purple-500 to-pink-600",
  "from-amber-400 via-orange-500 to-red-600",
  "from-green-400 via-emerald-500 to-teal-600",
  "from-indigo-400 via-blue-500 to-cyan-600",
  "from-fuchsia-400 via-pink-500 to-rose-600",
];

// Marcos/contornos variados y agradables
const frames = [
  // redondeado suave con ring
  "rounded-2xl ring-4 ring-white/25 ring-offset-2 ring-offset-black/10",
  // bordes más marcados con borde sólido
  "rounded-xl border-[3px] border-white/30",
  // muy redondeado con doble ring sutil
  "rounded-3xl ring-2 ring-white/30 shadow-inner shadow-black/20",
  // borde punteado/dashed
  "rounded-2xl border-2 border-dashed border-white/40",
  // redondeado custom y outline
  "rounded-[28px] outline outline-[3px] outline-white/20",
  // contorno ancho translúcido
  "rounded-2xl ring-8 ring-white/10",
];

// Formas poligonales compatibles entre sí (mismo número de puntos) para morph animado
// Nota: coordenadas en porcentaje (x y)
const shapes: string[] = [
  // octágono (aprox círculo)
  "polygon(50% 0%, 73% 7%, 93% 27%, 100% 50%, 93% 73%, 73% 93%, 50% 100%, 27% 93%, 7% 73%, 0% 50%, 7% 27%, 27% 7%)",

  // rombo
  "polygon(50% 0%, 70% 10%, 100% 50%, 70% 90%, 50% 100%, 30% 90%, 0% 50%, 30% 10%)",

  // nube suave/redondeada (más romántica)
  "polygon(40% 10%, 55% 5%, 70% 15%, 85% 25%, 95% 45%, 90% 65%, 75% 80%, 55% 90%, 35% 95%, 15% 80%, 5% 55%, 12% 30%)",

  // nube pequeña tipo pompón
  "polygon(30% 20%, 45% 10%, 60% 15%, 75% 30%, 85% 50%, 75% 70%, 55% 80%, 35% 75%, 20% 55%, 18% 35%)",

  // hoja/asimétrica (mejorada)
  "polygon(50% 0%, 78% 15%, 95% 40%, 85% 70%, 60% 100%, 40% 95%, 15% 70%, 5% 40%, 22% 15%)",

  // flor de 8 pétalos aprox
  "polygon(50% 5%, 65% 12%, 85% 20%, 95% 40%, 92% 60%, 80% 80%, 60% 92%, 50% 95%, 40% 92%, 20% 80%, 8% 60%, 5% 40%, 15% 20%, 35% 12%)",

  // flor de 6 pétalos
  "polygon(50% 0%, 65% 15%, 85% 25%, 95% 50%, 85% 75%, 65% 85%, 50% 100%, 35% 85%, 15% 75%, 5% 50%, 15% 25%, 35% 15%)",

  // estrella redondeada (suave)
  "polygon(50% 0%, 62% 18%, 80% 20%, 68% 38%, 72% 58%, 50% 48%, 28% 58%, 32% 38%, 20% 20%, 38% 18%)",

  // corazón clásico ❤️
  "polygon(50% 85%, 20% 55%, 20% 30%, 35% 15%, 50% 25%, 65% 15%, 80% 30%, 80% 55%)",

  // corazón más redondeado
  "polygon(50% 90%, 18% 55%, 18% 28%, 35% 10%, 50% 20%, 65% 10%, 82% 28%, 82% 55%)",

  // corazón partido (romántico dramático 💔)
  "polygon(50% 90%, 22% 55%, 22% 28%, 38% 12%, 50% 25%, 62% 12%, 78% 28%, 78% 55%, 52% 90%)",
];

export const PhotoCueView: React.FC<PhotoCueViewProps> = ({
  currentTime,
  cues,
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [previousUrl, setPreviousUrl] = useState<string | null>(null);

  const activeData = useMemo(() => {
    if (!Array.isArray(cues) || cues.length === 0) return null;

    let url: string | null = null;
    let cueIndex = 0;

    for (let i = 0; i < cues.length; i++) {
      const thisCue = cues[i];
      const nextTime = cues[i + 1]?.time ?? Infinity;
      if (currentTime >= thisCue.time && currentTime < nextTime) {
        url = thisCue.text;
        cueIndex = i;
        break;
      }
      if (currentTime >= thisCue.time) {
        url = thisCue.text;
        cueIndex = i;
      }
    }

    return url
      ? {
          url,
          gradient: gradients[cueIndex % gradients.length],
          frame: frames[cueIndex % frames.length],
          shape: shapes[cueIndex % shapes.length],
          key: `${cueIndex}-${url}`,
        }
      : null;
  }, [currentTime, cues]);

  // Reset loaded state when image changes
  useEffect(() => {
    if (activeData?.url && activeData.url !== previousUrl) {
      setImageLoaded(false);
      setPreviousUrl(activeData.url);
    }
  }, [activeData?.url, previousUrl]);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  if (!activeData) return null;

  return (
    <div className="w-full flex items-center justify-center my-6">
      <div
        key={activeData.key}
        className={`
          relative w-64 h-64 overflow-hidden
          ${activeData.frame}
          bg-gradient-to-br ${activeData.gradient}
          shadow-2xl shadow-black/20
          transform transition-all duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)]
          animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-4
          hover:scale-105 hover:shadow-3xl
          before:absolute before:inset-0 before:bg-gradient-to-t 
          before:from-black/20 before:via-transparent before:to-white/10
          before:opacity-50 before:transition-opacity before:duration-700
        `}
        style={{
          clipPath: activeData.shape as any,
          WebkitClipPath: activeData.shape as any,
          transition: "clip-path 1400ms cubic-bezier(0.22,1,0.36,1)",
        }}
      >
        {/* Decorative gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-black/20 z-10 pointer-events-none" />

        {/* Main image */}
        <img
          src={activeData.url}
          alt="Foto de la canción"
          className={`
            w-full h-full object-cover
            transition-all duration-[1100ms] ease-[cubic-bezier(0.22,1,0.36,1)]
            ${
              imageLoaded
                ? "opacity-100 scale-100 blur-0"
                : "opacity-0 scale-110 blur-sm"
            }
          `}
          onLoad={handleImageLoad}
        />

        {/* Loading placeholder */}
        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          </div>
        )}

        {/* Subtle glow effect */}
        <div className="absolute inset-0 rounded-2xl shadow-inner shadow-white/10" />

        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/30 to-transparent z-20" />
      </div>
    </div>
  );
};
