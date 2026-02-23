"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useReducedMotion } from "@/lib/useReducedMotion";

const HOLDOVER_MS = 350;

export function PageTransitionWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [pointerDisabled, setPointerDisabled] = useState(false);
  const prevPathRef = useRef(pathname);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (prevPathRef.current !== pathname) {
      prevPathRef.current = pathname;
      setPointerDisabled(true);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setPointerDisabled(false);
        timeoutRef.current = null;
      }, HOLDOVER_MS);
    }
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [pathname]);

  const transition = reducedMotion ? { duration: 0 } : { duration: 0.2, ease: "easeOut" as const };
  const initial = reducedMotion ? false : { opacity: 0, y: 12 };
  const animate = { opacity: 1, y: 0 };
  const exit = reducedMotion ? { opacity: 1 } : { opacity: 0, y: -12 };

  return (
    <div
      style={{ pointerEvents: pointerDisabled ? "none" : undefined }}
      className="min-h-full w-full"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={pathname}
          initial={initial}
          animate={animate}
          exit={exit}
          transition={transition}
          className="min-h-full w-full"
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
