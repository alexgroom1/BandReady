"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { ArrowLeft } from "lucide-react";
import { MODULE_DEFINITIONS } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const TOTAL_STEPS = 5;
const CURRENT_STEP = 1;

/** Note positions on treble staff (G line 2 → F line 5). Y in local coords of notes group. */
const NOTE_POSITIONS: { note: string; y: number; color: string }[] = [
  { note: "G", y: 24, color: "#4A90D9" },
  { note: "A", y: 16, color: "#52C98A" },
  { note: "B", y: 8, color: "#F5A623" },
  { note: "C", y: 0, color: "#E57373" },
  { note: "D", y: -8, color: "#9575CD" },
  { note: "E", y: -16, color: "#4DB6AC" },
  { note: "F", y: -24, color: "#7986CB" },
];

function TrebleClefStaff({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <svg viewBox="0 0 200 120" className="w-full max-w-sm h-auto">
      {/* Staff lines */}
      {[0, 1, 2, 3, 4].map((i) => (
        <line
          key={i}
          x1="40"
          y1={24 + i * 16}
          x2="180"
          y2={24 + i * 16}
          stroke="#3d4a5c"
          strokeWidth="1.5"
        />
      ))}
      {/* Simplified treble clef */}
      <path
        d="M 50 20 Q 48 50 52 88 M 52 20 L 55 88 M 58 30 Q 62 55 58 75"
        fill="none"
        stroke="#3d4a5c"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      {/* Colored note dots - stagger animation (respects reduced motion) */}
      <motion.g
        transform="translate(110, 48)"
        initial={reducedMotion ? false : "hidden"}
        animate="visible"
        variants={reducedMotion ? undefined : {
          visible: { transition: { staggerChildren: 0.12, delayChildren: 0.2 } },
        }}
      >
        {NOTE_POSITIONS.map(({ note, y, color }, i) => (
          <motion.g
            key={note}
            variants={reducedMotion ? undefined : {
              hidden: { scale: 0, opacity: 0 },
              visible: { scale: 1, opacity: 1 },
            }}
            transition={reducedMotion ? { duration: 0 } : { type: "spring", stiffness: 300, damping: 22 }}
          >
            <circle
              cx={i * 12}
              cy={y}
              r="6"
              fill={color}
              stroke="#3d4a5c"
              strokeWidth="1"
            />
            <text
              x={i * 12}
              y={y + 28}
              textAnchor="middle"
              fill="#3d4a5c"
              fontSize="10"
              fontFamily="var(--font-nunito), sans-serif"
              fontWeight="bold"
            >
              {note}
            </text>
          </motion.g>
        ))}
      </motion.g>
    </svg>
  );
}

export function ModuleIntroScreen({ moduleId }: { moduleId: string }) {
  const router = useRouter();
  const reducedMotion = useReducedMotion();
  const moduleDef = MODULE_DEFINITIONS.find((m) => m.id === moduleId);
  const title = moduleDef?.title ?? moduleId;

  const handleBack = () => router.back();
  const handleBegin = () => router.push(`/module/${moduleId}/practice`);

  return (
    <main className="min-h-screen w-full flex flex-col bg-[#F0F4F8]">
      {/* Top bar */}
      <header className="flex items-center justify-between px-4 py-4 shrink-0">
        <Button
          type="button"
          variant="icon"
          onClick={handleBack}
          aria-label="Go back"
        >
          <ArrowLeft size={28} strokeWidth={2.5} />
        </Button>

        {/* Step dots - center */}
        <div className="flex items-center gap-2">
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <div
              key={i}
              className={`w-2.5 h-2.5 rounded-full transition-colors ${
                i < CURRENT_STEP ? "bg-blue-active" : "bg-slate-300"
              }`}
            />
          ))}
        </div>

        <span className="font-nunito font-bold text-slate-text text-sm min-w-[72px] text-right">
          Step {CURRENT_STEP} of {TOTAL_STEPS}
        </span>
      </header>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center px-6 pb-32 overflow-y-auto">
        <h1 className="font-nunito font-bold text-3xl text-slate-text text-center mb-6">
          {title}
        </h1>

        {/* Visual content card */}
        <Card variant="elevated" className="w-full max-w-md flex items-center justify-center min-h-[220px]">
          <TrebleClefStaff reducedMotion={reducedMotion} />
        </Card>

        {/* Listen along - secondary */}
        <Button
          type="button"
          variant="ghost"
          className="mt-6 bg-slate-200/80 hover:bg-slate-200"
        >
          🎧 Listen along
        </Button>
      </div>

      {/* Fixed bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-[#F0F4F8] flex justify-center">
        <Button
          type="button"
          variant="primary"
          onClick={handleBegin}
          className="min-w-[240px] text-xl"
        >
          BEGIN MODULE
        </Button>
      </div>
    </main>
  );
}
