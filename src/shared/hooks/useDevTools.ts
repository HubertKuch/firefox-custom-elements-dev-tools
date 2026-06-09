import { useState, useEffect, useCallback, useMemo } from 'preact/hooks';
import { VirtualHtmlNode } from '@types/node';
import { getDevToolsClient, DevToolsClient } from '@utils/devtools';

interface UseDevToolsResult {
  rootNode: VirtualHtmlNode | null;
  error: string | null;
  isLoading: boolean;
  refresh: () => Promise<void>;
  client: DevToolsClient;
}

export function useDevTools(): UseDevToolsResult {
  const [rootNode, setRootNode] = useState<VirtualHtmlNode | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const client = useMemo(() => getDevToolsClient(), []);

  const refresh = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await client.getCustomElements();
      setRootNode(data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Failed to refresh elements: ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setIsLoading(false);
    }
  }, [client]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { rootNode, error, isLoading, refresh, client };
}
