"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Star, Award } from "lucide-react";
import { MODULE_DEFINITIONS } from "@/lib/data";
import { cn } from "@/lib/utils";
import { CONFETTI_CSS } from "@/lib/confetti-css";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const PASS_THRESHOLD = 75; // 6/8 ≈ 75%

/** Mock class leaderboard */
const MOCK_LEADERBOARD = [
  { name: "Emma", score: 100 },
  { name: "Marcus", score: 88 },
  { name: "Sofia", score: 75 },
];

function scoreToStars(score: number): number {
  if (score >= 100) return 5;
  if (score >= 80) return 4;
  if (score >= 60) return 3;
  if (score >= 40) return 2;
  if (score >= 20) return 1;
  return 0;
}

/** CSS-based confetti effect */
function ConfettiOverlay() {
  const colors = ["#f5a623", "#52c98a", "#4a90d9", "#f5a623", "#e74c3c"];
  const count = 50;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 rounded-sm animate-confetti-fall"
          style={{
            left: `${Math.random() * 100}%`,
            top: "-10px",
            backgroundColor: colors[i % colors.length],
            animationDelay: `${Math.random() * 2}s`,
            transform: `rotate(${Math.random() * 360}deg)`,
          }}
        />
      ))}
    </div>
  );
}

export function ResultsScreen({
  moduleId,
  score,
}: {
  moduleId: string;
  score: number;
}) {
  const router = useRouter();
  const confettiFired = useRef(false);
  const reducedMotion = useReducedMotion();

  const passed = score >= PASS_THRESHOLD;
  const starCount = scoreToStars(score);


  useEffect(() => {
    if (passed && !reducedMotion && !confettiFired.current && typeof window !== "undefined") {
      confettiFired.current = true;
      // Try canvas-confetti if available, else rely on CSS
      import("canvas-confetti").then((confetti) => {
        const duration = 2;
        const end = Date.now() + duration * 1000;
        const colors = ["#f5a623", "#52c98a", "#4a90d9"];
        (function frame() {
          confetti.default({
            particleCount: 3,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors,
          });
          confetti.default({
            particleCount: 3,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors,
          });
          if (Date.now() < end) requestAnimationFrame(frame);
        })();
      }).catch(() => {});
    }
  }, [passed, reducedMotion]);

  const handleContinue = () => router.push("/home");
  const handlePracticeAgain = () => router.push(`/module/${moduleId}/practice`);
  const handleReviewLesson = () => router.push(`/module/${moduleId}`);

  if (passed) {
    const modDef = MODULE_DEFINITIONS.find((m) => m.id === moduleId);
    const moduleTitle = modDef?.title ?? "Module";

    const passedContent = (
      <div role="main" className="min-h-screen w-full flex flex-col items-center bg-[#F0F4F8] overflow-hidden relative">
        <style>{CONFETTI_CSS}</style>
        <ConfettiOverlay />

        <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 max-w-lg mx-auto">
          <motion.h1
            className="font-nunito font-bold text-2xl md:text-3xl text-golden text-center mb-6"
            initial={reducedMotion ? false : { scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={reducedMotion ? { duration: 0 } : { type: "spring", stiffness: 300, damping: 20 }}
          >
            🎉 Module Complete!
          </motion.h1>

          {/* Star rating - animated fill */}
          <motion.div
            className="flex gap-1 mb-8"
            initial={reducedMotion ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={reducedMotion ? { duration: 0 } : { delay: 0.2 }}
          >
            {[1, 2, 3, 4, 5].map((i) => (
              <motion.div
                key={i}
                initial={reducedMotion ? false : { scale: 0 }}
                animate={{ scale: 1 }}
                transition={reducedMotion ? { duration: 0 } : {
                  delay: 0.3 + i * 0.1,
                  type: "spring",
                  stiffness: 400,
                  damping: 20,
                }}
              >
                <Star
                  size={36}
                  className={cn(
                    "transition-colors",
                    i <= starCount ? "fill-golden text-golden" : "text-slate-200"
                  )}
                />
              </motion.div>
            ))}
          </motion.div>

          {/* Badge earned card with golden glow */}
          <motion.div
            initial={reducedMotion ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={reducedMotion ? { duration: 0 } : { delay: 0.5 }}
            style={{ boxShadow: "0 0 24px rgba(245, 166, 35, 0.4)" }}
          >
            <Card
              variant="elevated"
              className="relative w-full max-w-xs p-6 mb-8 border-2 border-golden/50"
            >
              <div className="flex flex-col items-center gap-2">
                <div className="w-16 h-16 rounded-full bg-golden/20 flex items-center justify-center">
                  <Award size={36} className="text-golden" />
                </div>
                <p className="font-nunito font-bold text-slate-text">Badge earned</p>
                <p className="font-nunito text-slate-text/80 text-sm">{moduleTitle}</p>
              </div>
            </Card>
          </motion.div>

          {/* Class leaderboard */}
          <motion.div
            initial={reducedMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={reducedMotion ? { duration: 0 } : { delay: 0.6 }}
          >
            <Card variant="outlined" className="w-full max-w-xs p-4 mb-8 shadow-lg">
              <p className="font-nunito font-bold text-slate-text text-sm mb-3">
                Class leaderboard
              </p>
              {MOCK_LEADERBOARD.map((entry, i) => (
                <div
                  key={entry.name}
                  className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0"
                >
                  <span className="font-nunito text-slate-text">
                    {i + 1}. {entry.name}
                  </span>
                  <span className="font-nunito font-bold text-slate-text">
                    {entry.score}%
                  </span>
                </div>
              ))}
            </Card>
          </motion.div>

          {/* Continue button */}
          <motion.div
            initial={reducedMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={reducedMotion ? { duration: 0 } : { delay: 0.7 }}
            className="w-full max-w-xs"
          >
            <Button
              type="button"
              variant="primary"
              onClick={handleContinue}
              className="w-full py-4 text-lg gap-2"
            >
              Continue →
            </Button>
          </motion.div>
        </div>
      </div>
    );
    return passedContent;
  }

  // Below threshold: supportive mascot + options
  return (
    <div role="main" className="min-h-screen w-full flex flex-col items-center justify-center bg-[#F0F4F8] px-6 py-12">
      {/* Mascot + supportive message */}
      <motion.div
        className="flex flex-col items-center mb-8"
        initial={reducedMotion ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={reducedMotion ? { duration: 0 } : { duration: 0.4 }}
      >
        <div className="w-24 h-24 rounded-full bg-golden/30 flex items-center justify-center text-4xl mb-4 border-2 border-golden/50">
          🎵
        </div>
        <p className="font-nunito text-slate-text text-lg text-center max-w-sm">
          Nice try! Want to practice more?
        </p>
      </motion.div>

      {/* Two options */}
      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
        <Button
          type="button"
          variant="primary"
          onClick={handlePracticeAgain}
          className="flex-1 py-4 text-lg"
        >
          Practice Again
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={handleReviewLesson}
          className="flex-1 py-4 text-lg"
        >
          Review Lesson
        </Button>
      </div>
    </div>
  );
}
