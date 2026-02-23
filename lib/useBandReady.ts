"use client";

import { useState, useEffect, useCallback } from "react";
import {
  getBandReadyStore,
  type StudentProfile,
  type Module,
} from "./data";

export interface UseBandReadyReturn {
  getProfiles: () => StudentProfile[];
  getActiveProfile: () => StudentProfile | null;
  setActiveProfile: (id: string) => void;
  getModules: () => Module[];
  saveProgress: (moduleId: string, score: number) => void;
  profiles: StudentProfile[];
  activeProfile: StudentProfile | null;
  modules: Module[];
}

export function useBandReady(): UseBandReadyReturn {
  const [profiles, setProfiles] = useState<StudentProfile[]>([]);
  const [activeProfile, setActiveProfileState] = useState<StudentProfile | null>(null);
  const [modules, setModules] = useState<Module[]>([]);

  const store = getBandReadyStore();

  const refresh = useCallback(() => {
    const p = store.getProfiles();
    const a = store.getActiveProfile();
    const m = store.getModules();
    setProfiles(p);
    setActiveProfileState(a);
    setModules(m);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const setActiveProfile = useCallback(
    (id: string) => {
      store.setActiveProfile(id);
      refresh();
    },
    [refresh]
  );

  const saveProgress = useCallback(
    (moduleId: string, score: number) => {
      store.saveProgress(moduleId, score);
      refresh();
    },
    [refresh]
  );

  return {
    getProfiles: store.getProfiles,
    getActiveProfile: store.getActiveProfile,
    setActiveProfile,
    getModules: store.getModules,
    saveProgress,
    profiles,
    activeProfile,
    modules,
  };
}
