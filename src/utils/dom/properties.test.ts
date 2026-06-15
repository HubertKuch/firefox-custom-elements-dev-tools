import { describe, it, expect, beforeEach } from 'vitest';
import { getElementPropertiesByPath } from './properties';

function getPath(el: Element): number[] {
  const path: number[] = [];
  let current: Node | null = el;
  while (current && current !== document) {
    const parent = current.parentNode;
    if (parent) {
      const index = Array.prototype.indexOf.call(parent.childNodes, current);
      path.unshift(index);
      current = parent;
    } else {
      break;
    }
  }
  return path;
}

describe('dom properties utils', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('should get properties by path from HTMLElement', () => {
    class TestElement extends HTMLElement {
      get testProp() { return 'val'; }
    }
    
    if (!customElements.get('test-element-props')) {
      customElements.define('test-element-props', TestElement);
    }

    const div = document.createElement('div');
    const el = document.createElement('test-element-props');
    div.appendChild(el);
    document.body.appendChild(div);

    const path = getPath(el);

    const props = getElementPropertiesByPath(path);
    expect(props).toHaveProperty('testProp');
    expect(props.testProp).toBe('val');
  });
});
