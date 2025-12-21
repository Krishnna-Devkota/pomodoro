"use client";

import { useState, useEffect, useRef } from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import gsap from "gsap";
import MusicPlayer from "@/components/MusicPlayer";

export default function TimerPage() {
  const [task, setTask] = useState("");
  const router = useRouter();
  const logoRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (logoRef.current) {
      gsap.to(logoRef.current, {
        rotate: -45,
        scale: 1.1,
        duration: 2,
        yoyo: true,
        repeat: -1,
        ease: "power1.inOut",
      });
    }
  }, []);

  return (
    <div className="bg-[#4e022b] h-dvh w-full text-white font-aveatBrush flex flex-col items-center p-12 space-y-8 justify-center relative">
      <button
        className="absolute top-4 left-4 flex items-center justify-center w-10 h-10 rounded-full bg-opacity-10 hover:bg-opacity-30 transition-colors border border-white"
        onClick={() => router.push("/")}
        aria-label="Back to main page"
      >
        <ArrowLeft className="text-white w-6 h-6" />
      </button>
      <Image
        src="/images/strawberry.png"
        alt="ChronoBerry logo"
        width={100}
        height={100}
        ref={logoRef}
        className="-mt-18"
      />
      <div className="items-center text-center -mt-12 flex flex-col space-y-4">
        <span className="text-5xl md:text-7xl">SET YOUR TASK</span>
        <p className="text-center text-base md:text-2xl">
          write down a task you want to achieve during this session
        </p>
      </div>
      {task && (
        <div className="text-white text-xl md:text-2xl mb-2">{task}</div>
      )}
      <input
        type="text"
        value={task}
        onChange={(e) => setTask(e.target.value)}
        className="mt-4 p-2 rounded-full bg-white border-2 border-yellow-400 text-black w-64 focus:border-yellow-500 outline-none"
        placeholder="Enter your task here"
      />
      <button
        className="py-2 px-6 border-3 border-white rounded-xl text-2xl font-bold mt-6"
        onClick={() => router.push(`/worksession?task=${encodeURIComponent(task)}`)}
        disabled={!task.trim()}
      >
        START TIMER
      </button>
      
      {/* Music Player Section - Fixed at bottom right */}
      {/* <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 lg:bottom-8 lg:right-8 z-50">
        <MusicPlayer />
      </div> */}
    </div>
  );
}
