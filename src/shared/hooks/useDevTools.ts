import { useState, useEffect, useCallback, useMemo } from 'preact/hooks';
import { VirtualHtmlNode } from '@types/node';
import { getDevToolsClient, DevToolsClient } from '@utils/devtools';
import { useUIStore } from '@src/store/useUIStore';

interface UseDevToolsResult {
  rootNode: VirtualHtmlNode | null;
  error: string | null;
  isLoading: boolean;
  refresh: () => Promise<void>;
  client: DevToolsClient;
  currentElement: VirtualHtmlNode | null;
  setCurrentElement: (node: VirtualHtmlNode | null) => void;
  elementProperties: Record<string, string> | null;
}

export function useDevTools(): UseDevToolsResult {
  const rootNode = useUIStore((state) => state.rootNode);
  const setRootNode = useUIStore((state) => state.setRootNode);
  const error = useUIStore((state) => state.error);
  const setError = useUIStore((state) => state.setError);
  const isLoading = useUIStore((state) => state.isLoading);
  const setIsLoading = useUIStore((state) => state.setIsLoading);
  
  const currentElement = useUIStore((state) => state.currentElement);
  const setCurrentElement = useUIStore((state) => state.setCurrentElement);
  const elementProperties = useUIStore((state) => state.elementProperties);
  const setElementProperties = useUIStore((state) => state.setElementProperties);

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
  }, [client, setIsLoading, setRootNode, setError]);

  return { rootNode, error, isLoading, refresh, client, currentElement, setCurrentElement, elementProperties };
}
