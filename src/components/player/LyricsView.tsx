"use client";
import React from "react";
import { AnimatePresence, motion } from "framer-motion";

interface LyricsViewProps {
  text: string;
  index: number;
}

export const LyricsView: React.FC<LyricsViewProps> = ({ text, index }) => {
  const variants = {
    enter: { opacity: 0, y: 20 },
    center: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
  };

  return (
    <div className="lyrics-section">
      <div className="lyrics-container">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={`${index}-current`}
            initial="enter"
            animate="center"
            exit="exit"
            variants={variants}
            className="lyrics-text"
          >
            {text || ""}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
