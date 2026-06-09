import ToggleSidebar from "./ToggleSidebar";
import Breadcumb from "./Breadcumb";
import RefreshButton from "./RefreshButton";

const Topbar = () => {
    return (
        <div className={"shrink-0 h-8 flex items-center px-1 border-b border-[#d1d1d1] dark:border-[#3c4043] bg-[#f3f3f3] dark:bg-[#242424] -mx-2 -mt-2 mb-0"}>
            <RefreshButton />
            <div className="w-[1px] h-4 bg-[#d1d1d1] dark:bg-[#3c4043] mx-1" />
            <Breadcumb />            
            <div className="flex-1" />
            <ToggleSidebar />
        </div>
    );
}

export default Topbar;