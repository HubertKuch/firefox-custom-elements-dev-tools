import { describe, it, expect, beforeEach } from 'vitest';
import { useUIStore } from './useUIStore';
import { VirtualHtmlNode } from '@types/node';

describe('useUIStore setRootNode', () => {
  beforeEach(() => {
    // Reset state before each test
    const { setCurrentElement, setRootNode } = useUIStore.getState();
    setCurrentElement(null);
    setRootNode(null);
  });

  it('should set the rootNode state', () => {
    const node: VirtualHtmlNode = { tagName: 'my-element', path: [0] };
    useUIStore.getState().setRootNode(node);
    expect(useUIStore.getState().rootNode).toBe(node);
  });

  it('should update currentElement reference to the new node at the same path', () => {
    const oldNode1: VirtualHtmlNode = { tagName: 'my-child-1', path: [0, 0] };
    const oldNode2: VirtualHtmlNode = { tagName: 'my-child-2', path: [0, 1] };
    const oldRoot: VirtualHtmlNode = {
      tagName: 'my-root',
      path: [0],
      children: [oldNode1, oldNode2]
    };

    const { setCurrentElement, setRootNode } = useUIStore.getState();
    setRootNode(oldRoot);
    setCurrentElement(oldNode2);

    const newNode1: VirtualHtmlNode = { tagName: 'my-child-1', path: [0, 0] };
    const newNode2: VirtualHtmlNode = { tagName: 'my-child-2', path: [0, 1], attributes: { 'updated': 'true' } };
    const newRoot: VirtualHtmlNode = {
      tagName: 'my-root',
      path: [0],
      children: [newNode1, newNode2]
    };

    setRootNode(newRoot);

    // currentElement should be updated to newNode2
    const current = useUIStore.getState().currentElement;
    expect(current).toBe(newNode2);
    expect(current?.attributes?.updated).toBe('true');
  });

  it('should set currentElement to null if the path is no longer present in the new tree', () => {
    const oldNode1: VirtualHtmlNode = { tagName: 'my-child-1', path: [0, 0] };
    const oldRoot: VirtualHtmlNode = {
      tagName: 'my-root',
      path: [0],
      children: [oldNode1]
    };

    const { setCurrentElement, setRootNode } = useUIStore.getState();
    setRootNode(oldRoot);
    setCurrentElement(oldNode1);

    const newRoot: VirtualHtmlNode = {
      tagName: 'my-root',
      path: [0],
      children: [] // oldNode1 was removed
    };

    setRootNode(newRoot);

    expect(useUIStore.getState().currentElement).toBeNull();
  });

  it('should update currentElement if it was the root node with tagName "root"', () => {
    const oldRoot: VirtualHtmlNode = {
      tagName: 'root',
      children: [{ tagName: 'my-element', path: [0] }]
    };

    const { setCurrentElement, setRootNode } = useUIStore.getState();
    setRootNode(oldRoot);
    setCurrentElement(oldRoot);

    const newRoot: VirtualHtmlNode = {
      tagName: 'root',
      children: [{ tagName: 'my-element', path: [0] }]
    };

    setRootNode(newRoot);

    expect(useUIStore.getState().currentElement).toBe(newRoot);
  });
});
