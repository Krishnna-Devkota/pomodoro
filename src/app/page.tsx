"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import gsap from "gsap";

export default function Page() {
  const logoRef = useRef<HTMLImageElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (logoRef.current) {
      gsap.to(logoRef.current, {
        rotate: -45,          
        scale: 1.1,          
        duration: 2,         
        yoyo: true,           
        repeat: -1,          
        ease: "power1.inOut"  
      });
    }
  }, []);

  return (
    <div className="bg-[#4e022b] h-dvh w-full text-white font-aveatBrush flex flex-col items-center p-12">
      <h2 className="text-7xl md:text-8xl">ChronoBerry</h2>
      <span className="text-2xl md:text-4xl">pomodoro timer</span>
      <Image
        src="/images/strawberry.png"
        alt="ChronoBerry logo"
        width={200}
        height={200}
        ref={logoRef}
        className="-mt-18"
      />
      <button
        className="py-2 px-6 border-3 border-white rounded-xl text-2xl font-bold items-center -mt-6"
        onClick={() => router.push("/timerpage")}
      >
        START
      </button>
    </div>
  );
}
