import React, { useRef, useState, useCallback, useEffect } from "preact/compat";
import { useUIStore } from "@src/store/useUIStore";
import { InspectorHeader } from "./InspectorHeader";
import { SummarySection } from "./SummarySection";
import { AttributesSection } from "./AttributesSection";
import { PropertiesSection } from "./PropertiesSection";

interface SidebarProps {} 

const Sidebar: React.FC<SidebarProps> = () => {
    const isOpen = useUIStore((state) => state.isSidebarOpen);
    const sidebarWidth = useUIStore((state) => state.sidebarWidth);
    const setSidebarWidth = useUIStore((state) => state.setSidebarWidth);
    const currentElement = useUIStore((state) => state.currentElement);
    const elementProperties = useUIStore((state) => state.elementProperties);

    const isResizing = useRef(false);
    const [isDragging, setIsDragging] = useState(false);

    const startResizing = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        isResizing.current = true;
        setIsDragging(true);
    }, []);

    const stopResizing = useCallback(() => {
        isResizing.current = false;
        setIsDragging(false);
    }, []);

    const resize = useCallback((e: MouseEvent) => {
        if (isResizing.current) {
            const newWidth = window.innerWidth - e.clientX;
            // Constrain width between 200px and 80% of window width
            if (newWidth > 200 && newWidth < window.innerWidth * 0.8) {
                setSidebarWidth(newWidth);
            }
        }
    }, [setSidebarWidth]);

    useEffect(() => {
        window.addEventListener('mousemove', resize);
        window.addEventListener('mouseup', stopResizing);
        return () => {
            window.removeEventListener('mousemove', resize);
            window.removeEventListener('mouseup', stopResizing);
        };
    }, [resize, stopResizing]);

    return (
        <div 
            className={`h-full bg-[#f3f3f3] dark:bg-[#242424] border-l border-[#d1d1d1] dark:border-[#3c4043] relative flex flex-col shrink-0 z-10 ${!isOpen ? 'hidden' : ''}`}
            style={{ width: `${sidebarWidth}px` }}
        >
            {/* Resize Handle */}
            <div 
                onMouseDown={startResizing}
                className="absolute left-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-blue-500/50 transition-colors z-50"
                style={{ marginLeft: '-1px' }}
            />

            <div className="flex flex-col h-full overflow-hidden">
                <InspectorHeader />

                <div className="flex-1 overflow-auto">
                    {!currentElement ? (
                        <div className="h-full flex items-center justify-center text-[#5c5c5c] dark:text-gray-500 text-[11px] italic p-8 text-center">
                            Select an element in the tree to view its properties
                        </div>
                    ) : (
                        <div className="flex flex-col">
                            <SummarySection node={currentElement} />
                            <AttributesSection node={currentElement} />
                            <PropertiesSection properties={elementProperties} node={currentElement} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Sidebar;
