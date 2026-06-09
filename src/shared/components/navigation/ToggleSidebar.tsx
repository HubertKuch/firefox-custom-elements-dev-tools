import { useUIStore } from "@src/store/useUIStore";
import { SplitViewIcon } from "../Icons";

export default function ToggleSidebar() {
    const toggleSidebar = useUIStore((state) => state.toggleSidebar);

    return <span 
        onClick={toggleSidebar}
        className={"cursor-pointer hover:bg-gray-800 transition-all duration-75 rounded p-1"}
    >
        <SplitViewIcon />
    </span>
}