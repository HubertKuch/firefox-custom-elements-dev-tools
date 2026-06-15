import { VirtualHtmlNode } from '@types/node';

export interface DevToolsClient {
  getCustomElements(): Promise<VirtualHtmlNode | null>;
  inspectElement(node: VirtualHtmlNode): Promise<Record<string, string>>;
  setAttribute(node: VirtualHtmlNode, name: string, value: string): Promise<boolean>;
  setProperty(node: VirtualHtmlNode, name: string, value: any): Promise<boolean>;
  highlightElement(node: VirtualHtmlNode): Promise<boolean>;
  clearHighlight(): Promise<boolean>;
  isAvailable(): boolean;
}
