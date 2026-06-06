import { describe, it, expect, beforeEach } from 'vitest';
import { findCustomElements } from './finder';

describe('findCustomElements', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('should find custom elements in the document body', () => {
    document.body.innerHTML = `
      <div>
        <custom-el-1></custom-el-1>
        <span>
          <custom-el-2></custom-el-2>
        </span>
      </div>
    `;

    const elements = findCustomElements();
    expect(elements.length).toBe(2);
    expect(elements[0].tagName.toLowerCase()).toBe('custom-el-1');
    expect(elements[1].tagName.toLowerCase()).toBe('custom-el-2');
  });

  it('should find custom elements inside shadow DOM', () => {
    document.body.innerHTML = `
      <div>
        <div id="host"></div>
      </div>
    `;
    const host = document.getElementById('host')!;
    const shadowRoot = host.attachShadow({ mode: 'open' });
    shadowRoot.innerHTML = `
      <shadow-custom-el></shadow-custom-el>
    `;

    const elements = findCustomElements();
    expect(elements.length).toBe(1);
    expect(elements[0].tagName.toLowerCase()).toBe('shadow-custom-el');
  });
});
