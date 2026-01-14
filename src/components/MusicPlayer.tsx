"use client";

import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface Track {
  id: string;
  name: string;
  artist: string;
  audio: string;
}

// Lofi Study Music tracks from samirpaulb/music
const tracks: Track[] = [
  { id: "1", name: "Lofi Study Music 1", artist: "Unknown", audio: "https://spcdn.pages.dev/music/music-1.mp3" },
  { id: "2", name: "Lofi Study Music 2", artist: "Unknown", audio: "https://spcdn.pages.dev/music/music-2.mp3" },
  { id: "3", name: "Lofi Study Music 3", artist: "Unknown", audio: "https://spcdn.pages.dev/music/music-3.mp3" },
  { id: "4", name: "Lofi Study Music 4", artist: "Unknown", audio: "https://spcdn.pages.dev/music/music-4.mp3" },
  { id: "5", name: "Lofi Study Music 5", artist: "Unknown", audio: "https://spcdn.pages.dev/music/music-5.mp3" },
  { id: "6", name: "Lofi Study Music 6", artist: "Unknown", audio: "https://spcdn.pages.dev/music/music-6.mp3" },
  { id: "7", name: "Lofi Study Music 7", artist: "Unknown", audio: "https://spcdn.pages.dev/music/music-7.mp3" },
  { id: "8", name: "Lofi Study Music 8", artist: "Unknown", audio: "https://spcdn.pages.dev/music/music-8.mp3" },
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(50);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = tracks[currentTrackIndex];


  useEffect(() => {
    const loadAndPlayTrack = async () => {
      if (audioRef.current && currentTrack) {
        audioRef.current.pause();
        audioRef.current.src = currentTrack.audio;
        
        if (isPlaying) {
          try {
            await audioRef.current.play();
          } catch (error) {
            if (error instanceof Error && error.name !== 'AbortError') {
              console.error('Error playing audio:', error);
            }
          }
        }
      }
    };
    
    loadAndPlayTrack();
  }, [currentTrack, isPlaying]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  const handlePlayPause = async () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        try {
          await audioRef.current.play();
          setIsPlaying(true);
        } catch (error) {
          // Ignore AbortError when play is interrupted
          if (error instanceof Error && error.name !== 'AbortError') {
            console.error('Error playing audio:', error);
          }
        }
      }
    }
  };

  const handlePrevious = () => {
    setCurrentTrackIndex((prev) => 
      prev === 0 ? tracks.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setCurrentTrackIndex((prev) => 
      prev === tracks.length - 1 ? 0 : prev + 1
    );
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = Number(e.target.value);
    setVolume(newVolume);
  };

  // Auto-play next track when current track ends
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => {
      handleNext();
    };

    audio.addEventListener("ended", handleEnded);
    return () => audio.removeEventListener("ended", handleEnded);
  }, [currentTrackIndex]);

  return (
    <div className="w-full max-w-md">
      <audio ref={audioRef} />
      
      {/* Track Info */}
      <div className="text-center mb-4">
        <h3 className="text-white font-bold text-lg truncate">
          {currentTrack.name}
        </h3>
        <p className="text-white/70 text-sm truncate">
          {currentTrack.artist}
        </p>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4">
        {/* Previous Button */}
        <button
          onClick={handlePrevious}
          className="flex items-center justify-center "
          aria-label="Previous track"
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>

        {/* Play/Pause Button */}
        <button
          onClick={handlePlayPause}
          className="w-14 h-14 rounded-full bg-yellow-400 hover:bg-yellow-300 transition-all flex items-center justify-center shadow-lg"
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? (
            <Pause className="w-7 h-7 text-[#4e022b]" fill="currentColor" />
          ) : (
            <Play className="w-7 h-7 text-[#4e022b]" fill="currentColor" />
          )}
        </button>

        {/* Next Button */}
        <button
          onClick={handleNext}
          className="flex items-center justify-center"
          aria-label="Next track"
        >
          <ChevronRight className="w-6 h-6 text-white" />
        </button>
      </div>

      {/* Track Counter */}
      <div className="text-center mt-3 text-white/60 text-xs">
        {currentTrackIndex + 1} / {tracks.length}
      </div>

      {/* Volume Control */}
      <div className="mt-4 w-full px-2">
        <div className="flex items-center gap-2">
          <span className="text-white/60 text-xs">🔊</span>
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={handleVolumeChange}
            className="flex-1 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
            style={{
              background: `linear-gradient(to right, #fbbf24 0%, #fbbf24 ${volume}%, rgba(255,255,255,0.2) ${volume}%, rgba(255,255,255,0.2) 100%)`
            }}
          />
          <span className="text-white/60 text-xs w-8 text-right">{volume}%</span>
        </div>
      </div>
    </div>
  );
}
