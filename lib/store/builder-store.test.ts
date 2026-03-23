import { describe, it, expect, beforeEach } from 'vitest';
import { useBuilderStore } from './builder-store';

describe('useBuilderStore', () => {

  beforeEach(() => {
    // Reset store to initial state
    const { clearCanvas, setNodes } = useBuilderStore.getState();
    clearCanvas(); // clears variables and everything
    setNodes([
          {
            id: "root",
            type: "Root",
            props: { className: "flex flex-col" },
            children: []
          }
    ]);
  });

  it('should have a root node at initial state', () => {
    const { nodes } = useBuilderStore.getState();
    expect(nodes).toHaveLength(1);
    expect(nodes[0].type).toBe('Root');
  });

  it('should add a node inside root container', () => {
    const { addNode } = useBuilderStore.getState();
    const newNode = { id: 'node1', type: 'Heading' as const, props: { text: "Hello" }, children: [] };
    
    // Add to root (default parent)
    addNode(newNode);

    const { nodes } = useBuilderStore.getState();
    const root = nodes[0];
    
    expect(root.children).toHaveLength(1);
    expect(root.children[0].id).toBe('node1');
  });

  it('should update node properties', () => {
    const { addNode, updateNodeProps } = useBuilderStore.getState();
    const newNode = { id: 'node2', type: 'Text' as const, props: { text: "Initial" }, children: [] };
    
    addNode(newNode);
    updateNodeProps('node2', { text: 'Updated Text' });

    const { nodes } = useBuilderStore.getState();
    const root = nodes[0];
    const nodeFromStore = root.children[0];
    
    expect(nodeFromStore.props.text).toBe('Updated Text');
  });

  it('should undo the node addition action history', () => {
    const { addNode, undo } = useBuilderStore.getState();
    const newNode = { id: 'node3', type: 'Button' as const, props: { label: "Click" }, children: [] };
    
    addNode(newNode);
    const { nodes } = useBuilderStore.getState();
    expect(nodes[0].children).toHaveLength(1); // 1 node added

    // Undo action
    undo();
    
    // Fetch refreshed memory
    const { nodes: stateAfterUndo } = useBuilderStore.getState();
    expect(stateAfterUndo[0].children).toHaveLength(0); // should be back to 0 items
  });

});
