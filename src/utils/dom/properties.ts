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
