"use client";

import { useState, useCallback, useMemo } from "react";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Volume2 } from "lucide-react";
import { getQuestions, type Question } from "@/lib/data";
import { getBandReadyStore } from "@/lib/data";
import { cn } from "@/lib/utils";

const TOTAL_QUESTIONS = 8;

/** Note positions on treble staff (y in SVG coords). */
const TREBLE_NOTE_POSITIONS: Record<string, { y: number }> = {
  F: { y: 88 },
  E: { y: 72 },
  D: { y: 56 },
  C: { y: 64 },
  B: { y: 56 },
  A: { y: 48 },
  G: { y: 40 },
};

function pickOptions(question: Question): string[] {
  const correct = question.correctAnswer;
  const wrong = question.options.filter((o) => o !== correct);
  const shuffled = [...wrong].sort(() => Math.random() - 0.5);
  return [correct, ...shuffled.slice(0, 3)].sort(() => Math.random() - 0.5);
}

function getAssessmentQuestions(moduleId: string): Question[] {
  const pool = getQuestions(moduleId);
  if (pool.length >= TOTAL_QUESTIONS) return pool.slice(0, TOTAL_QUESTIONS);
  const result: Question[] = [];
  let i = 0;
  while (result.length < TOTAL_QUESTIONS && pool.length > 0) {
    result.push({ ...pool[i % pool.length], id: `${pool[i % pool.length].id}-a${result.length}` });
    i++;
  }
  return result;
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

export function AssessmentScreen({ moduleId }: { moduleId: string }) {
  const router = useRouter();
  const reducedMotion = useReducedMotion();
  const questions = useMemo(() => getAssessmentQuestions(moduleId), [moduleId]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null);
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const question = questions[currentIndex];
  const options = useMemo(() => (question ? pickOptions(question) : []), [question?.id]);

  const handleAnswerTap = useCallback(
    (option: string) => {
      if (!question || isProcessing) return;

      setIsProcessing(true);
      setSelected(option);

      if (option === question.correctAnswer) {
        setFeedback("correct");
        setScore((s) => s + 1);
        const nextIndex = currentIndex + 1;
        const newScore = score + 1;
        setTimeout(() => {
          setFeedback(null);
          setSelected(null);
          setIsProcessing(false);
          if (nextIndex >= questions.length) {
            const store = getBandReadyStore();
            const percent = Math.round((newScore / questions.length) * 100);
            store.saveProgress(moduleId, percent);
            router.push(`/module/${moduleId}/results?score=${percent}`);
          } else {
            setCurrentIndex(nextIndex);
          }
        }, 800);
      } else {
        setFeedback("incorrect");
        setShowCorrectAnswer(true);
        const nextIndex = currentIndex + 1;
        setTimeout(() => {
          setFeedback(null);
          setSelected(null);
          setShowCorrectAnswer(false);
          setIsProcessing(false);
          if (nextIndex >= questions.length) {
            const store = getBandReadyStore();
            const percent = Math.round((score / questions.length) * 100);
            store.saveProgress(moduleId, percent);
            router.push(`/module/${moduleId}/results?score=${percent}`);
          } else {
            setCurrentIndex(nextIndex);
          }
        }, 1200);
      }
    },
    [question, isProcessing, currentIndex, questions.length, score, moduleId, router]
  );

  const handlePlayNote = useCallback(() => {
    // Placeholder for audio playback
  }, []);

  if (questions.length === 0) {
    return (
      <main className="min-h-screen w-full flex flex-col items-center justify-center bg-[#F0F4F8] p-8">
        <p className="font-nunito text-slate-text">No questions available for this module.</p>
        <button
          type="button"
          onClick={() => router.push("/home")}
          className="mt-4 min-h-[80px] px-6 py-3 rounded-xl font-nunito font-bold text-sm text-white bg-blue-active"
        >
          Home
        </button>
      </main>
    );
  }

  return (
    <main className="min-h-screen w-full flex flex-col bg-[#F0F4F8]">
      {/* Top: QUESTION [N] OF 8 + segmented progress bar */}
      <header className="shrink-0 px-6 pt-6 pb-4">
        <p className="font-nunito font-bold text-sm text-slate-text mb-3">
          QUESTION {currentIndex + 1} OF {TOTAL_QUESTIONS}
        </p>
        <div className="flex gap-1">
          {Array.from({ length: TOTAL_QUESTIONS }).map((_, i) => {
            const completed = i < currentIndex;
            const current = i === currentIndex;
            return (
              <div
                key={i}
                className={cn(
                  "h-2 flex-1 rounded-full transition-colors",
                  completed && "bg-mint",
                  current && "bg-blue-active",
                  !completed && !current && "bg-slate-200"
                )}
              />
            );
          })}
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 flex flex-col px-6 pb-24 overflow-y-auto">
        <h1 className="font-nunito font-bold text-2xl md:text-3xl text-slate-text text-center mt-4 mb-6">
          What note is this?
        </h1>

        {/* Visual card + Play Note button */}
        <div className="flex items-center justify-center gap-4 max-w-lg mx-auto w-full">
          <motion.div
            className="flex-1 bg-white rounded-3xl shadow-lg p-8 flex items-center justify-center min-h-[200px] border border-slate-200/60 relative overflow-hidden"
            animate={!reducedMotion && feedback === "correct"
              ? { boxShadow: ["0 10px 15px -3px rgb(0 0 0 / 0.1)", "0 0 0 4px var(--mint)"] }
              : {}}
            transition={feedback === "correct" ? { duration: reducedMotion ? 0 : 0.3, ease: "easeOut" } : {}}
          >
            {feedback === "correct" && (
              <motion.div
                className="absolute inset-0 bg-mint/30 pointer-events-none"
                initial={reducedMotion ? false : { opacity: 0 }}
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: reducedMotion ? 0 : 0.8 }}
              />
            )}
            <TrebleStaffWithHighlight highlightedNote={question.correctAnswer} />
          </motion.div>
          <button
            type="button"
            onClick={handlePlayNote}
            className="shrink-0 min-w-[80px] min-h-[80px] w-20 h-20 rounded-2xl bg-blue-active hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center text-white focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-golden focus-visible:ring-offset-2"
            aria-label="Play note (note shown highlighted on staff)"
          >
            <Volume2 size={32} strokeWidth={2.5} />
          </button>
        </div>

        {/* 4 answer buttons - 2x2 grid */}
        <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto w-full mt-8">
          <AnimatePresence mode="wait">
            {options.map((option) => {
              const isCorrect = option === question.correctAnswer;
              const isSelectedOption = selected === option;
              const showCorrect = feedback === "correct" && isSelectedOption && isCorrect;
              const showIncorrect = feedback === "incorrect" && isSelectedOption;
              const showCorrectHighlight = feedback === "incorrect" && showCorrectAnswer && isCorrect;

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
                    showCorrectHighlight && "bg-mint border-mint text-slate-text",
                    showIncorrect && "border-red-500 bg-red-50",
                    !showCorrect && !showIncorrect && !showCorrectHighlight && "bg-white border-slate-300 hover:border-slate-400"
                  )}
                  animate={!reducedMotion && showIncorrect ? { x: [0, -8, 8, -8, 8, 0] } : {}}
                  transition={showIncorrect ? { duration: reducedMotion ? 0 : 0.4 } : {}}
                >
                  {option}
                  <AnimatePresence>
                    {(showCorrect || showCorrectHighlight) && (
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
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}
