// frontend/src/ui.js
import { useState, useRef, useCallback, useMemo } from 'react';
import ReactFlow, { Controls, Background, MiniMap } from 'reactflow';
import { useStore } from './store';
import { shallow } from 'zustand/shallow';
import ButtonEdge from './ButtonEdge'; 

import { InputNode } from './nodes/inputNode';
import { LLMNode } from './nodes/llmNode';
import { OutputNode } from './nodes/outputNode';
import { TextNode } from './nodes/textNode';
import { TimerNode, SlackNode, DatabaseNode, APINode, NoteNode } from './nodes/integrationNodes';

import 'reactflow/dist/style.css';

const gridSize = 20;
const proOptions = { hideAttribution: true };

const nodeTypes = {
  customInput: InputNode,
  llm: LLMNode,
  customOutput: OutputNode,
  text: TextNode,
  timer: TimerNode,
  slack: SlackNode,
  database: DatabaseNode,
  api: APINode,
  note: NoteNode
};

const edgeTypes = {
  customEdge: ButtonEdge,
};

const selector = (state) => ({
  nodes: state.nodes,
  edges: state.edges,
  getNodeID: state.getNodeID,
  addNode: state.addNode,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
  activeEdges: state.activeEdges,
});

export const PipelineUI = () => {
    const reactFlowWrapper = useRef(null);
    const [reactFlowInstance, setReactFlowInstance] = useState(null);
    const {
      nodes,
      edges,
      getNodeID,
      addNode,
      onNodesChange,
      onEdgesChange,
      onConnect,
      activeEdges // Get the active list
    } = useStore(selector, shallow);

    const getInitNodeData = (nodeID, type) => {
      let nodeData = { id: nodeID, nodeType: `${type}` };
      return nodeData;
    }

    const onDrop = useCallback(
        (event) => {
          event.preventDefault();
          const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
          if (event?.dataTransfer?.getData('application/reactflow')) {
            const appData = JSON.parse(event.dataTransfer.getData('application/reactflow'));
            const type = appData?.nodeType;
            if (typeof type === 'undefined' || !type) return;
      
            const position = reactFlowInstance.project({
              x: event.clientX - reactFlowBounds.left,
              y: event.clientY - reactFlowBounds.top,
            });

            const nodeID = getNodeID(type);
            const newNode = {
              id: nodeID,
              type,
              position,
              data: getInitNodeData(nodeID, type),
            };
            addNode(newNode);
          }
        },
        [reactFlowInstance, getNodeID, addNode]
    );

    const onDragOver = useCallback((event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    // SEQUENTIAL ANIMATION LOGIC
    const displayEdges = useMemo(() => {
        return edges.map(edge => {
            const isLit = activeEdges.includes(edge.id);
            return {
                ...edge,
                animated: isLit || edge.animated, // Keep animated if already set, or if lit
                style: { 
                    ...edge.style, 
                    stroke: isLit ? 'var(--primary-color)' : '#b1b1b7', // Purple if lit, Gray if not
                    strokeWidth: isLit ? 3 : 2,
                    opacity: isLit ? 1 : 0.5, // Dim inactive edges slightly for dramatic effect
                    transition: 'all 0.3s ease' // Smooth transition
                },
                className: isLit ? 'running-flow' : ''
            };
        });
    }, [edges, activeEdges]);

    return (
        <div ref={reactFlowWrapper} style={{ width: '100%', height: '100%' }}> 
            <ReactFlow
                nodes={nodes}
                edges={displayEdges} 
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onDrop={onDrop}
                onDragOver={onDragOver}
                onInit={setReactFlowInstance}
                nodeTypes={nodeTypes}
                edgeTypes={edgeTypes} 
                proOptions={proOptions}
                snapGrid={[gridSize, gridSize]}
                connectionLineType='smoothstep'
                deleteKeyCode={["Backspace", "Delete"]}
            >
                <Background color="#aaa" gap={gridSize} />
                <Controls />
                <MiniMap 
                    style={{ height: 100, width: 150, left: 40, bottom: 10 }} 
                    zoomable pannable 
                />
            </ReactFlow>
        </div>
    )
}