#!/usr/bin/env node
/**
 * HCI Audit: Touch Target Check
 * Verifies interactive elements have min-height >= 80px.
 * Logs warnings for violations.
 */

import { readFileSync, readdirSync } from "fs";
import { join, extname } from "path";
import { fileURLToPath } from "url";

const MIN_TOUCH_HEIGHT_PX = 80;
const COMPLIANT_PATTERNS = [
  /min-h-interactive/,
  /min-h-\[8\d+px\]/,
  /min-h-\[9\d+px\]/,
  /min-h-\[1\d{2,}px\]/,   // 100px, 140px etc
  /min-h-\[80px\]/,
  /min-h-\[88px\]/,
  /py-\d+(?:\s|")/,         // padding can contribute
];
const MIN_HEIGHT_REGEX = /min-h-\[(\d+)px\]/;
const MIN_HEIGHT_TAILWIND = { "min-h-touch": 48, "min-h-interactive": 80 };

function* walkFiles(dir, base = dir) {
  const entries = readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = join(dir, e.name);
    if (e.isDirectory() && !e.name.startsWith(".") && e.name !== "node_modules") {
      yield* walkFiles(full, base);
    } else if (extname(e.name).match(/\.(tsx?|jsx?)$/)) {
      yield full;
    }
  }
}

const INTERACTIVE_SELECTORS = [
  /<button\b/gi,
  /<a\s+\w[^>]*href\s*=/gi,
  /role\s*=\s*["']button["']/gi,
  /onClick\s*=\s*\{/g,
];

function hasInteractiveElement(line) {
  return INTERACTIVE_SELECTORS.some((r) => r.test(line));
}

function hasCompliantMinHeight(line) {
  const m = line.match(MIN_HEIGHT_REGEX);
  if (m) {
    const px = parseInt(m[1], 10);
    if (px >= MIN_TOUCH_HEIGHT_PX) return true;
  }
  if (line.includes("min-h-interactive")) return true;
  if (/min-h-\[(8\d|9\d|1\d{2,})\d*px\]/.test(line)) return true;
  return false;
}

function extractElementHeight(line, context) {
  const m = line.match(MIN_HEIGHT_REGEX);
  if (m) return parseInt(m[1], 10);
  if (line.includes("min-h-interactive")) return 80;
  if (/w-(\d+)\s+h-(\d+)/.test(line)) {
    const wm = line.match(/w-(\d+)/);
    const hm = line.match(/h-(\d+)/);
    if (hm) return parseInt(hm[1], 10) * 4; // tailwind = 4px per unit
  }
  if (/h-(\d+)/.test(line)) {
    const hm = line.match(/h-(\d+)/);
    if (hm) return parseInt(hm[1], 10) * 4;
  }
  if (/py-(\d+)/.test(line)) {
    const pm = line.match(/py-(\d+)/);
    if (pm) return parseInt(pm[1], 10) * 8; // py-4 = 16px * 2 = 32px, not enough alone
  }
  return null;
}

let violations = 0;

for (const file of walkFiles(join(fileURLToPath(import.meta.url), "..", ".."))) {
  if (file.includes("node_modules")) continue;
  const rel = file.replace(join(fileURLToPath(import.meta.url), "..", ".."), "");
  const content = readFileSync(file, "utf8");
  const lines = content.split("\n");

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineNum = i + 1;

    if (!hasInteractiveElement(line)) continue;

    const isButton = /<button|<Button|motion\.button/.test(line);
    const isAnchor = /<a\s+\w[^>]*href/.test(line);
    const hasOnClick = /onClick\s*=\s*\{/.test(line);

    if (!isButton && !isAnchor && !hasOnClick) continue;

    // Multi-line element: scan next ~15 lines for className
    let classBlock = line;
    for (let j = i + 1; j < Math.min(i + 15, lines.length); j++) {
      classBlock += "\n" + lines[j];
      if (lines[j].includes(">") || lines[j].includes("}")) break;
    }

    if (hasCompliantMinHeight(classBlock)) continue;

    const h = extractElementHeight(classBlock);
    const status = h != null && h >= MIN_TOUCH_HEIGHT_PX ? "OK" : h != null ? "VIOLATION" : "UNKNOWN";

    if (status === "VIOLATION" || (status === "UNKNOWN" && (isButton || hasOnClick))) {
      violations++;
      const hStr = h != null ? ` (detected ~${h}px)` : "";
      console.warn(`[HCI Touch] ${rel}:${lineNum} - Interactive element may have height < ${MIN_TOUCH_HEIGHT_PX}px${hStr}`);
    }
  }
}

if (violations > 0) {
  console.warn(`\n${violations} potential touch target violation(s) found. Ensure all interactive elements are >= 80px height.`);
  process.exit(1);
} else {
  console.log("Touch target audit: no violations detected.");
}
