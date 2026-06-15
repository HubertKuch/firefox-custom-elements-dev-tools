import { DevToolsClient } from './types';
import { VirtualHtmlNode } from '@types/node';

export class MockDevToolsClient implements DevToolsClient {
  private mockTree: VirtualHtmlNode | null = null;

  isAvailable(): boolean {
    return false; // Specifically return false to indicate it's a mock
  }

  private initMockTree() {
    if (this.mockTree) return;
    const tree = {
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

    const assignPaths = (node: VirtualHtmlNode, currentPath: number[]) => {
      node.path = currentPath;
      if (node.children) {
        node.children.forEach((child, index) => {
          assignPaths(child, [...currentPath, index]);
        });
      }
    };
    assignPaths(tree, [0]);
    this.mockTree = tree;
  }

  async getCustomElements(): Promise<VirtualHtmlNode | null> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    this.initMockTree();
    
    // Return a deep clone of the tree so that mutations are clean
    return JSON.parse(JSON.stringify(this.mockTree));
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
      this.initMockTree();
      
      if (node.path && this.mockTree) {
        const target = this.findNodeInMockTree(this.mockTree, node.path);
        if (target) {
          if (!target.attributes) {
            target.attributes = {};
          }
          target.attributes[name] = value;
          return true;
        }
      }
      return false;
  }

  async setProperty(node: VirtualHtmlNode, name: string, _value: any): Promise<boolean> {
      console.log(`[MOCK] Setting property ${name} on ${node.tagName}`);
      return true;
  }

  async highlightElement(node: VirtualHtmlNode): Promise<boolean> {
      console.log(`[MOCK] Highlighting element ${node.tagName} with path ${node.path?.join(',')}`);
      return true;
  }

  async clearHighlight(): Promise<boolean> {
      console.log(`[MOCK] Clearing highlight`);
      return true;
  }

  private findNodeInMockTree(root: VirtualHtmlNode, path: number[]): VirtualHtmlNode | null {
    const pathsEqual = (a: number[] | undefined, b: number[] | undefined) => {
      if (!a || !b) return false;
      if (a.length !== b.length) return false;
      return a.every((val, idx) => val === b[idx]);
    };

    if (pathsEqual(root.path, path)) return root;
    if (root.children) {
      for (const child of root.children) {
        const found = this.findNodeInMockTree(child, path);
        if (found) return found;
      }
    }
    return null;
  }
}
