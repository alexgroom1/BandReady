"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/lib/useReducedMotion";

/** Friendly cartoon music note mascot placeholder SVG */
function MusicNoteMascot() {
  return (
    <svg
      width="120"
      height="120"
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0"
      aria-hidden
    >
      {/* Cute face circle */}
      <circle cx="60" cy="65" r="40" fill="var(--golden)" />
      <circle cx="60" cy="65" r="36" fill="#fdd38a" />
      {/* Eyes */}
      <ellipse cx="50" cy="60" rx="6" ry="8" fill="var(--slate-text)" />
      <ellipse cx="70" cy="60" rx="6" ry="8" fill="var(--slate-text)" />
      {/* Smile */}
      <path
        d="M 45 78 Q 60 90 75 78"
        stroke="var(--slate-text)"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
      {/* Music note stem */}
      <rect x="55" y="10" width="10" height="55" rx="2" fill="var(--golden)" />
      <ellipse cx="60" cy="10" rx="12" ry="10" fill="var(--golden)" />
    </svg>
  );
}

export function LaunchScreen() {
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);
  const reducedMotion = useReducedMotion();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleStartClick = useCallback(() => {
    if (isNavigating) return;
    setIsNavigating(true);
    timeoutRef.current = setTimeout(() => {
      router.push("/profiles");
    }, 300);
  }, [router, isNavigating]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <main
      className="min-h-screen w-full flex flex-col items-center justify-center bg-[#F0F4F8] p-8"
      style={{ backgroundColor: "#F0F4F8" }}
    >
      <div className="flex flex-col items-center gap-12 max-w-md w-full">
        <h1 className="font-nunito font-black text-4xl text-golden text-center">
          Band Ready
        </h1>

        <MusicNoteMascot />

        <motion.button
          onClick={handleStartClick}
          disabled={isNavigating}
          className="min-w-[200px] min-h-[80px] px-10 font-nunito font-bold text-2xl text-slate-text bg-golden rounded-2xl flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed transition-opacity focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-golden focus-visible:ring-offset-2"
          animate={reducedMotion ? undefined : {
            scale: [1, 1.03, 1],
            boxShadow: [
              "0 4px 14px rgba(245, 166, 35, 0.3)",
              "0 4px 20px rgba(245, 166, 35, 0.5)",
              "0 4px 14px rgba(245, 166, 35, 0.3)",
            ],
          }}
          transition={reducedMotion ? { duration: 0 } : {
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          ▶ START
        </motion.button>
      </div>
    </main>
  );
}
