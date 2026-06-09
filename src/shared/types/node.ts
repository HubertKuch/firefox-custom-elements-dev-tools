// Type definition representing an HTML Node element
export interface VirtualHtmlNode {
  tagName: string;
  attributes?: Record<string, string>;
  children?: VirtualHtmlNode[];
  textContent?: string;
}
