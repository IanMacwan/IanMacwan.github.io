import { create } from "zustand";

export type FileType =
  | "about.md"
  | "projects.md"
  | "experience.md"
  | "blog.md"
  | "contact.md";

interface EditorState {
  openTabs: FileType[];
  activeTab: FileType;
  openTab: (tab: FileType) => void;
  setActiveTab: (tab: FileType) => void;
  closeTab: (tab: FileType) => void;
}

export const useEditorStore = create<EditorState>((set) => ({
  openTabs: ["about.md"],
  activeTab: "about.md",

  openTab: (tab) =>
    set((state) => ({
      openTabs: state.openTabs.includes(tab)
        ? state.openTabs
        : [...state.openTabs, tab],
      activeTab: tab,
    })),

  setActiveTab: (tab) => set({ activeTab: tab }),

  closeTab: (tab) =>
    set((state) => {
      const tabs = state.openTabs.filter((t) => t !== tab);
      const active =
        state.activeTab === tab
          ? tabs[tabs.length - 1] ?? "about.md"
          : state.activeTab;
      return { openTabs: tabs, activeTab: active };
    }),
}));
