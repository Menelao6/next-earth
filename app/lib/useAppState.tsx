"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import type { PathChoice } from "../components/PathCards/PathCards";

export interface UserInputState {
  path?: PathChoice;
  country?: string;
  age?: number;
  skills: string[];
  language?: string;
  equityFlag?: boolean;
}

const defaultState: UserInputState = { skills: [] };

type Ctx = {
  state: UserInputState;
  setState: (s: UserInputState) => void;
};

const AppStateCtx = createContext<Ctx>({ state: defaultState, setState: () => {} });

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<UserInputState>(() => {
    if (typeof window !== "undefined") {
      try { return JSON.parse(localStorage.getItem("renewus_state") || "null") || defaultState; }
      catch { /* noop */ }
    }
    return defaultState;
  });

  useEffect(() => {
    try { localStorage.setItem("renewus_state", JSON.stringify(state)); } catch {}
  }, [state]);

  return (
    <AppStateCtx.Provider value={{ state, setState }}>
      {children}
    </AppStateCtx.Provider>
  );
}

export function useAppState() {
  return useContext(AppStateCtx);
}
