import { VirtualHtmlNode } from '../shared/types/node';

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

export function getElementPropertiesByPath(path: number[]): Record<string, string> {
  if (!path || path.length === 0) return {};
  
  let current: Node = document;
  for (const index of path) {
    if (index === -1) {
      if (current instanceof Element && current.shadowRoot) {
        current = current.shadowRoot;
      } else {
        return {};
      }
    } else {
      if (current && current.childNodes && current.childNodes[index]) {
        current = current.childNodes[index];
      } else {
        return {};
      }
    }
  }

  if (!(current instanceof HTMLElement)) return {};

  const element = current;
  const elementProto = Object.getPrototypeOf(element);
  const htmlElementProto = HTMLElement.prototype;

  const properties: Record<string, string> = {};
  let currentProto = elementProto;

  while (currentProto && currentProto !== htmlElementProto) {
    const descriptors = Object.getOwnPropertyDescriptors(currentProto);

    Object.keys(descriptors).forEach(key => {
      if (key !== 'constructor' && !(key in properties)) {
        try {
            const val = (element as any)[key];
            properties[key] = String(val);
        } catch (e) {
            properties[key] = '<error>';
        }
      }
    });

    currentProto = Object.getPrototypeOf(currentProto);
  }

  return properties;
}

export function setElementAttributeByPath(path: number[], name: string, value: string): boolean {
  if (!path || path.length === 0) return false;
  
  let current: Node = document;
  for (const index of path) {
    if (index === -1) {
      if (current instanceof Element && current.shadowRoot) {
        current = current.shadowRoot;
      } else {
        return false;
      }
    } else {
      if (current && current.childNodes && current.childNodes[index]) {
        current = current.childNodes[index];
      } else {
        return false;
      }
    }
  }

  if (!(current instanceof Element)) return false;
  current.setAttribute(name, value);
  return true;
}

export function setElementPropertyByPath(path: number[], name: string, value: any): boolean {
  if (!path || path.length === 0) return false;
  
  let current: Node = document;
  for (const index of path) {
    if (index === -1) {
      if (current instanceof Element && current.shadowRoot) {
        current = current.shadowRoot;
      } else {
        return false;
      }
    } else {
      if (current && current.childNodes && current.childNodes[index]) {
        current = current.childNodes[index];
      } else {
        return false;
      }
    }
  }

  if (!(current instanceof Element)) return false;
  
  // Try to parse value if it's a string representing a basic type
  let parsedValue = value;
  if (typeof value === 'string') {
    if (value === 'true') parsedValue = true;
    else if (value === 'false') parsedValue = false;
    else if (!isNaN(Number(value)) && value.trim() !== '') parsedValue = Number(value);
  }

  (current as any)[name] = parsedValue;
  return true;
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

export function highlightElementByPath(path: number[]): boolean {
  if (!path || path.length === 0) return false;
  
  let current: Node = document;
  for (const index of path) {
    if (index === -1) {
      if (current instanceof Element && current.shadowRoot) {
        current = current.shadowRoot;
      } else {
        return false;
      }
    } else {
      if (current && current.childNodes && current.childNodes[index]) {
        current = current.childNodes[index];
      } else {
        return false;
      }
    }
  }

  if (!(current instanceof Element)) return false;

  const rect = current.getBoundingClientRect();
  
  let overlay = document.getElementById('go-wasm-devtools-highlight-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'go-wasm-devtools-highlight-overlay';
    overlay.style.position = 'absolute';
    overlay.style.pointerEvents = 'none';
    overlay.style.zIndex = '10000000';
    overlay.style.backgroundColor = 'rgba(135, 206, 250, 0.35)'; // light blue transparent background
    overlay.style.border = '2px solid rgba(30, 144, 255, 0.7)'; // slightly stronger border
    overlay.style.boxSizing = 'border-box';
    overlay.style.transition = 'all 0.08s ease-out'; // smooth transition between elements
    document.body.appendChild(overlay);
  }

  overlay.style.left = `${rect.left + window.scrollX}px`;
  overlay.style.top = `${rect.top + window.scrollY}px`;
  overlay.style.width = `${rect.width}px`;
  overlay.style.height = `${rect.height}px`;
  overlay.style.display = 'block';

  return true;
}

export function clearElementHighlight(): boolean {
  const overlay = document.getElementById('go-wasm-devtools-highlight-overlay');
  if (overlay) {
    overlay.style.display = 'none';
  }
  return true;
}
