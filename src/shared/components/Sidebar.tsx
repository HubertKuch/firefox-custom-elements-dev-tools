import React from "preact/compat";
import { useDevTools } from "../hooks/useDevTools";
import { useUIStore } from "@src/store/useUIStore";

interface SidebarProps {} 

const Sidebar: React.FC<SidebarProps> = () => {
    const isOpen = useUIStore((state) => state.isSidebarOpen);
    const toggleSidebar = useUIStore((state) => state.toggleSidebar);
    const { currentElement } = useDevTools();

    return (
        <div className={`absolute top-0 right-0 bottom-0 w-80 bg-white dark:bg-neutral-900 border-l border-gray-200 dark:border-neutral-800 transition-transform duration-200 transform z-50 shadow-xl ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
            <div className="flex flex-col h-full overflow-hidden">
                <div className="shrink-0 p-4 border-b border-gray-200 dark:border-neutral-800 flex justify-between items-center bg-gray-50 dark:bg-neutral-950">
                    <h2 className="text-sm font-bold uppercase tracking-tight text-gray-500 dark:text-neutral-400">Properties</h2>
                    <button 
                        onClick={toggleSidebar}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="flex-1 overflow-auto p-4">
                    {!currentElement ? (
                        <div className="h-full flex flex-col items-center justify-center text-center text-gray-400">
                            <svg className="w-12 h-12 mb-3 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                            </svg>
                            <p className="text-xs uppercase tracking-widest font-medium">Select an element</p>
                            <p className="text-[10px] mt-1 opacity-60">to inspect its properties</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mb-1">Tag Name</h3>
                                <div className="font-mono text-sm font-semibold text-gray-800 dark:text-neutral-200">
                                    &lt;{currentElement.tagName.toLowerCase()}&gt;
                                </div>
                            </div>

                            {/* We can add more property inspection here later */}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Sidebar;