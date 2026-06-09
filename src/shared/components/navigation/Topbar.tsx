import { useDevTools } from "@hooks/useDevTools";
import ToggleSidebar from "./ToggleSidebar";

const Topbar = () => {
    const { refresh, isLoading } = useDevTools();

    return (
        <div className={"flex justify-end items-center space-x-2 pb-2 mb-2 border-b border-gray-100 dark:border-neutral-800"}>
            <button 
                onClick={refresh}
                disabled={isLoading}
                className={`p-1 rounded hover:bg-gray-100 dark:hover:bg-neutral-800 text-gray-500 dark:text-neutral-400 transition-colors ${isLoading ? 'animate-spin opacity-50' : ''}`}
                title="Refresh elements"
            >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
            </button>
            <ToggleSidebar />
        </div>
    );
}

export default Topbar;