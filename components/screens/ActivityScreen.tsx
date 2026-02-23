"use client";

import { useState, useCallback, useMemo } from "react";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";
import { getQuestions, type Question } from "@/lib/data";
import { cn } from "@/lib/utils";

/** Note positions on treble staff (y in SVG coords). */
const TREBLE_NOTE_POSITIONS: Record<string, { y: number }> = {
  F: { y: 88 },  // top line
  E: { y: 72 },  // 4th line
  D: { y: 56 },  // 3rd line
  C: { y: 64 },  // middle space
  B: { y: 56 },  // middle line
  A: { y: 48 },  // 2nd space
  G: { y: 40 },  // 2nd line
};

function pickOptions(question: Question): string[] {
  const correct = question.correctAnswer;
  const wrong = question.options.filter((o) => o !== correct);
  const shuffled = [...wrong].sort(() => Math.random() - 0.5);
  const pick = [correct, ...shuffled.slice(0, 3)].sort(() => Math.random() - 0.5);
  return pick;
}

function TrebleStaffWithHighlight({ highlightedNote }: { highlightedNote: string }) {
  const pos = TREBLE_NOTE_POSITIONS[highlightedNote] ?? TREBLE_NOTE_POSITIONS.C;

  return (
    <svg viewBox="0 0 200 120" className="w-full max-w-sm h-auto">
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
      <path
        d="M 50 20 Q 48 50 52 88 M 52 20 L 55 88 M 58 30 Q 62 55 58 75"
        fill="none"
        stroke="#3d4a5c"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <motion.g
        transform={`translate(120, 48)`}
        initial={reducedMotion ? false : { scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={reducedMotion ? { duration: 0 } : { type: "spring", stiffness: 300, damping: 22 }}
      >
        <circle
          cx={0}
          cy={pos.y - 48}
          r="8"
          fill="var(--blue-active)"
          stroke="#3d4a5c"
          strokeWidth="1.5"
        />
      </motion.g>
    </svg>
  );
}

const DEFAULT_QUESTION: Question = {
  id: "default-1",
  type: "multiple-choice",
  prompt: "Which note is on the second line?",
  options: ["A", "B", "C", "D", "E", "F", "G"],
  correctAnswer: "G",
  hint: "The lines of the treble clef spell E-G-B-D-F from bottom to top.",
};

export function ActivityScreen({ moduleId }: { moduleId: string }) {
  const router = useRouter();
  const reducedMotion = useReducedMotion();
  const questions = useMemo(() => getQuestions(moduleId), [moduleId]);
  const question: Question = questions[0] ?? DEFAULT_QUESTION;
  const options = useMemo(() => pickOptions(question), [question.id]);

  const [attempt, setAttempt] = useState(1);
  const [selected, setSelected] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const totalLessons = 8;
  const currentLesson = 1;
  const progressPercent = (currentLesson / totalLessons) * 100;

  const handleAnswerTap = useCallback(
    (option: string) => {
      if (isProcessing) return;

      setIsProcessing(true);
      setSelected(option);

      if (option === question.correctAnswer) {
        setFeedback("correct");
      } else {
        setFeedback("incorrect");
        setTimeout(() => {
          setFeedback(null);
          setSelected(null);
          setIsProcessing(false);
          setAttempt((a) => a + 1);
        }, 800);
      }
    },
    [question.correctAnswer, isProcessing]
  );

  const handleDone = useCallback(() => {
    router.push(`/module/${moduleId}/challenge`);
  }, [router, moduleId]);

  return (
    <main className="min-h-screen w-full flex flex-col bg-[#F0F4F8]">
      {/* Top bar */}
      <header className="flex items-center justify-between px-4 py-4 shrink-0 gap-2">
        <span className="shrink-0 px-3 py-1 rounded-full font-nunito font-bold text-sm text-slate-text bg-mint">
          Practice Mode
        </span>
        <p className="flex-1 text-center font-nunito text-slate-text/80 text-sm">
          Take your time — no points, just practice!
        </p>
        <button
          type="button"
          onClick={handleDone}
          className="shrink-0 min-h-[80px] px-6 py-3 rounded-xl font-nunito font-bold text-sm text-white bg-blue-active hover:opacity-90 active:scale-[0.98] transition-all"
        >
          Done
        </button>
      </header>

      {/* Content */}
      <div className="flex-1 flex flex-col px-6 pb-24 overflow-y-auto">
        <h1 className="font-nunito font-bold text-2xl md:text-3xl text-slate-text text-center mt-4 mb-1">
          {question.prompt}
        </h1>
        <p className="font-nunito text-slate-text/70 text-sm text-center mb-6">
          Attempt {attempt} of unlimited
        </p>

        {/* Visual content card */}
        <div className="w-full max-w-md mx-auto bg-white rounded-3xl shadow-lg p-8 flex items-center justify-center min-h-[200px] border border-slate-200/60">
          <TrebleStaffWithHighlight highlightedNote={question.correctAnswer} />
        </div>

        {/* 4 answer buttons - 2x2 grid */}
        <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto w-full mt-6">
          {options.map((option) => {
            const isCorrect = option === question.correctAnswer;
            const isSelectedOption = selected === option;
            const showCorrect = feedback === "correct" && isSelectedOption && isCorrect;
            const showIncorrect = feedback === "incorrect" && isSelectedOption;

            return (
              <motion.button
                key={option}
                type="button"
                disabled={isProcessing}
                onClick={() => handleAnswerTap(option)}
                className={cn(
                  "min-w-[140px] min-h-[100px] rounded-2xl border-2 font-nunito font-bold text-xl text-slate-text",
                  "flex items-center justify-center gap-2 transition-colors",
                  "disabled:pointer-events-none",
                  showCorrect && "bg-mint border-mint text-slate-text",
                  showIncorrect && "border-red-500",
                  !showCorrect && !showIncorrect && "bg-white border-slate-300 hover:border-slate-400"
                )}
                animate={!reducedMotion && showIncorrect ? { x: [0, -8, 8, -8, 8, 0] } : {}}
                transition={showIncorrect ? { duration: reducedMotion ? 0 : 0.4 } : {}}
              >
                {option}
                <AnimatePresence>
                  {showCorrect && (
                    <motion.span
                      initial={reducedMotion ? false : { scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={reducedMotion ? { duration: 0 } : { type: "spring", stiffness: 400, damping: 20 }}
                    >
                      <Check size={28} strokeWidth={3} />
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            );
          })}
        </div>

        {/* Hint box */}
        <div className="mt-6 max-w-md mx-auto w-full bg-sky-100/80 rounded-xl py-3 pl-4 pr-4 border-l-4 border-blue-active">
          <p className="font-nunito text-slate-text text-sm">
            💡 Hint: {question.hint}
          </p>
        </div>

        {/* Mascot + speech bubble - bottom right */}
        <div className="mt-auto flex justify-end items-end pt-6 pr-2 pb-2">
          <div className="relative">
            <div className="bg-white rounded-2xl px-4 py-2 shadow-md border border-slate-200/60 max-w-[160px] mr-2 mb-14">
              <p className="font-nunito text-slate-text text-sm">You&apos;ve got this!</p>
              <div className="absolute -bottom-2 right-6 w-4 h-4 bg-white border-r border-b border-slate-200/60 rotate-45" />
            </div>
            <div className="w-16 h-16 rounded-full bg-golden flex items-center justify-center text-2xl border-2 border-slate-200/60">
              🎵
            </div>
          </div>
        </div>
      </div>

      {/* Bottom progress bar */}
      <div className="fixed bottom-0 left-0 right-0 h-1.5 bg-slate-200">
        <motion.div
          className="h-full bg-blue-active"
          initial={reducedMotion ? false : { width: 0 }}
          animate={{ width: `${progressPercent}%` }}
          transition={reducedMotion ? { duration: 0 } : { duration: 0.5, ease: "easeOut" }}
        />
      </div>
    </main>
  );
}
