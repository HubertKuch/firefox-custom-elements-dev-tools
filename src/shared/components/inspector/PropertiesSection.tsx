import { VirtualHtmlNode } from "@src/shared/types/node";
import { SectionHeader } from "./SectionHeader";
import { EditableValue } from "./EditableValue";
import { useDevTools } from "@hooks/useDevTools";

export const PropertiesSection = ({ properties, node }: { properties: Record<string, string> | null, node: VirtualHtmlNode }) => {
    const { client, refresh } = useDevTools();

    const handleSave = async (name: string, newValue: string) => {
        if (!client.isAvailable()) return;
        const success = await client.setProperty(node, name, newValue);
        if (success) {
            // refresh entire tree/properties if necessary, or let App.tsx handle it if we trigger a re-selection
            // Since we're editing properties, we might just want to trigger a re-inspect
            // The simplest is to just call refresh()
            refresh();
        } else {
            console.error(`Failed to update property ${name}`);
        }
    };

    return (
        <>
            <SectionHeader title="Properties" />
            <div className="p-2 bg-white dark:bg-[#202124] space-y-0.5 font-mono text-[11px]">
                {properties && Object.keys(properties).length > 0 ? (
                    Object.entries(properties).map(([key, value]) => (
                        <div key={key} className="flex px-1 hover:bg-[#dbeefd] dark:hover:bg-[#333940] group items-center min-h-[20px]">
                            <span className="text-gray-700 dark:text-gray-300 min-w-[80px] shrink-0" title={key}>{key}</span>
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
                    <div className="px-1 text-gray-400 italic">No custom properties</div>
                )}
            </div>
        </>
    );
};
