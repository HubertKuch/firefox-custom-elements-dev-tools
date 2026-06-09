import { useUIStore } from "@src/store/useUIStore";

export const InspectorHeader = () => {
    const toggleSidebar = useUIStore((state) => state.toggleSidebar);

    return (
        <div className="shrink-0 h-8 px-3 border-b border-[#d1d1d1] dark:border-[#3c4043] flex justify-between items-center bg-[#f3f3f3] dark:bg-[#242424]">
            <span className="text-[11px] font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Inspector</span>
            <button 
                onClick={toggleSidebar}
                className="text-gray-500 hover:text-black dark:hover:text-white"
            >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
    );
};
