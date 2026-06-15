import { VirtualHtmlNode } from '@types/node';

/**
 * Recursively finds all custom elements and builds a virtual tree of them.
 */
export function buildCustomElementTree(): VirtualHtmlNode | null {
  function isCustomElement(el: Element): boolean {
    return el.tagName.toLowerCase().includes('-');
  }

  function getElementAttributes(el: Element): Record<string, string> {
    const attrs: Record<string, string> = {};
    if (el.attributes) {
      for (let i = 0; i < el.attributes.length; i++) {
        const attr = el.attributes[i];
        attrs[attr.name] = attr.value;
      }
    }
    return attrs;
  }

  // DOM index path resolver
  function getElementPath(el: Element): number[] {
    const path: number[] = [];
    let current: Node | null = el;
    while (current && current !== document) {
      const parent = current.parentNode || (current instanceof ShadowRoot ? current.host : null);
      if (parent) {
        if (current instanceof ShadowRoot) {
          path.unshift(-1); // Indicator for shadowRoot
        } else {
          const index = Array.prototype.indexOf.call(parent.childNodes, current);
          path.unshift(index);
        }
        current = parent;
      } else {
        break;
      }
    }
    return path;
  }

  function mapElement(el: Element): VirtualHtmlNode {
    const children: VirtualHtmlNode[] = [];
    
    function findNested(root: Element | ShadowRoot) {
      if (!root.children) return;
      for (let i = 0; i < root.children.length; i++) {
        const child = root.children[i];
        if (isCustomElement(child)) {
          children.push(mapElement(child));
        } else {
          findNested(child);
          if (child.shadowRoot) {
            findNested(child.shadowRoot);
          }
        }
      }
    }

    // Search for nested custom elements
    if (el.children) {
      for (let i = 0; i < el.children.length; i++) {
        const child = el.children[i];
        if (isCustomElement(child)) {
          children.push(mapElement(child));
        } else {
          findNested(child);
          if (child.shadowRoot) {
            findNested(child.shadowRoot);
          }
        }
      }
    }

    if (el.shadowRoot) {
      findNested(el.shadowRoot);
    }

    return {
      tagName: el.tagName.toLowerCase(),
      attributes: getElementAttributes(el),
      textContent: el.textContent?.trim().substring(0, 100),
      path: getElementPath(el),
      children: children.length > 0 ? children : undefined
    };
  }

  const results: VirtualHtmlNode[] = [];
  
  function walk(node: Element | Document | ShadowRoot) {
    if (!node) return;
    const children = node.children;
    if (!children) return;

    for (let i = 0; i < children.length; i++) {
      const child = children[i];
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

  walk(document.documentElement || document.body || document);

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
