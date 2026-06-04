export function findCustomElements(root = document.body, result = []) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT);
  let node = walker.nextNode();

  while (node) {
    const tagName = node.tagName.toLowerCase();

    if (tagName.includes('-')) {
      result.push(node);
    }

    if (node.shadowRoot) {
      findCustomElements(node.shadowRoot, result);
    }

    node = walker.nextNode();
  }

  return result;
}

