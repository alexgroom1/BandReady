"use client";

import { useState, useCallback } from "react";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  BookOpen,
  Music,
  Drum,
  Music2,
  Trophy,
  Check,
  Lock,
  Star,
  Settings,
  Award,
} from "lucide-react";
import { useBandReady } from "@/lib/useBandReady";
import type { Module } from "@/lib/data";

const MODULE_ICONS: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  "book-music": BookOpen,
  music: Music,
  drum: Drum,
  trumpet: Music2,
  trophy: Trophy,
};

const TOTAL_MODULES = 5;

function ModuleCard({
  module,
  onStartLesson,
}: {
  module: Module;
  onStartLesson: () => void;
}) {
  const IconComponent = MODULE_ICONS[module.icon] ?? Music;
  const isActive = module.status === "active";
  const isCompleted = module.status === "completed";
  const isLocked = module.status === "locked";

  return (
    <div
      className={`
        min-w-[140px] min-h-[160px] w-[140px] rounded-2xl p-4 flex flex-col
        border-2 transition-colors shrink-0
        ${isLocked ? "cursor-default" : "cursor-pointer"}
        ${isCompleted ? "border-mint bg-white/90" : ""}
        ${isActive ? "border-blue-active bg-white shadow-md ring-2 ring-blue-active/30" : ""}
        ${isLocked ? "border-locked bg-slate-100/80" : ""}
      `}
    >
      {/* Header with icon / check / lock */}
      <div className="flex items-start justify-between mb-2">
        <IconComponent
          size={28}
          className={
            isLocked
              ? "text-locked"
              : isCompleted
                ? "text-mint"
                : "text-blue-active"
          }
        />
        {isCompleted && <Check size={24} className="text-mint shrink-0" />}
        {isLocked && <Lock size={22} className="text-locked shrink-0" />}
      </div>

      <h3 className="font-nunito font-bold text-slate-text text-base leading-tight flex-1">
        {module.title}
      </h3>

      {isCompleted && (
        <div className="flex gap-0.5 mt-2" aria-label={`${module.starRating} stars`}>
          {[1, 2, 3, 4, 5].map((i) => (
            <Star
              key={i}
              size={18}
              className={i <= module.starRating ? "fill-golden text-golden" : "text-locked"}
            />
          ))}
        </div>
      )}

      {isActive && (
        <div className="mt-3 space-y-2">
          <span className="inline-block px-2 py-0.5 rounded-full text-xs font-bold text-blue-active bg-blue-active/15">
            CONTINUE
          </span>
          <button
            type="button"
            className="w-full min-h-[80px] py-3 rounded-xl font-nunito font-bold text-sm text-slate-text bg-golden hover:opacity-90 active:scale-[0.98] transition-opacity"
            onClick={(e) => {
              e.stopPropagation();
              onStartLesson();
            }}
          >
            Start Lesson
          </button>
        </div>
      )}
    </div>
  );
}

/** Wrapper: active → navigate, locked → gentle shake. Keyboard: Tab + Enter/Space. */
function LockableModuleCard({
  module,
  onActiveSelect,
}: {
  module: Module;
  onActiveSelect: () => void;
}) {
  const [shake, setShake] = useState(false);
  const reducedMotion = useReducedMotion();

  const handleActivate = useCallback(() => {
    if (module.status === "active") {
      onActiveSelect();
    } else if (module.status === "locked") {
      setShake(true);
      setTimeout(() => setShake(false), 400);
    }
  }, [module.status, onActiveSelect]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleActivate();
      }
    },
    [handleActivate]
  );

  return (
    <motion.div
      role="button"
      tabIndex={0}
      onClick={handleActivate}
      onKeyDown={handleKeyDown}
      aria-label={`${module.title}, ${module.status === "active" ? "Continue" : module.status === "locked" ? "Locked" : "Completed"}`}
      animate={!reducedMotion && module.status === "locked" && shake ? { x: [0, -6, 6, -6, 6, 0] } : {}}
      transition={{ duration: 0.35 }}
      className="shrink-0 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-golden focus-visible:ring-offset-2 rounded-2xl"
    >
      <ModuleCard module={module} onStartLesson={onActiveSelect} />
    </motion.div>
  );
}

export function HomeScreen() {
  const router = useRouter();
  const { activeProfile, modules } = useBandReady();
  const reducedMotion = useReducedMotion();

  const progressPercent =
    activeProfile != null
      ? (activeProfile.completedModules.length / TOTAL_MODULES) * 100
      : 0;
  const badgeCount = activeProfile?.badgeCount ?? 0;

  const handleModuleSelect = useCallback(
    (moduleId: string) => {
      router.push(`/module/${moduleId}`);
    },
    [router]
  );

  if (activeProfile == null) {
    return (
      <main className="min-h-screen w-full flex flex-col items-center justify-center bg-[#F0F4F8] p-8">
        <p className="font-nunito text-slate-text">No profile selected. Go back to choose one.</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen w-full flex flex-col bg-[#F0F4F8]">
      {/* Top bar: welcome + progress card + settings */}
      <header className="relative flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 p-6 pb-4">
        <div className="pr-12 sm:pr-0">
          <h1 className="font-nunito font-bold text-2xl md:text-3xl text-slate-text">
            Welcome back, {activeProfile.name}!
          </h1>
          <p className="font-nunito text-slate-text/80 text-lg mt-1">
            You&apos;re doing great! Keep going!
          </p>
        </div>

        {/* Settings gear - top right corner */}
        <button
          type="button"
          className="absolute top-6 right-6 min-w-[80px] min-h-[80px] w-20 h-20 flex items-center justify-center text-slate-text/70 hover:text-slate-text rounded-full focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-golden"
          aria-label="Settings"
        >
          <Settings size={24} />
        </button>

        {/* Course Progress card - top right */}
        <div className="shrink-0 w-full sm:w-56 bg-white rounded-2xl p-4 shadow-sm border border-slate-200/60">
          <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-mint rounded-full"
              initial={reducedMotion ? false : { width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={reducedMotion ? { duration: 0 } : { duration: 0.5, ease: "easeOut" }}
            />
          </div>
          <div className="flex items-center gap-2 mt-2">
            <Award size={20} className="text-golden shrink-0" />
            <span className="font-nunito font-bold text-slate-text text-sm">
              {badgeCount} badges earned
            </span>
          </div>
        </div>
      </header>

      {/* Your Learning Path - horizontal scroll, max 5 visible */}
      <section className="flex-1 px-6 pb-8">
        <h2 className="font-nunito font-bold text-xl text-slate-text mb-4">
          Your Learning Path
        </h2>
        <div
          className="overflow-x-auto overflow-y-hidden pb-2"
          style={{ maxWidth: "calc(140px * 5 + 12px * 4 + 24px)" }}
        >
          <div className="flex gap-3">
            {modules.map((mod) => (
              <LockableModuleCard
                key={mod.id}
                module={mod}
                onActiveSelect={() => handleModuleSelect(mod.id)}
              />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
