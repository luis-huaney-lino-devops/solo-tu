"use client";
import React, { useEffect, useState } from "react";
import { AnimatePresence, motion, useAnimation } from "framer-motion";
import "./css/letras.css";
interface LyricsViewProps {
  text: string;
  index: number;
  className?: string;
  showLineNumbers?: boolean;
  highlightColor?: string;
  textSize?: "sm" | "md" | "lg" | "xl";
  animationType?: "slide" | "fade" | "scale" | "bounce";
  powered?: boolean;
}

export const LyricsView: React.FC<LyricsViewProps> = ({
  text,
  index,
  className = "",
  showLineNumbers = false,
  highlightColor = "#00ff41",
  textSize = "md",
  animationType = "slide",
  powered = true,
}) => {
  const [displayText, setDisplayText] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const controls = useAnimation();

  // Efecto de escritura gradual
  useEffect(() => {
    if (text) {
      setDisplayText("");
      let currentIndex = 0;
      const timer = setInterval(() => {
        if (currentIndex <= text.length) {
          setDisplayText(text.slice(0, currentIndex));
          currentIndex++;
        } else {
          clearInterval(timer);
          setIsVisible(true);
        }
      }, 30);

      return () => clearInterval(timer);
    }
  }, [text, index]);

  // Variantes de animación mejoradas
  const getVariants = () => {
    const baseVariants = {
      enter: {
        opacity: 0,
        scale: 0.9,
        y: 20,
        x: 0,
      },
      center: {
        opacity: 1,
        scale: 1,
        y: 0,
        x: 0,
        transition: {
          type: "spring",
          stiffness: 300,
          damping: 25,
          duration: 0.5,
          ease: [0.25, 0.46, 0.45, 0.94],
        },
      },
      exit: {
        opacity: 0,
        scale: 0.95,
        y: -30,
        x: 0,
        transition: {
          duration: 0.6,
          ease: "easeOut",
        },
      },
    };

    return baseVariants;
  };

  const textSizeClasses = {
    sm: "text-sm md:text-base",
    md: "text-base md:text-lg",
    lg: "text-lg md:text-xl",
    xl: "text-xl md:text-2xl",
  };

  const handleTextClick = () => {
    controls.start({
      scale: [1, 1.05, 1],
      transition: { duration: 0.3 },
    });
  };

  const isPoweredOff = !powered;

  return (
    <div
      className={`
        karaoke-screen ${className}
        ${isPoweredOff ? "opacity-30 grayscale brightness-50" : ""}
        transition-all duration-500 ease-out
      `}
    >
      {/* Contenedor principal de karaoke */}
      <div className="lyrics-section justify-center items-center flex h-[90%]">
        <div className="lyrics-container">
          {/* Número de línea */}
          {showLineNumbers && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 0.6, x: 0 }}
              className="absolute left-2 top-2 z-10"
            >
              <span className="text-xs font-mono text-amber-300 opacity-60">
                {String(index + 1).padStart(2, "0")}
              </span>
            </motion.div>
          )}

          {/* Texto animado con efecto karaoke */}
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={`lyrics-${index}`}
              initial="enter"
              animate="center"
              exit="exit"
              variants={getVariants()}
              className="relative w-full"
              onClick={handleTextClick}
            >
              {/* Bouncing Ball Indicator */}
              {isVisible && (
                <motion.div
                  className="karaoke-ball"
                  animate={{
                    left: [
                      `0%`,
                      `${Math.min(
                        100,
                        (displayText.length / text.length) * 100
                      )}%`,
                    ],
                  }}
                  transition={{
                    duration: text.length * 0.05,
                    ease: "linear",
                  }}
                />
              )}

              {/* Texto principal con efecto karaoke */}
              <motion.div
                className={`lyrics-text ${isVisible ? "lyrics-highlight" : ""}`}
                initial={{ opacity: 0.8, scale: 0.95 }}
                animate={{
                  opacity: isVisible ? 1 : 0.9,
                  scale: isVisible ? 1 : 0.98,
                  transition: { duration: 0.5 },
                }}
                style={{
                  filter: "none",
                  textRendering: "optimizeLegibility",
                  WebkitFontSmoothing: "antialiased",
                  MozOsxFontSmoothing: "grayscale",
                }}
              >
                {/* Texto con efecto de escritura */}
                <span
                  className={`
                    relative
                    ${isPoweredOff ? "text-gray-500" : ""}
                  `}
                >
                  {isPoweredOff ? "---------------" : displayText || "♪ ♫ ♪"}

                  {/* Cursor de escritura mejorado */}
                  {!isVisible && displayText && (
                    <motion.span
                      className="inline-block ml-1 w-0.5 h-6 bg-amber-300"
                      animate={{ opacity: [0, 1, 0] }}
                      transition={{
                        duration: 0.8,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      style={{
                        boxShadow: "0 0 10px rgba(212, 175, 55, 0.8)",
                      }}
                    />
                  )}
                </span>
              </motion.div>

              {/* Sparkle Effects */}
              {isVisible && (
                <>
                  {[...Array(6)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="sparkle"
                      style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                      }}
                      animate={{
                        opacity: [0, 1, 0],
                        scale: [0, 1.5, 0],
                        rotate: [0, 180, 360],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        delay: Math.random() * 2,
                        ease: "easeInOut",
                      }}
                    />
                  ))}
                </>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Progress Bar */}
          <div className="karaoke-progress">
            <motion.div
              className="karaoke-progress-fill"
              animate={{
                width: `${Math.min(
                  100,
                  (displayText.length / text.length) * 100
                )}%`,
              }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            />
          </div>
        </div>
      </div>

      {/* Floating Musical Notes */}
      {isVisible && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-amber-300 text-lg opacity-50"
              style={{
                left: `${20 + i * 30}%`,
                top: `${10 + i * 20}%`,
              }}
              animate={{
                y: [-10, -30, -10],
                opacity: [0.5, 0.8, 0.5],
                rotate: [-5, 5, -5],
              }}
              transition={{
                duration: 2 + i * 0.5,
                repeat: Infinity,
                delay: i * 0.7,
                ease: "easeInOut",
              }}
            >
              {["♪", "♫", "♬"][i]}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

// Hook personalizado para usar con el componente
export const useLyricsAnimation = (totalLines: number) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const nextLine = () => {
    setCurrentIndex((prev) => (prev + 1) % totalLines);
  };

  const prevLine = () => {
    setCurrentIndex((prev) => (prev - 1 + totalLines) % totalLines);
  };

  const goToLine = (index: number) => {
    setCurrentIndex(Math.max(0, Math.min(index, totalLines - 1)));
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  return {
    currentIndex,
    isPlaying,
    nextLine,
    prevLine,
    goToLine,
    togglePlay,
    setCurrentIndex,
    setIsPlaying,
  };
};
