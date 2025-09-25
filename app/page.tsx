"use client";
import LyricsPlayer from "@/src/components/reproductor";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-900 via-yellow-800 to-amber-700 flex items-center justify-center p-4">
      <LyricsPlayer />
    </div>
  );
}
