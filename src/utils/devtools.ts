import { VirtualHtmlNode } from '@types/node';

export interface DevToolsClient {
  getCustomElements(): Promise<VirtualHtmlNode | null>;
  inspectElement(node: VirtualHtmlNode): Promise<Record<string, string>>;
  setAttribute(node: VirtualHtmlNode, name: string, value: string): Promise<boolean>;
  setProperty(node: VirtualHtmlNode, name: string, value: any): Promise<boolean>;
  isAvailable(): boolean;
}

export class ExtensionDevToolsClient implements DevToolsClient {
  isAvailable(): boolean {
    // Check for devtools API presence
    return !!(window.chrome && window.chrome.devtools) || !!(window.browser && window.browser.devtools);
  }

  async getCustomElements(): Promise<VirtualHtmlNode | null> {
    // Use dynamic import to avoid throwing at the top level in standard browsers
    const browser = (await import('webextension-polyfill')).default;

    if (!browser.devtools || !browser.devtools.inspectedWindow) {
      throw new Error('DevTools API not available');
    }

    const tabId = browser.devtools.inspectedWindow.tabId;
    if (tabId === undefined) {
      throw new Error('No tab ID found for the inspected window');
    }

    const results = await browser.runtime.sendMessage({
      type: 'executeScript',
      tabId: tabId
    });

    if (results && results[0] && results[0].result) {
      return results[0].result as VirtualHtmlNode;
    }
    
    return null;
  }

  async inspectElement(node: VirtualHtmlNode): Promise<Record<string, string>> {
      const browser = (await import('webextension-polyfill')).default;
      
      const tabId = browser.devtools?.inspectedWindow?.tabId;
      if (!tabId) {
          console.warn('No tab ID available for inspection');
          return {};
      }

      const results = await browser.runtime.sendMessage({
          type: 'getProperties',
          tabId: tabId,
          path: node.path
      });

      return results || {};
  }

  async setAttribute(node: VirtualHtmlNode, name: string, value: string): Promise<boolean> {
      const browser = (await import('webextension-polyfill')).default;
      const tabId = browser.devtools?.inspectedWindow?.tabId;
      if (!tabId || !node.path) return false;

      return await browser.runtime.sendMessage({
          type: 'setAttribute',
          tabId: tabId,
          path: node.path,
          name,
          value
      });
  }

  async setProperty(node: VirtualHtmlNode, name: string, value: any): Promise<boolean> {
      const browser = (await import('webextension-polyfill')).default;
      const tabId = browser.devtools?.inspectedWindow?.tabId;
      if (!tabId || !node.path) return false;

      return await browser.runtime.sendMessage({
          type: 'setProperty',
          tabId: tabId,
          path: node.path,
          name,
          value
      });
  }
}

export class MockDevToolsClient implements DevToolsClient {
  isAvailable(): boolean {
    return false; // Specifically return false to indicate it's a mock
  }

  async getCustomElements(): Promise<VirtualHtmlNode | null> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      tagName: 'MOCK-ROOT',
      attributes: { id: 'app-root', class: 'container mx-auto' },
      textContent: 'Welcome to the mock preview mode.',
      children: Array.from({ length: 10 }, (_, i) => ({
        tagName: `ITEM-${i + 1}`,
        attributes: { role: 'listitem', 'data-index': String(i) },
        children: i % 3 === 0 ? [
          { tagName: 'SUB-ITEM-A', attributes: { class: 'active' }, children: [] },
          { tagName: 'SUB-ITEM-B', textContent: 'Inner text here', children: [] }
        ] : []
      }))
    } as VirtualHtmlNode;
  }

  async inspectElement(_node: VirtualHtmlNode): Promise<Record<string, string>> {
      await new Promise(resolve => setTimeout(resolve, 200));
      return {
          'prop1': 'value1',
          'prop2': '123',
          'isActive': 'true',
          'count': '42',
          'items': '[object Array]',
          'config': '[object Object]'
      };
  }

  async setAttribute(node: VirtualHtmlNode, name: string, value: string): Promise<boolean> {
      console.log(`[MOCK] Setting attribute ${name} to ${value} on ${node.tagName}`);
      if (node.attributes) node.attributes[name] = value;
      return true;
  }

  async setProperty(node: VirtualHtmlNode, name: string, _value: any): Promise<boolean> {
      console.log(`[MOCK] Setting property ${name} on ${node.tagName}`);
      return true;
  }
}

export const getDevToolsClient = (): DevToolsClient => {
  const isExtension = !!(window.chrome && window.chrome.runtime && window.chrome.runtime.id && window.chrome.devtools);
  const isBrowser = !!(window.browser && window.browser.runtime && window.browser.runtime.id && window.browser.devtools);
  
  if (isExtension || isBrowser) {
    return new ExtensionDevToolsClient();
  }
  
  return new MockDevToolsClient();
};
