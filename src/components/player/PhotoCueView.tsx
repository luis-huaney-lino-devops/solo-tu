"use client";
import React, { useMemo, useState, useEffect } from "react";

interface PhotoCue {
  time: number;
  text: string; // image url
  description: string;
}

interface PhotoCueViewProps {
  currentTime: number;
  cues: PhotoCue[];
  powered?: boolean;
}

const gradients = [
  "from-amber-400 via-orange-500 to-red-600",
  "from-yellow-400 via-amber-500 to-orange-600",
  "from-orange-400 via-red-500 to-pink-600",
  "from-amber-300 via-yellow-400 to-orange-500",
  "from-rose-400 via-pink-500 to-red-600",
  "from-yellow-300 via-amber-400 to-yellow-600",
  "from-orange-300 via-amber-400 to-red-500",
  "from-amber-500 via-orange-600 to-red-700",
  "from-yellow-500 via-orange-500 to-red-600",
  "from-amber-400 via-rose-500 to-pink-600",
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

// Formas románticas elegantes y detalladas
const shapes: string[] = [
  // Corazón perfecto con múltiples curvas suaves
  "polygon(50% 88%, 20% 65%, 8% 45%, 8% 30%, 12% 20%, 20% 12%, 30% 8%, 40% 10%, 45% 15%, 50% 22%, 55% 15%, 60% 10%, 70% 8%, 80% 12%, 88% 20%, 92% 30%, 92% 45%, 80% 65%)",

  // Rosa en plena floración con pétalos detallados
  "polygon(50% 8%, 58% 10%, 66% 12%, 74% 16%, 80% 22%, 85% 30%, 88% 38%, 90% 46%, 90% 54%, 88% 62%, 85% 70%, 80% 78%, 74% 84%, 66% 88%, 58% 90%, 50% 92%, 42% 90%, 34% 88%, 26% 84%, 20% 78%, 15% 70%, 12% 62%, 10% 54%, 10% 46%, 12% 38%, 15% 30%, 20% 22%, 26% 16%, 34% 12%, 42% 10%)",

  // Mariposa con alas detalladas y simétricas
  "polygon(50% 25%, 42% 15%, 32% 8%, 20% 10%, 12% 18%, 8% 28%, 10% 38%, 15% 45%, 22% 50%, 30% 52%, 35% 55%, 42% 58%, 48% 62%, 50% 70%, 52% 62%, 58% 58%, 65% 55%, 70% 52%, 78% 50%, 85% 45%, 90% 38%, 92% 28%, 88% 18%, 80% 10%, 68% 8%, 58% 15%, 50% 25%, 46% 35%, 48% 45%, 50% 55%, 52% 45%, 54% 35%)",

  // Flor de loto con pétalos en capas
  "polygon(50% 12%, 57% 14%, 64% 18%, 70% 24%, 75% 32%, 78% 40%, 80% 48%, 78% 56%, 75% 64%, 70% 72%, 64% 78%, 57% 82%, 50% 84%, 43% 82%, 36% 78%, 30% 72%, 25% 64%, 22% 56%, 20% 48%, 22% 40%, 25% 32%, 30% 24%, 36% 18%, 43% 14%)",

  // Diamante romántico con múltiples facetas
  "polygon(50% 5%, 58% 8%, 65% 12%, 72% 18%, 77% 25%, 81% 33%, 84% 42%, 86% 50%, 84% 58%, 81% 67%, 77% 75%, 72% 82%, 65% 88%, 58% 92%, 50% 95%, 42% 92%, 35% 88%, 28% 82%, 23% 75%, 19% 67%, 16% 58%, 14% 50%, 16% 42%, 19% 33%, 23% 25%, 28% 18%, 35% 12%, 42% 8%)",

  // Hoja de vid con nervaduras naturales
  "polygon(50% 8%, 60% 10%, 69% 14%, 77% 20%, 83% 28%, 87% 37%, 89% 46%, 88% 55%, 85% 64%, 80% 72%, 73% 78%, 65% 83%, 56% 86%, 50% 88%, 44% 85%, 37% 80%, 30% 73%, 24% 65%, 20% 56%, 18% 46%, 19% 37%, 22% 28%, 27% 20%, 34% 14%, 42% 10%)",

  // Estrella de 8 puntas con curvas orgánicas
  "polygon(50% 2%, 56% 8%, 63% 12%, 68% 18%, 75% 20%, 70% 26%, 76% 32%, 82% 35%, 85% 42%, 80% 48%, 85% 54%, 82% 61%, 76% 64%, 70% 70%, 75% 76%, 68% 78%, 63% 84%, 56% 88%, 50% 94%, 44% 88%, 37% 84%, 32% 78%, 25% 76%, 30% 70%, 24% 64%, 18% 61%, 15% 54%, 20% 48%, 15% 42%, 18% 35%, 24% 32%, 30% 26%, 25% 20%, 32% 18%, 37% 12%, 44% 8%)",

  // Concha marina en espiral
  "polygon(50% 18%, 58% 20%, 66% 24%, 72% 30%, 77% 37%, 80% 45%, 82% 53%, 83% 61%, 82% 69%, 79% 76%, 75% 82%, 69% 86%, 62% 89%, 54% 90%, 46% 89%, 38% 86%, 31% 82%, 25% 76%, 21% 69%, 18% 61%, 17% 53%, 19% 45%, 23% 37%, 28% 30%, 34% 24%, 42% 20%)",

  // Gota de rocío con reflejos
  "polygon(50% 8%, 58% 12%, 65% 18%, 71% 26%, 75% 35%, 78% 44%, 80% 53%, 81% 62%, 80% 71%, 77% 79%, 72% 85%, 66% 89%, 59% 92%, 50% 94%, 41% 92%, 34% 89%, 28% 85%, 23% 79%, 20% 71%, 19% 62%, 20% 53%, 22% 44%, 25% 35%, 29% 26%, 35% 18%, 42% 12%)",

  // Flor de cerezo (sakura) con 5 pétalos redondeados
  "polygon(50% 18%, 55% 20%, 61% 24%, 66% 30%, 69% 37%, 71% 44%, 72% 51%, 71% 58%, 69% 65%, 66% 72%, 61% 78%, 55% 82%, 50% 84%, 45% 82%, 39% 78%, 34% 72%, 31% 65%, 29% 58%, 28% 51%, 29% 44%, 31% 37%, 34% 30%, 39% 24%, 45% 20%)",

  // Medallón vintage con ornamentos
  "polygon(50% 10%, 56% 12%, 62% 15%, 67% 19%, 72% 24%, 76% 30%, 79% 36%, 81% 43%, 82% 50%, 81% 57%, 79% 64%, 76% 70%, 72% 76%, 67% 81%, 62% 85%, 56% 88%, 50% 90%, 44% 88%, 38% 85%, 33% 81%, 28% 76%, 24% 70%, 21% 64%, 19% 57%, 18% 50%, 19% 43%, 21% 36%, 24% 30%, 28% 24%, 33% 19%, 38% 15%, 44% 12%)",

  // Corazón doble entrelazado con curvas románticas
  "polygon(50% 90%, 25% 68%, 15% 52%, 15% 38%, 20% 28%, 28% 20%, 38% 16%, 45% 18%, 48% 24%, 50% 32%, 52% 24%, 55% 18%, 62% 16%, 72% 20%, 80% 28%, 85% 38%, 85% 52%, 75% 68%, 50% 90%, 47% 78%, 50% 68%, 53% 78%)",

  // Tulipán elegante con tallo curvado
  "polygon(50% 15%, 56% 17%, 62% 21%, 66% 27%, 69% 34%, 70% 42%, 69% 50%, 66% 57%, 62% 63%, 56% 67%, 50% 69%, 44% 67%, 38% 63%, 34% 57%, 31% 50%, 30% 42%, 31% 34%, 34% 27%, 38% 21%, 44% 17%)",

  // Mariposa nocturna con patrones detallados
  "polygon(50% 22%, 45% 12%, 38% 6%, 28% 8%, 20% 14%, 15% 22%, 13% 32%, 16% 40%, 22% 46%, 30% 50%, 38% 52%, 44% 55%, 48% 60%, 50% 68%, 52% 60%, 56% 55%, 62% 52%, 70% 50%, 78% 46%, 84% 40%, 87% 32%, 85% 22%, 80% 14%, 72% 8%, 62% 6%, 55% 12%, 50% 22%, 47% 32%, 50% 42%, 53% 32%)",

  // Hoja de arce romántica
  "polygon(50% 10%, 58% 12%, 65% 16%, 71% 22%, 75% 30%, 77% 38%, 76% 46%, 73% 53%, 68% 59%, 62% 64%, 55% 67%, 50% 68%, 45% 67%, 38% 64%, 32% 59%, 27% 53%, 24% 46%, 23% 38%, 25% 30%, 29% 22%, 35% 16%, 42% 12%)",

  // Corona de princesa con joyas
  "polygon(50% 20%, 54% 15%, 59% 12%, 65% 11%, 70% 13%, 74% 17%, 77% 22%, 79% 28%, 80% 35%, 79% 42%, 77% 48%, 74% 53%, 70% 57%, 65% 59%, 59% 60%, 54% 59%, 50% 56%, 46% 59%, 41% 60%, 35% 59%, 30% 57%, 26% 53%, 23% 48%, 21% 42%, 20% 35%, 21% 28%, 23% 22%, 26% 17%, 30% 13%, 35% 11%, 41% 12%, 46% 15%)",

  // Nube romántica y suave
  "polygon(50% 25%, 58% 22%, 66% 20%, 73% 22%, 79% 26%, 84% 32%, 87% 39%, 88% 46%, 87% 53%, 84% 59%, 79% 64%, 73% 67%, 66% 68%, 58% 67%, 50% 64%, 42% 67%, 34% 68%, 27% 67%, 21% 64%, 16% 59%, 13% 53%, 12% 46%, 13% 39%, 16% 32%, 21% 26%, 27% 22%, 34% 20%, 42% 22%)",

  // Pluma delicada
  "polygon(50% 8%, 55% 10%, 60% 14%, 63% 19%, 65% 25%, 66% 31%, 66% 37%, 65% 43%, 63% 49%, 60% 54%, 56% 58%, 52% 61%, 50% 63%, 48% 61%, 44% 58%, 40% 54%, 37% 49%, 35% 43%, 34% 37%, 34% 31%, 35% 25%, 37% 19%, 40% 14%, 45% 10%)",

  // Globo de corazón flotante
  "polygon(50% 85%, 22% 58%, 22% 42%, 26% 30%, 34% 20%, 44% 14%, 50% 16%, 56% 14%, 66% 20%, 74% 30%, 78% 42%, 78% 58%, 50% 85%, 46% 70%, 50% 58%, 54% 70%)",

  // Cristal de cuarzo rosa
  "polygon(50% 5%, 60% 10%, 68% 18%, 74% 28%, 78% 39%, 80% 50%, 78% 61%, 74% 72%, 68% 82%, 60% 90%, 50% 95%, 40% 90%, 32% 82%, 26% 72%, 22% 61%, 20% 50%, 22% 39%, 26% 28%, 32% 18%, 40% 10%)",
];
export const PhotoCueView: React.FC<PhotoCueViewProps> = ({
  currentTime,
  cues,
  powered = true,
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [previousUrl, setPreviousUrl] = useState<string | null>(null);

  const activeData = useMemo(() => {
    if (!Array.isArray(cues) || cues.length === 0) return null;

    let url: string | null = null;
    let description: string = "";
    let cueIndex = 0;

    for (let i = 0; i < cues.length; i++) {
      const thisCue = cues[i];
      const nextTime = cues[i + 1]?.time ?? Infinity;
      if (currentTime >= thisCue.time && currentTime < nextTime) {
        url = thisCue.text;
        description = thisCue.description;
        cueIndex = i;
        break;
      }
      if (currentTime >= thisCue.time) {
        url = thisCue.text;
        description = thisCue.description;
        cueIndex = i;
      }
    }

    return url
      ? {
          url,
          description,
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

  const isPoweredOff = !powered;

  return (
    <div 
      className={`
        w-full flex items-center flex-col my-6
        ${isPoweredOff ? "opacity-40 grayscale brightness-75" : ""}
        transition-all duration-500 ease-out
      `}
    >
      <div
        key={activeData.key}
        className={`
          relative w-64 h-64 overflow-hidden
          ${activeData.frame}
          bg-gradient-to-br ${isPoweredOff ? "from-gray-600 to-gray-800" : activeData.gradient}
          shadow-2xl shadow-black/20
          transform transition-all duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)]
          animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-4
          ${!isPoweredOff ? "hover:scale-105 hover:shadow-3xl" : ""}
          before:absolute before:inset-0 before:bg-gradient-to-t 
          before:from-black/20 before:via-transparent before:to-white/10
          before:opacity-50 before:transition-opacity before:duration-700
          ${isPoweredOff ? "grayscale brightness-50" : ""}
        `}
        style={{
          // clipPath: activeData.shape,
          // WebkitClipPath: activeData.shape,
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
            ${isPoweredOff ? "grayscale brightness-75 contrast-75" : ""}
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
      {/* Texto elegante con animaciones */}
      <div className="mt-6 px-4 max-w-md">
        <div
          className="
            relative text-center
            animate-in fade-in-0 slide-in-from-bottom-2 duration-1000 delay-300
          "
        >
          {/* Fondo decorativo para el texto */}
          <div
            className="
            absolute inset-0 -inset-x-4 -inset-y-2
            bg-gradient-to-r from-transparent via-amber-900/20 to-transparent
            rounded-2xl blur-sm
          "
          />

          {/* Texto principal */}
          <p
            className={`
            relative z-10
            text-base font-medium leading-relaxed
            text-shadow-lg
            px-4 py-3
            backdrop-blur-sm
            rounded-xl border shadow-lg
            transition-all duration-500 ease-out
            ${isPoweredOff 
              ? "text-gray-400 bg-gradient-to-b from-gray-800/30 to-gray-700/20 border-gray-600/30 shadow-gray-900/20" 
              : "text-amber-100 bg-gradient-to-b from-amber-900/30 to-amber-800/20 border-amber-700/30 shadow-amber-900/20 hover:shadow-xl hover:shadow-amber-900/30 hover:border-amber-600/40 hover:bg-gradient-to-b hover:from-amber-900/40 hover:to-amber-800/30"
            }
          `}
            style={{
              textShadow: isPoweredOff 
                ? "0 2px 4px rgba(0, 0, 0, 0.8)"
                : "0 2px 4px rgba(0, 0, 0, 0.8), 0 0 8px rgba(212, 175, 55, 0.3)",
              fontFamily: '"Fredoka", "Dancing Script", cursive',
            }}
          >
            {isPoweredOff ? "Rocola apagada - Sin imagen" : activeData.description}
          </p>

          {/* Decoración de esquinas */}
          <div className="absolute -top-1 -left-1 w-3 h-3 border-l-2 border-t-2 border-amber-400/60 rounded-tl-lg" />
          <div className="absolute -top-1 -right-1 w-3 h-3 border-r-2 border-t-2 border-amber-400/60 rounded-tr-lg" />
          <div className="absolute -bottom-1 -left-1 w-3 h-3 border-l-2 border-b-2 border-amber-400/60 rounded-bl-lg" />
          <div className="absolute -bottom-1 -right-1 w-3 h-3 border-r-2 border-b-2 border-amber-400/60 rounded-br-lg" />

          {/* Partículas decorativas */}
          <div className="absolute -top-2 left-1/4 w-1 h-1 bg-amber-400/60 rounded-full animate-pulse" />
          <div className="absolute -top-1 right-1/4 w-0.5 h-0.5 bg-amber-300/80 rounded-full animate-pulse delay-300" />
          <div className="absolute -bottom-2 left-1/3 w-1 h-1 bg-amber-400/60 rounded-full animate-pulse delay-700" />
          <div className="absolute -bottom-1 right-1/3 w-0.5 h-0.5 bg-amber-300/80 rounded-full animate-pulse delay-1000" />
        </div>
      </div>
    </div>
  );
};
