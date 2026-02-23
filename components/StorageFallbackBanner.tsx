"use client";

import { useEffect, useState } from "react";
import { isLocalStorageAvailable } from "@/lib/data";

/**
 * HCI: Show friendly message when localStorage is unavailable (private browsing, etc.)
 * Prevents crash; progress will use in-memory fallback.
 */
export function StorageFallbackBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(!isLocalStorageAvailable());
  }, []);

  if (!show) return null;

  return (
    <div
      role="status"
      className="fixed top-0 left-0 right-0 z-50 bg-amber-100 border-b border-amber-300 px-4 py-3 text-center text-slate-text text-sm font-nunito"
    >
      Progress won&apos;t be saved this session (private browsing or storage disabled).
      You can still explore and practice!
    </div>
  );
}
