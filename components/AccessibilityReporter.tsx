"use client";

import { useEffect } from "react";

/**
 * HCI: axe-core accessibility check (WCAG 2.1 AA, color-contrast 4.5:1).
 * Runs in development only when axe-core is installed. Logs violations to console.
 * Install: npm install axe-core --save-dev
 */
export function AccessibilityReporter() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "development" || typeof window === "undefined") return;

    void import("axe-core").then((axe) => {
      axe.default.run(document, {
        runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21aa"] },
        rules: { "color-contrast": { enabled: true } },
      }).then((results) => {
        if (results.violations.length > 0) {
          console.warn(
            "[HCI axe-core] WCAG 2.1 AA violations:",
            results.violations
          );
        }
      }).catch((err) => console.warn("[HCI axe-core] Run failed:", err));
    }).catch(() => {});
  }, []);

  return null;
}
