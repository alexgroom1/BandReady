/**
 * BandReady - Data models and mock data
 */

export interface StudentProfile {
  id: string;
  name: string;
  avatarColor: string;
  completedModules: string[];
  badgeCount: number;
}

export interface Module {
  id: string;
  title: string;
  icon: string;
  status: "completed" | "active" | "locked";
  starRating: number;
  lessonCount: number;
  currentLesson: number;
}

export interface Question {
  id: string;
  type: "multiple-choice";
  prompt: string;
  staffImageUrl?: string;
  audioUrl?: string;
  options: string[];
  correctAnswer: string;
  hint: string;
}

export interface ModuleProgress {
  starRating: number;
  currentLesson: number;
}

export interface ModuleDefinition {
  id: string;
  title: string;
  icon: string;
  lessonCount: number;
  order: number;
}

const STORAGE_KEYS = {
  profiles: "bandready-profiles",
  activeProfileId: "bandready-active-profile-id",
  moduleProgress: "bandready-module-progress",
} as const;

const MODULE_ORDER = [
  "reading-music",
  "note-names",
  "rhythm-basics",
  "instrument-families",
  "final-challenge",
];

export const MODULE_DEFINITIONS: ModuleDefinition[] = [
  { id: "reading-music", title: "Reading Music", icon: "book-music", lessonCount: 8, order: 0 },
  { id: "note-names", title: "Note Names", icon: "music", lessonCount: 12, order: 1 },
  { id: "rhythm-basics", title: "Rhythm Basics", icon: "drum", lessonCount: 10, order: 2 },
  { id: "instrument-families", title: "Instrument Families", icon: "trumpet", lessonCount: 6, order: 3 },
  { id: "final-challenge", title: "Final Challenge", icon: "trophy", lessonCount: 15, order: 4 },
];

export const MOCK_PROFILES: StudentProfile[] = [
  { id: "emma", name: "Emma", avatarColor: "#F5A623", completedModules: ["reading-music", "note-names"], badgeCount: 7 },
  { id: "marcus", name: "Marcus", avatarColor: "#4A90D9", completedModules: ["reading-music", "note-names"], badgeCount: 7 },
  { id: "sofia", name: "Sofia", avatarColor: "#52C98A", completedModules: ["reading-music", "note-names"], badgeCount: 7 },
];

export const MOCK_MODULE_PROGRESS: Record<string, Record<string, ModuleProgress>> = {
  emma: {
    "reading-music": { starRating: 4, currentLesson: 8 },
    "note-names": { starRating: 5, currentLesson: 12 },
    "rhythm-basics": { starRating: 0, currentLesson: 4 },
    "instrument-families": { starRating: 0, currentLesson: 0 },
    "final-challenge": { starRating: 0, currentLesson: 0 },
  },
  marcus: {
    "reading-music": { starRating: 4, currentLesson: 8 },
    "note-names": { starRating: 5, currentLesson: 12 },
    "rhythm-basics": { starRating: 0, currentLesson: 4 },
    "instrument-families": { starRating: 0, currentLesson: 0 },
    "final-challenge": { starRating: 0, currentLesson: 0 },
  },
  sofia: {
    "reading-music": { starRating: 4, currentLesson: 8 },
    "note-names": { starRating: 5, currentLesson: 12 },
    "rhythm-basics": { starRating: 0, currentLesson: 4 },
    "instrument-families": { starRating: 0, currentLesson: 0 },
    "final-challenge": { starRating: 0, currentLesson: 0 },
  },
};

export const MOCK_QUESTIONS: Record<string, Question[]> = {
  "note-names": [
    {
      id: "nn-1",
      type: "multiple-choice",
      prompt: "What note is this?",
      options: ["A", "B", "C", "D", "E", "F", "G"],
      correctAnswer: "C",
      hint: "It's in the middle of the treble clef staff.",
    },
    {
      id: "nn-2",
      type: "multiple-choice",
      prompt: "What note is on the first line of the treble clef?",
      options: ["A", "B", "C", "D", "E", "F", "G"],
      correctAnswer: "E",
      hint: "Remember: Every Good Boy Does Fine for the lines.",
    },
    {
      id: "nn-3",
      type: "multiple-choice",
      prompt: "What note sits in the first space of the treble clef?",
      options: ["A", "B", "C", "D", "E", "F", "G"],
      correctAnswer: "F",
      hint: "FACE spells the spaces from bottom to top.",
    },
    {
      id: "nn-4",
      type: "multiple-choice",
      prompt: "What note is on the top line of the treble clef?",
      options: ["A", "B", "C", "D", "E", "F", "G"],
      correctAnswer: "F",
      hint: "Every Good Boy Does Fine - the top line is F.",
    },
    { id: "nn-5", type: "multiple-choice", prompt: "What note is this?", options: ["A", "B", "C", "D", "E", "F", "G"], correctAnswer: "G", hint: "" },
    { id: "nn-6", type: "multiple-choice", prompt: "What note is this?", options: ["A", "B", "C", "D", "E", "F", "G"], correctAnswer: "A", hint: "" },
    { id: "nn-7", type: "multiple-choice", prompt: "What note is this?", options: ["A", "B", "C", "D", "E", "F", "G"], correctAnswer: "B", hint: "" },
    { id: "nn-8", type: "multiple-choice", prompt: "What note is this?", options: ["A", "B", "C", "D", "E", "F", "G"], correctAnswer: "D", hint: "" },
  ],
};

/** HCI: Check if localStorage is available (private mode, quota, etc.) */
export function isLocalStorageAvailable(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const k = "__bandready_test__";
    localStorage.setItem(k, "1");
    localStorage.removeItem(k);
    return true;
  } catch {
    return false;
  }
}

/** Get questions for a module (e.g. "note-names") */
export function getQuestions(moduleId: string): Question[] {
  return MOCK_QUESTIONS[moduleId] ?? [];
}

function getStoredProfiles(): StudentProfile[] | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.profiles);
    return raw ? (JSON.parse(raw) as StudentProfile[]) : null;
  } catch {
    return null;
  }
}

function setStoredProfiles(profiles: StudentProfile[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEYS.profiles, JSON.stringify(profiles));
  } catch {
    // Storage unavailable; use in-memory fallback
  }
}

function getStoredActiveProfileId(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(STORAGE_KEYS.activeProfileId);
  } catch {
    return null;
  }
}

function setStoredActiveProfileId(id: string): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEYS.activeProfileId, id);
  } catch {
    // Storage unavailable
  }
}

function getStoredModuleProgress(): Record<string, Record<string, ModuleProgress>> | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.moduleProgress);
    return raw ? (JSON.parse(raw) as Record<string, Record<string, ModuleProgress>>) : null;
  } catch {
    return null;
  }
}

function setStoredModuleProgress(progress: Record<string, Record<string, ModuleProgress>>): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEYS.moduleProgress, JSON.stringify(progress));
  } catch {
    // Storage unavailable
  }
}

function deriveStatus(
  moduleId: string,
  completedModules: string[]
): "completed" | "active" | "locked" {
  if (completedModules.includes(moduleId)) return "completed";
  const completedOrder = completedModules
    .map((id) => MODULE_ORDER.indexOf(id))
    .filter((i) => i >= 0)
    .sort((a, b) => a - b);
  const lastCompleted = completedOrder.length > 0 ? Math.max(...completedOrder) : -1;
  const nextModuleId = MODULE_ORDER[lastCompleted + 1];
  return moduleId === nextModuleId ? "active" : "locked";
}

export function buildModules(
  profile: StudentProfile,
  moduleProgress: Record<string, ModuleProgress>
): Module[] {
  return MODULE_DEFINITIONS.map((def) => {
    const prog = moduleProgress[def.id] ?? { starRating: 0, currentLesson: 0 };
    const status = deriveStatus(def.id, profile.completedModules);
    return {
      id: def.id,
      title: def.title,
      icon: def.icon,
      status,
      starRating: prog.starRating,
      lessonCount: def.lessonCount,
      currentLesson: prog.currentLesson,
    };
  });
}

export interface BandReadyStore {
  getProfiles: () => StudentProfile[];
  getActiveProfile: () => StudentProfile | null;
  setActiveProfile: (id: string) => void;
  getModules: () => Module[];
  saveProgress: (moduleId: string, score: number) => void;
}

function createStore(): BandReadyStore {
  let profiles = getStoredProfiles() ?? MOCK_PROFILES;
  let activeProfileId = getStoredActiveProfileId() ?? profiles[0]?.id ?? "emma";
  let moduleProgress = getStoredModuleProgress() ?? MOCK_MODULE_PROGRESS;

  if (!getStoredProfiles()) {
    setStoredProfiles(profiles);
  }
  if (!getStoredActiveProfileId()) {
    setStoredActiveProfileId(activeProfileId);
  }
  if (!getStoredModuleProgress()) {
    setStoredModuleProgress(moduleProgress);
  }

  const getProfiles = (): StudentProfile[] => {
    const p = getStoredProfiles() ?? profiles;
    profiles = p;
    return p;
  };

  const getActiveProfile = (): StudentProfile | null => {
    const pid = getStoredActiveProfileId() ?? activeProfileId;
    activeProfileId = pid;
    const p = getProfiles().find((pr) => pr.id === pid) ?? null;
    return p;
  };

  const setActiveProfile = (id: string): void => {
    activeProfileId = id;
    setStoredActiveProfileId(id);
  };

  const getModules = (): Module[] => {
    const profile = getActiveProfile();
    if (!profile) return [];
    const prog = getStoredModuleProgress() ?? moduleProgress;
    const profileProg = prog[profile.id] ?? MOCK_MODULE_PROGRESS[profile.id] ?? {};
    return buildModules(profile, profileProg);
  };

  const saveProgress = (moduleId: string, score: number): void => {
    const profile = getActiveProfile();
    if (!profile) return;

    const starRating = Math.min(5, Math.max(0, Math.round((score / 100) * 5)));
    const prog = getStoredModuleProgress() ?? moduleProgress;
    const profileProg = { ...(prog[profile.id] ?? {}) };
    const modDef = MODULE_DEFINITIONS.find((m) => m.id === moduleId);
    const lessonCount = modDef?.lessonCount ?? 1;

    profileProg[moduleId] = {
      starRating: Math.max(profileProg[moduleId]?.starRating ?? 0, starRating),
      currentLesson: lessonCount,
    };

    const newProg = { ...prog, [profile.id]: profileProg };
    moduleProgress = newProg;
    setStoredModuleProgress(newProg);

    if (!profile.completedModules.includes(moduleId)) {
      const updatedProfiles = getProfiles().map((p) =>
        p.id === profile.id
          ? {
              ...p,
              completedModules: [...p.completedModules, moduleId],
              badgeCount: p.badgeCount + 1,
            }
          : p
      );
      profiles = updatedProfiles;
      setStoredProfiles(updatedProfiles);
    }
  };

  return {
    getProfiles,
    getActiveProfile,
    setActiveProfile,
    getModules,
    saveProgress,
  };
}

let store: BandReadyStore | null = null;

export function getBandReadyStore(): BandReadyStore {
  if (!store) store = createStore();
  return store;
}
