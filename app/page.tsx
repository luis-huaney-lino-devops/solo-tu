"use client";
import LyricsPlayer from "@/src/components/reproductor";

export default function Home() {
  return (
    <div
      style={{ background: "linear-gradient(135deg, #2c1810, #1a0f08)" }}
      className="min-h-screen flex items-center justify-center p-1"
    >
      <LyricsPlayer />
    </div>
  );
}
