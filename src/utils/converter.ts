import { VirtualHtmlNode } from '../shared/types/node';

/**
 * Converts a real DOM element into a VirtualHtmlNode structure.
 */
export function elementToVirtualNode(el: Element): VirtualHtmlNode {
  const attributes: Record<string, string> = {};
  
  // Capture all attributes
  for (let i = 0; i < el.attributes.length; i++) {
    const attr = el.attributes[i];
    attributes[attr.name] = attr.value;
  }

  // Recursive conversion of children
  const children: VirtualHtmlNode[] = [];
  for (let i = 0; i < el.children.length; i++) {
    children.push(elementToVirtualNode(el.children[i]));
  }

  return {
    tagName: el.tagName.toLowerCase(),
    attributes: Object.keys(attributes).length > 0 ? attributes : undefined,
    children: children.length > 0 ? children : undefined,
    textContent: el.children.length === 0 ? el.textContent?.trim() || undefined : undefined
  };
}
