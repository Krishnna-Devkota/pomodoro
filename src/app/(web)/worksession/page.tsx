"use client";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";

const images = [
    "/images/s1.png",
    "/images/s2.png",
    "/images/s3.png",
    "/images/s4.png",
    "/images/s5.png",
];

export default function WorkSession() {
    const searchParams = useSearchParams();
    const task = searchParams.get("task") || "";
    const [seconds, setSeconds] = useState(1 * 10);
    const [isActive, setIsActive] = useState(true);
    const [imgIdx, setImgIdx] = useState(0);
    const [mode, setMode] = useState<"work" | "break">("work");
    const [showOptions, setShowOptions] = useState(false);
    const audioRef = useRef<HTMLAudioElement>(null);
    const router = require("next/navigation").useRouter();

    useEffect(() => {
        if (!isActive) return;
        if (seconds === 0) return;
        const interval = setInterval(() => {
            setSeconds((s) => s - 1);
        }, 1000);
        return () => clearInterval(interval);
    }, [isActive, seconds]);

    useEffect(() => {
        if (seconds === 0 && isActive) {
            setIsActive(false);
            setShowOptions(true);
            if (audioRef.current) {
                audioRef.current.currentTime = 0;
                audioRef.current.play();
            }
        }
    }, [seconds, isActive]);

    useEffect(() => {
        const imgInterval = setInterval(() => {
            setImgIdx((idx) => (idx + 1) % images.length);
        }, 800);
        return () => clearInterval(imgInterval);
    }, []);

    const minutesDisplay = String(Math.floor(seconds / 60)).padStart(2, "0");
    const secondsDisplay = String(seconds % 60).padStart(2, "0");

    const stopAudio = () => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }
    };
    const handleStartBreak = () => {
        stopAudio();
        setMode("break");
        setSeconds(1 * 5);
        setIsActive(true);
        setShowOptions(false);
    };
    const handleWorkAgain = () => {
        stopAudio();
        setMode("work");
        setSeconds(1 * 10);
        setIsActive(true);
        setShowOptions(false);
    };
    const handleFinish = () => {
        stopAudio();
        router.push("/timerpage");
    };

    return (
        <div className="bg-[#4e022b] h-dvh w-full text-white font-aveatBrush flex flex-col items-center p-12 space-y-8 relative justify-center">
            <button
                className="absolute top-4 left-4 flex items-center justify-center w-10 h-10 rounded-full bg-opacity-10 hover:bg-opacity-30 transition-colors border border-white"
                onClick={() => {
                    stopAudio();
                    router.push("/timerpage");
                }}
                aria-label="Back to timer page"
            >
                <ArrowLeft className="text-white w-6 h-6" />
            </button>
            <audio ref={audioRef} src="/audio/audio-ring.mp3" preload="auto" />
            <div className="text-3xl md:text-5xl mb-4 text-center min-h-[2.5rem]">{task}</div>
            <div className="text-6xl md:text-8xl font-bold mb-8">
                {minutesDisplay}:{secondsDisplay}
            </div>
            <div className="flex flex-col items-center">
                <Image
                    src={images[imgIdx]}
                    alt="fruit"
                    width={80}
                    height={80}
                    className="transition-all duration-500"
                />
            </div>
            {showOptions && (
                <div className="flex flex-col items-center space-y-4 mt-8">
                    {mode === "work" ? (
                        <>
                            <button
                                className="py-2 px-6 border-2 border-white rounded-xl text-2xl font-bold bg-[#fbbf24] text-[#4e022b] hover:bg-[#fde68a]"
                                onClick={handleStartBreak}
                            >
                                Start a Break
                            </button>
                            <button
                                className="py-2 px-6 border-2 border-white rounded-xl text-2xl font-bold bg-white text-[#4e022b] hover:bg-gray-200"
                                onClick={handleFinish}
                            >
                                Finish
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                className="py-2 px-6 border-2 border-white rounded-xl text-2xl font-bold bg-[#fbbf24] text-[#4e022b] hover:bg-[#fde68a]"
                                onClick={handleWorkAgain}
                            >
                                Work Again
                            </button>
                            <button
                                className="py-2 px-6 border-2 border-white rounded-xl text-2xl font-bold bg-white text-[#4e022b] hover:bg-gray-200"
                                onClick={handleFinish}
                            >
                                Finish
                            </button>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}