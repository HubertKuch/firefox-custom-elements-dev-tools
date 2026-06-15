import { create } from "zustand";
import { VirtualHtmlNode } from "@types/node";

function pathsEqual(a: number[] | undefined, b: number[] | undefined): boolean {
  if (!a || !b) return false;
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

function findNodeByPath(root: VirtualHtmlNode | null, path: number[] | undefined): VirtualHtmlNode | null {
  if (!root || !path) return null;
  if (pathsEqual(root.path, path)) return root;
  if (root.children) {
    for (const child of root.children) {
      const found = findNodeByPath(child, path);
      if (found) return found;
    }
  }
  return null;
}

export interface UIState {
    isSidebarOpen: boolean;
    toggleSidebar: () => void;
    openSidebar: () => void;
    currentElement: VirtualHtmlNode | null;
    setCurrentElement: (node: VirtualHtmlNode | null) => void;
    elementProperties: Record<string, string> | null;
    setElementProperties: (properties: Record<string, string> | null) => void;
    rootNode: VirtualHtmlNode | null;
    setRootNode: (node: VirtualHtmlNode | null) => void;
    isLoading: boolean;
    setIsLoading: (isLoading: boolean) => void;
    error: string | null;
    setError: (error: string | null) => void;
    sidebarWidth: number;
    setSidebarWidth: (width: number) => void;
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
  setRootNode: (node) => set((state) => {
    let updatedCurrentElement = state.currentElement;
    if (state.currentElement && node) {
      if (state.currentElement.path) {
        const found = findNodeByPath(node, state.currentElement.path);
        updatedCurrentElement = found || null;
      } else if (state.currentElement.tagName === 'root' && node.tagName === 'root') {
        updatedCurrentElement = node;
      } else {
        updatedCurrentElement = null;
      }
    } else {
      updatedCurrentElement = null;
    }
    return {
      rootNode: node,
      currentElement: updatedCurrentElement
    };
  }),
  isLoading: true,
  setIsLoading: (isLoading) => set({ isLoading }),
  error: null,
  setError: (error) => set({ error }),
  sidebarWidth: 320,
  setSidebarWidth: (width) => set({ sidebarWidth: width }),
}));
