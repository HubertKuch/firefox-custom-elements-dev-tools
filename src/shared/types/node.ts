export interface VirtualHtmlNode {
  tagName: string;
  attributes?: Record<string, string>;
  children?: VirtualHtmlNode[];
  textContent?: string;
  path?: number[]; // Path of indices in the DOM tree
}
