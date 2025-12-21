"use client";

import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface JamendoTrack {
  id: string;
  name: string;
  artist_name: string;
  audio: string;
  image: string;
}

interface JamendoResponse {
  results: JamendoTrack[];
}

const fetchTracks = async (): Promise<JamendoTrack[]> => {
  const CLIENT_ID = "5a2cd8bb";
  const response = await fetch(
    `https://api.jamendo.com/v3.0/tracks/?client_id=${CLIENT_ID}&format=json&limit=20&audioformat=mp32`
  );
  
  if (!response.ok) {
    throw new Error("Failed to fetch tracks");
  }
  
  const data: JamendoResponse = await response.json();
  return data.results;
};

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(50); // Volume state (0-100)
  const audioRef = useRef<HTMLAudioElement>(null);

  const { data: tracks, isLoading, error } = useQuery({
    queryKey: ["jamendo-tracks"],
    queryFn: fetchTracks,
  });

  const currentTrack = tracks?.[currentTrackIndex];


  useEffect(() => {
    const loadAndPlayTrack = async () => {
      if (audioRef.current && currentTrack) {
        // Pause current playback before changing source
        audioRef.current.pause();
        audioRef.current.src = currentTrack.audio;
        
        if (isPlaying) {
          try {
            await audioRef.current.play();
          } catch (error) {
            // Ignore AbortError when play is interrupted
            if (error instanceof Error && error.name !== 'AbortError') {
              console.error('Error playing audio:', error);
            }
          }
        }
      }
    };
    
    loadAndPlayTrack();
  }, [currentTrack, isPlaying]);

  // Update audio volume when volume state changes
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
    if (tracks && tracks.length > 0) {
      setCurrentTrackIndex((prev) => 
        prev === 0 ? tracks.length - 1 : prev - 1
      );
    }
  };

  const handleNext = () => {
    if (tracks && tracks.length > 0) {
      setCurrentTrackIndex((prev) => 
        prev === tracks.length - 1 ? 0 : prev + 1
      );
    }
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
  }, [currentTrackIndex, tracks]);

  if (isLoading) {
    return (
      <div className="  w-full max-w-md">
        <p className="text-white text-center">Loading music...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-md">
        <p className="text-red-300 text-center text-sm">
          Failed to load music. Please check your API key.
        </p>
      </div>
    );
  }

  if (!currentTrack) {
    return null;
  }

  return (
    <div className="w-full max-w-md">
      <audio ref={audioRef} />
      
      {/* Track Info */}
      <div className="text-center mb-4">
        <h3 className="text-white font-bold text-lg truncate">
          {currentTrack.name}
        </h3>
        <p className="text-white/70 text-sm truncate">
          {currentTrack.artist_name}
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
        {currentTrackIndex + 1} / {tracks?.length || 0}
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
