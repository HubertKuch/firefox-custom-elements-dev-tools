import { VirtualHtmlNode } from "@src/shared/types/node";
import { SectionHeader } from "./SectionHeader";
import { EditableValue } from "./EditableValue";
import { useDevTools } from "@hooks/useDevTools";

export const AttributesSection = ({ node }: { node: VirtualHtmlNode }) => {
    const { client, refresh } = useDevTools();

    const handleSave = async (name: string, newValue: string) => {
        if (!client.isAvailable()) return;
        const success = await client.setAttribute(node, name, newValue);
        if (success) {
            // Optional: immediately update the node locally for snappy UI, or just refresh
            // node.attributes[name] = newValue; 
            refresh();
        } else {
            console.error(`Failed to update attribute ${name}`);
        }
    };

    return (
        <>
            <SectionHeader title="Attributes" />
            <div className="p-2 bg-white dark:bg-[#202124] space-y-0.5 font-mono text-[11px]">
                {node.attributes && Object.keys(node.attributes).length > 0 ? (
                    Object.entries(node.attributes).map(([key, value]) => (
                        <div key={key} className="flex px-1 hover:bg-[#dbeefd] dark:hover:bg-[#333940] group items-center min-h-[20px]">
                            <span className="text-[#994500] dark:text-[#9bbbdc] min-w-[80px] shrink-0">{key}</span>
                            <span className="text-gray-400 mr-2 shrink-0">:</span>
                            <div className="flex-1 min-w-0 flex items-center">
                                <EditableValue 
                                    initialValue={value} 
                                    onSave={(newVal) => handleSave(key, newVal)}
                                    className="text-[#1a1aa6] dark:text-[#f28b82]"
                                />
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="px-1 text-gray-400 italic">No attributes</div>
                )}
            </div>
        </>
    );
};
