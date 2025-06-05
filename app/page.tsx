"use client";
import LyricsPlayer from "@/src/components/reproductor";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-800">
      <LyricsPlayer />
    </div>
  );
}
