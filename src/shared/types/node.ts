export interface VirtualHtmlNode {
  tagName: string;
  attributes?: Record<string, string>;
  children?: VirtualHtmlNode[];
  textContent?: string;
}
