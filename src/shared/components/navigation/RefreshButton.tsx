import { useDevTools } from "@src/shared/hooks/useDevTools";

export default function RefreshButton() {
    const { refresh, isLoading } = useDevTools();

    return <button
        onClick={refresh}
        disabled={isLoading}
        className={`p-1.5 rounded hover:bg-[#e0e0e0] dark:hover:bg-[#35363a] text-gray-600 dark:text-gray-300 transition-colors ${isLoading ? 'animate-spin opacity-50' : ''}`}
        title="Refresh elements"
    >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
    </button>
}