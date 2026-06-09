import { TreeView } from '@components/TreeView';
import { useDevTools } from '@hooks/useDevTools';

export default function App() {
  const { rootNode, error, isLoading, client } = useDevTools();

  return (
    <div className="h-full flex flex-col p-2 bg-white dark:bg-neutral-950">
      {error && (
        <div className="shrink-0 text-xs text-red-500 mb-4 p-2 bg-red-50 border border-red-200 rounded">
          {error}
        </div>
      )}

      {!client.isAvailable() && (
        <div className="shrink-0 mb-4 p-2 bg-blue-50 border border-blue-200 rounded text-[10px] text-blue-700 uppercase tracking-wider font-bold">
          Preview Mode
        </div>
      )}

      {isLoading ? (
        <div className="flex-1 flex items-center justify-center text-xs text-gray-400 italic">
          Loading elements...
        </div>
      ) : rootNode ? (
        <TreeView data={rootNode}/>
      ) : (
        <div className="text-xs text-gray-500 italic p-4 border border-dashed border-gray-300 rounded text-center">
          No custom elements found on the page.
        </div>
      )}
    </div>
  );
}
