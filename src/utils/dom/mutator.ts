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
