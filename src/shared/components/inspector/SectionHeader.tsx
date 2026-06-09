export const SectionHeader = ({ title }: { title: string }) => (
    <div className="bg-[#eeeeee] dark:bg-[#2d2e31] px-2 py-1 text-[11px] font-bold border-y border-[#d1d1d1] dark:border-[#3c4043] flex items-center text-gray-700 dark:text-gray-300 uppercase tracking-tight">
        <svg className="w-2 h-2 mr-1.5 text-gray-400" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
        {title}
    </div>
);
