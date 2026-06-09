import { useEffect } from 'preact/hooks';
import { TreeView } from '@components/TreeView';
import { useDevTools } from '@hooks/useDevTools';
import Topbar from '@components/navigation/Topbar';
import Sidebar from '@components/inspector/Sidebar';

export default function App() {
  const { rootNode, error, isLoading, client, refresh, currentElement, setElementProperties } = useDevTools();

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    if (currentElement) {
      client.inspectElement(currentElement).then(props => {
        setElementProperties(props);
      }).catch(err => {
        console.error("Failed to fetch properties", err);
        setElementProperties([]);
      });
    } else {
      setElementProperties(null);
    }
  }, [currentElement, client, setElementProperties]);

  return (
    <div className="h-full flex flex-col bg-white dark:bg-[#202124] relative overflow-hidden">
      {error && (
        <div className="shrink-0 text-[11px] text-red-500 p-2 bg-red-50 dark:bg-red-900/10 border-b border-red-200 dark:border-red-900/30">
          {error}
        </div>
      )}

      {!client.isAvailable() && (
        <div className="shrink-0 px-2 py-0.5 bg-amber-50 dark:bg-amber-900/10 border-b border-amber-200 dark:border-amber-900/30 text-[9px] text-amber-700 dark:text-amber-400 uppercase tracking-widest font-bold">
          Preview Mode
        </div>
      )}
      
      <Topbar />

      <div className="flex-1 flex overflow-hidden relative">
        <div className="flex-1 flex flex-col min-w-0">
          {isLoading ? (
            <div className="flex-1 flex items-center justify-center text-[11px] text-gray-400 font-mono">
              <span className="animate-pulse">Loading DOM tree...</span>
            </div>
          ) : rootNode ? (
            <TreeView data={rootNode}/>
          ) : (
            <div className="flex-1 flex items-center justify-center text-[11px] text-gray-500 italic p-8 text-center">
              No custom elements detected on this page.
            </div>
          )}
        </div>
        
        <Sidebar />
      </div>
    </div>
  );
}
