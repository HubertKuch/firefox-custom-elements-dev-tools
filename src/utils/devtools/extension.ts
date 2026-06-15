import { DevToolsClient } from './types';
import { VirtualHtmlNode } from '@types/node';

export class ExtensionDevToolsClient implements DevToolsClient {
  isAvailable(): boolean {
    return !!(window.chrome && window.chrome.devtools) || !!(window.browser && window.browser.devtools);
  }

  async getCustomElements(): Promise<VirtualHtmlNode | null> {
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

  async highlightElement(node: VirtualHtmlNode): Promise<boolean> {
      const browser = (await import('webextension-polyfill')).default;
      const tabId = browser.devtools?.inspectedWindow?.tabId;
      if (!tabId || !node.path) return false;

      return await browser.runtime.sendMessage({
          type: 'highlightElement',
          tabId: tabId,
          path: node.path
      });
  }

  async clearHighlight(): Promise<boolean> {
      const browser = (await import('webextension-polyfill')).default;
      const tabId = browser.devtools?.inspectedWindow?.tabId;
      if (!tabId) return false;

      return await browser.runtime.sendMessage({
          type: 'clearHighlight',
          tabId: tabId
      });
  }
}
