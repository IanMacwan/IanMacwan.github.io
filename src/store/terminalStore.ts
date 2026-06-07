import { create } from "zustand";

export type OutputType = "text" | "neofetch" | "markdown" | "error" | "help";

export interface TerminalLine {
  id: number;
  kind: "input" | "output";
  type?: OutputType;
  text: string;
}

interface TerminalState {
  lines: TerminalLine[];
  history: string[];
  historyIndex: number;
  hasBooted: boolean;

  addInput:        (text: string) => void;
  addOutput:       (text: string, type?: OutputType) => void;
  clear:           () => void;
  clearAndRefresh: () => void;
  pushHistory:     (cmd: string) => void;
  setHistoryIndex: (i: number) => number;
  markBooted:      () => void;
}

let _counter = 0;

export const useTerminalStore = create<TerminalState>((set, get) => ({
  lines: [],
  history: [],
  historyIndex: -1,
  hasBooted: false,

  addInput: (text) =>
    set((s) => ({
      lines: [...s.lines, { id: _counter++, kind: "input", text }],
    })),

  addOutput: (text, type = "text") =>
    set((s) => ({
      lines: [...s.lines, { id: _counter++, kind: "output", type, text }],
    })),

  clear: () => set({ lines: [] }),

  clearAndRefresh: () => {
    set({ lines: [] });
    set((s) => ({
      lines: [...s.lines, { id: _counter++, kind: "output", type: "neofetch", text: "" }],
    }));
  },

  markBooted: () => set({ hasBooted: true }),

  pushHistory: (cmd) =>
    set((s) => ({
      history: [cmd, ...s.history.slice(0, 49)],
      historyIndex: -1,
    })),

  setHistoryIndex: (i) => {
    const { history } = get();
    const clamped = Math.max(-1, Math.min(history.length - 1, i));
    set({ historyIndex: clamped });
    return clamped;
  },
}));
