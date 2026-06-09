import { VirtualHtmlNode } from "@src/shared/types/node";
import { SectionHeader } from "./SectionHeader";

export const SummarySection = ({ node }: { node: VirtualHtmlNode }) => (
    <>
        <SectionHeader title="Summary" />
        <div className="p-2 bg-white dark:bg-[#202124] font-mono text-[11px] space-y-1">
            <div className="flex"><span className="w-20 text-gray-500">Tag:</span> <span className="text-[#881280] dark:text-[#5db0d7] font-bold">{node.tagName.toLowerCase()}</span></div>
            {node.textContent && (
                <div className="flex"><span className="w-20 text-gray-500">Text:</span> <span className="text-gray-800 dark:text-gray-200 truncate italic">"{node.textContent}"</span></div>
            )}
        </div>
    </>
);
