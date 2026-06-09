import { VirtualHtmlNode } from '../shared/types/node';

/**
 * Recursively finds all custom elements and builds a virtual tree of them.
 */
export function buildCustomElementTree(): VirtualHtmlNode | null {
  function isCustomElement(el: Element): boolean {
    return el.tagName.toLowerCase().includes('-');
  }

  function mapElement(el: Element): VirtualHtmlNode {
    const children: VirtualHtmlNode[] = [];
    
    function findNested(root: Element | ShadowRoot, acc: VirtualHtmlNode[]) {
      for (let i = 0; i < root.children.length; i++) {
        const child = root.children[i];
        if (isCustomElement(child)) {
          acc.push(mapElement(child));
        } else {
          findNested(child, acc);
        }
      }
      if (root instanceof Element && root.shadowRoot) {
        findNested(root.shadowRoot, acc);
      }
    }

    // Search for nested custom elements in light DOM
    for (let i = 0; i < el.children.length; i++) {
      const child = el.children[i];
      if (isCustomElement(child)) {
        children.push(mapElement(child));
      } else {
        findNested(child, children);
      }
    }

    // Search in shadow DOM
    if (el.shadowRoot) {
      for (let i = 0; i < el.shadowRoot.children.length; i++) {
        const child = el.shadowRoot.children[i];
        if (isCustomElement(child)) {
          children.push(mapElement(child));
        } else {
          findNested(child, children);
        }
      }
    }

    return {
      tagName: el.tagName.toLowerCase(),
      children: children.length > 0 ? children : undefined
    };
  }

  const results: VirtualHtmlNode[] = [];
  
  function walk(node: Element | Document | ShadowRoot) {
    for (let i = 0; i < node.children.length; i++) {
      const child = node.children[i];
      if (isCustomElement(child)) {
        results.push(mapElement(child));
      } else {
        walk(child);
        if (child.shadowRoot) {
          walk(child.shadowRoot);
        }
      }
    }
  }

  walk(document.body);

  if (results.length === 0) return null;
  if (results.length === 1) return results[0];
  
  return {
    tagName: 'root',
    children: results
  };
}

/**
 * Flat finder (original implementation)
 */
export function findCustomElements(root: Node = document.body, result: Element[] = []): Element[] {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT);
  let node = walker.nextNode() as Element | null;

  while (node) {
    const tagName = node.tagName.toLowerCase();

    if (tagName.includes('-')) {
      result.push(node);
    }

    if (node.shadowRoot) {
      findCustomElements(node.shadowRoot, result);
    }

    node = walker.nextNode() as Element | null;
  }

  return result;
}
