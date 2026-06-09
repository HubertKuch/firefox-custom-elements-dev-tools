import { useDevTools } from "@src/shared/hooks/useDevTools";

export default function Breadcumb() {
    const { currentElement } = useDevTools();
    
    if (!currentElement) return null;
    
    return (
        <div className="flex-1 flex items-center overflow-hidden px-2 space-x-1 font-mono text-[10px] text-gray-500">
            <span className="shrink-0">html</span>
            <span className="shrink-0 text-gray-400">&gt;</span>
            <span className="shrink-0">body</span>
            <span className="shrink-0 text-gray-400">&gt;</span>
            <span className="text-blue-600 dark:text-blue-400 font-bold truncate">{currentElement.tagName.toLowerCase()}</span>
        </div>
    );
}