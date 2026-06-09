import browser from 'webextension-polyfill';
import { useEffect, useState } from 'preact/hooks';
import { TreeView } from '../../shared/components/TreeView';
import { VirtualHtmlNode } from '../../shared/types/node';
import { buildCustomElementTree } from '../../utils/finder';

export default function App() {
  const [rootNode, setRootNode] = useState<VirtualHtmlNode | null>(null);
  const [error, setError] = useState<string | null>(null);

  const refreshElements = async () => {
    try {
      const tabId = browser.devtools.inspectedWindow.tabId;
      if (tabId === undefined) {
        setError('No tab ID found for the inspected window');
        return;
      }

      const results = await browser.runtime.sendMessage({
        type: 'executeScript',
        tabId: tabId
      });
      
      if (results && results[0]) {
        setRootNode(results[0].result as VirtualHtmlNode);
        setError(null);
      } else {
        setError('No results returned from background script');
      }
    } catch (err) {
      console.error(err);
      setError('Failed to execute script: ' + (err instanceof Error ? err.message : String(err)));
    }
  };


  useEffect(() => {
    refreshElements();
  }, []);

  return (
    <div className="h-full flex flex-col p-2">
      {error && (
        <div className="shrink-0 text-xs text-red-500 mb-4 p-2 bg-red-50 border border-red-200 rounded">
          {error}
        </div>
      )}

      {rootNode ? (
        <TreeView data={rootNode}/>
      ) : (
        <div className="text-xs text-gray-500 italic p-4 border border-dashed border-gray-300 rounded text-center">
          No custom elements found on the page.
        </div>
      )}
    </div>
  );
}
