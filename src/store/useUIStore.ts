import { create } from "zustand";
import { VirtualHtmlNode } from "@types/node";

export interface UIState {
    isSidebarOpen: boolean;
    toggleSidebar: () => void;
    openSidebar: () => void;
    currentElement: VirtualHtmlNode | null;
    setCurrentElement: (node: VirtualHtmlNode | null) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isSidebarOpen: false,
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  openSidebar: () => set({ isSidebarOpen: true }),
  currentElement: null,
  setCurrentElement: (node) => set({ currentElement: node }),
}));
