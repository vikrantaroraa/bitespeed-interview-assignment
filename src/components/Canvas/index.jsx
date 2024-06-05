import React from "react";
import styles from "./index.module.css";
import { useCallback } from "react";
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  useReactFlow,
  ReactFlowProvider,
} from "reactflow";

import "reactflow/dist/style.css";
import MessageNode from "../../nodes/MessageNode";

// we define the nodeTypes outside of the component to prevent re-renderings
// you could also use useMemo inside the component
const nodeTypes = {
  messageNode1: MessageNode,
};

// const initialNodes = [
//   { id: "1", position: { x: 0, y: 0 }, data: { label: "1" } },
//   { id: "2", position: { x: 0, y: 100 }, data: { label: "2" } },
// ];
const initialNodes = [
  {
    id: "message-node-1",
    type: "messageNode1",
    position: { x: 10, y: 10 },
    data: { label: "Message text" },
  },
];
const initialEdges = [{ id: "e1-2", source: "1", target: "2" }];

const flowKey = "message-flow";

const Flow = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const reactFlowInstance = useReactFlow();
  const { setViewport } = reactFlowInstance;

  const onSave = useCallback(() => {
    console.log(reactFlowInstance);
    if (reactFlowInstance) {
      const flow = reactFlowInstance.toObject();
      // console.log("flow saved: ", flow);
      // console.log("typeof flow saved: ", typeof flow);
      // console.log("flow nodes saved: ", flow.nodes);
      // console.log("typeof flow.nodes saved: ", typeof flow.nodes);
      localStorage.setItem(flowKey, JSON.stringify(flow));
    }
  }, [reactFlowInstance]);

  const onRestore = useCallback(() => {
    const restoreFlow = async () => {
      // console.log("restore fn running");
      const flow = JSON.parse(localStorage.getItem(flowKey));
      // console.log("typeof flow: ", typeof flow);
      // console.log("typeof flow.nodes: ", typeof flow.nodes);
      // console.log("flow nodes restored: ", flow.nodes);

      if (flow) {
        const { x = 0, y = 0, zoom = 1 } = flow.viewport;
        setNodes(flow.nodes || []);
        setEdges(flow.edges || []);
        setViewport({ x, y, zoom });
      }
    };

    restoreFlow();
  }, [setNodes, setViewport, setEdges]);

  const getNodeId = () => `randomnode_${+new Date()}`;

  const addSimpleNode = useCallback(() => {
    let newNodeId = getNodeId();
    const newNode = {
      id: newNodeId,
      data: {
        label: `Node ${newNodeId}`,
      },
      position: {
        x: Math.random() * window.innerWidth - 100,
        y: Math.random() * window.innerHeight,
      },
    };
    setNodes((nds) => nds.concat(newNode));
  }, [setNodes]);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );
  return (
    <div className={styles["main-container"]}>
      <div className={styles["save-button-container"]}>
        <button onClick={onSave}>Save Changes</button>
        <button onClick={onRestore}>Restore Flow</button>
      </div>
      <div className={styles["canvas-and-controls-container"]}>
        <div className={styles["flow-container"]}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            // fitView
          >
            <Controls />
            <MiniMap />
            <Background variant="dots" gap={12} size={1} />
          </ReactFlow>
        </div>
        <div className="controls">
          Controls
          <button onClick={addSimpleNode}>Add Node</button>
        </div>
      </div>
    </div>
  );
};

const Canvas = () => {
  return (
    <ReactFlowProvider>
      <Flow />
    </ReactFlowProvider>
  );
};

export default Canvas;
