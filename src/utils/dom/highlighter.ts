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
