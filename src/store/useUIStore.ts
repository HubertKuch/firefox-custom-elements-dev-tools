import { create } from "zustand";
import { VirtualHtmlNode } from "@types/node";

export interface UIState {
    isSidebarOpen: boolean;
    toggleSidebar: () => void;
    openSidebar: () => void;
    currentElement: VirtualHtmlNode | null;
    setCurrentElement: (node: VirtualHtmlNode | null) => void;
    elementProperties: string[] | null;
    setElementProperties: (properties: string[] | null) => void;
    rootNode: VirtualHtmlNode | null;
    setRootNode: (node: VirtualHtmlNode | null) => void;
    isLoading: boolean;
    setIsLoading: (isLoading: boolean) => void;
    error: string | null;
    setError: (error: string | null) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isSidebarOpen: false,
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  openSidebar: () => set({ isSidebarOpen: true }),
  currentElement: null,
  setCurrentElement: (node) => set({ currentElement: node }),
  elementProperties: null,
  setElementProperties: (properties) => set({ elementProperties: properties }),
  rootNode: null,
  setRootNode: (node) => set({ rootNode: node }),
  isLoading: true,
  setIsLoading: (isLoading) => set({ isLoading }),
  error: null,
  setError: (error) => set({ error }),
}));
