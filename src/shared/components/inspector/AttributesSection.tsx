import { VirtualHtmlNode } from "@src/shared/types/node";
import { SectionHeader } from "./SectionHeader";

export const AttributesSection = ({ node }: { node: VirtualHtmlNode }) => (
    <>
        <SectionHeader title="Attributes" />
        <div className="p-2 bg-white dark:bg-[#202124] space-y-0.5 font-mono text-[11px]">
            {node.attributes && Object.keys(node.attributes).length > 0 ? (
                Object.entries(node.attributes).map(([key, value]) => (
                    <div key={key} className="flex px-1 hover:bg-[#dbeefd] dark:hover:bg-[#333940] group">
                        <span className="text-[#994500] dark:text-[#9bbbdc] min-w-[80px]">{key}</span>
                        <span className="text-gray-400 mr-2">:</span>
                        <span className="text-[#1a1aa6] dark:text-[#f28b82] truncate text-wrap">"{value}"</span>
                    </div>
                ))
            ) : (
                <div className="px-1 text-gray-400 italic">No attributes</div>
            )}
        </div>
    </>
);
