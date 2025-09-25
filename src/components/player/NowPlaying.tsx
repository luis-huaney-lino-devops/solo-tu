"use client";
import React from "react";
import { Header } from "./Header";
import { LyricsView } from "./LyricsView";

interface NowPlayingProps {
  title: string;
  artista: string;
  lyricText: string;
  lyricIndex: number;
}

export const NowPlaying: React.FC<NowPlayingProps> = ({
  title,
  artista,
  lyricText,
  lyricIndex,
}) => {
  return (
    <div className="flex flex-col gap-3">
      <Header title={title} artista={artista} />
      <LyricsView text={lyricText} index={lyricIndex} />
    </div>
  );
};
