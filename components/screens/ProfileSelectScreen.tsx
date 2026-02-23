"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useCallback, useState } from "react";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { useBandReady } from "@/lib/useBandReady";
import type { StudentProfile } from "@/lib/data";

const AVATAR_COLOR_PALETTE = [
  "#4A90D9", // blue
  "#52C98A", // green
  "#F5A623", // yellow/golden
  "#E57373", // red
  "#9575CD", // purple
  "#4DB6AC", // teal
];

function getAvatarColor(profile: StudentProfile, index: number): string {
  return profile.avatarColor ?? AVATAR_COLOR_PALETTE[index % AVATAR_COLOR_PALETTE.length];
}

function getInitial(name: string): string {
  return (name.trim().charAt(0) ?? "?").toUpperCase();
}

function ProfileRow({
  profile,
  index,
  isSelected,
  onSelect,
  reducedMotion,
}: {
  profile: StudentProfile;
  index: number;
  isSelected: boolean;
  onSelect: () => void;
  reducedMotion: boolean;
}) {
  const color = getAvatarColor(profile, index);
  const initial = getInitial(profile.name);

  return (
    <motion.button
      type="button"
      onClick={onSelect}
      className="w-full min-h-[80px] flex items-center gap-4 px-4 py-3 rounded-2xl border-2 transition-colors text-left bg-white/80 hover:bg-white focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-golden focus-visible:ring-offset-2"
      style={{
        borderColor: isSelected ? "var(--blue-active)" : "transparent",
        backgroundColor: isSelected ? "rgba(255,255,255,0.95)" : undefined,
      }}
      animate={reducedMotion ? undefined : { scale: isSelected ? 1.02 : 1 }}
      transition={reducedMotion ? { duration: 0 } : { duration: 0.2 }}
    >
      <div
        className="w-14 h-14 rounded-full shrink-0 flex items-center justify-center font-nunito font-bold text-xl text-white"
        style={{ backgroundColor: color }}
      >
        {initial}
      </div>
      <span className="font-nunito font-bold text-[1.5rem] text-slate-text">
        {profile.name}
      </span>
    </motion.button>
  );
}

export function ProfileSelectScreen() {
  const router = useRouter();
  const { profiles, setActiveProfile } = useBandReady();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const reducedMotion = useReducedMotion();

  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  const handleLetsGo = useCallback(() => {
    if (!selectedId) return;
    setActiveProfile(selectedId);
    router.push("/home");
  }, [selectedId, setActiveProfile, router]);

  return (
    <main className="min-h-screen w-full flex flex-col bg-[#F0F4F8]">
      {/* Header with back arrow + title */}
      <header className="relative flex items-center justify-center min-h-[64px] px-4 shrink-0">
        <button
          type="button"
          onClick={handleBack}
          className="absolute left-0 top-1/2 -translate-y-1/2 min-w-[80px] min-h-[80px] w-20 h-20 flex items-center justify-center text-slate-text hover:text-blue-active focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-golden focus-visible:ring-offset-2 rounded-full"
          aria-label="Go back"
        >
          <ArrowLeft size={28} strokeWidth={2.5} />
        </button>
        <h1 className="font-nunito font-bold text-2xl md:text-3xl text-slate-text text-center">
          Who&apos;s learning today?
        </h1>
      </header>

      {/* Scrollable profile list - max 6 visible, scroll if more */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        <div className="flex flex-col gap-3 max-h-[calc(80px*6+12px*5)] overflow-y-auto">
          {profiles.map((profile, index) => (
            <ProfileRow
              key={profile.id}
              profile={profile}
              index={index}
              isSelected={selectedId === profile.id}
              onSelect={() => setSelectedId(profile.id)}
              reducedMotion={reducedMotion}
            />
          ))}
        </div>
      </div>

      {/* Fixed bottom CTA */}
      <div className="shrink-0 p-6 pt-4 bg-[#F0F4F8]">
        <motion.button
          type="button"
          onClick={handleLetsGo}
          disabled={!selectedId}
          className="w-full min-h-[80px] font-nunito font-bold text-2xl text-slate-text bg-golden rounded-2xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 active:scale-[0.98] transition-opacity focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-golden focus-visible:ring-offset-2"
        >
          Let&apos;s Go →
        </motion.button>
      </div>
    </main>
  );
}
