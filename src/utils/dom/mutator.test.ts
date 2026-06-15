import { describe, it, expect, beforeEach } from 'vitest';
import { setElementAttributeByPath, setElementPropertyByPath } from './mutator';

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

describe('mutator utils', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('should set element attribute by path', () => {
    const div = document.createElement('div');
    const span = document.createElement('span');
    span.setAttribute('class', 'old-class');
    div.appendChild(span);
    document.body.appendChild(div);

    const path = getPath(span);

    const success = setElementAttributeByPath(path, 'class', 'new-class');
    expect(success).toBe(true);
    expect(span.getAttribute('class')).toBe('new-class');
  });

  it('should set element property by path and parse basic types', () => {
    const div = document.createElement('div');
    const target = document.createElement('div') as any;
    div.appendChild(target);
    document.body.appendChild(div);

    const path = getPath(target);

    // Test string property
    let success = setElementPropertyByPath(path, 'customProp', 'hello');
    expect(success).toBe(true);
    expect(target.customProp).toBe('hello');

    // Test boolean parsing
    success = setElementPropertyByPath(path, 'customBool', 'true');
    expect(success).toBe(true);
    expect(target.customBool).toBe(true);

    // Test number parsing
    success = setElementPropertyByPath(path, 'customNum', '42');
    expect(success).toBe(true);
    expect(target.customNum).toBe(42);
  });
});
