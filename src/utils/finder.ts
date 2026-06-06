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
