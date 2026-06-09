import { SectionHeader } from "./SectionHeader";

export const PropertiesSection = ({ properties }: { properties: string[] | null }) => (
    <>
        <SectionHeader title="Properties" />
        <div className="p-2 bg-white dark:bg-[#202124] font-mono text-[11px]">
            {properties && properties.length > 0 ? (
                <div className="grid grid-cols-2 gap-x-2 gap-y-1">
                    {properties.map(prop => (
                        <div key={prop} className="px-1 py-0.5 hover:bg-[#dbeefd] dark:hover:bg-[#333940] text-gray-700 dark:text-gray-300 truncate rounded" title={prop}>
                            {prop}
                        </div>
                    ))}
                </div>
            ) : (
                <div className="px-1 text-gray-400 italic">No custom properties</div>
            )}
        </div>
    </>
);
