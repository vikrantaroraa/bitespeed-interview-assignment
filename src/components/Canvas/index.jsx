import { useState } from "react";
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
  getConnectedEdges,
} from "reactflow";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "reactflow/dist/style.css";
import MessageNode from "../../nodes/MessageNode";
import { nanoid } from "nanoid";
import Sidebar from "../Sidebar";

// we define the nodeTypes outside of the component to prevent re-renderings
// you could also use useMemo inside the component
const nodeTypes = {
  messageNode: MessageNode,
};

const flowKey = "message-flow";

const Flow = () => {
  const [isANodeSelected, setIsANodeSelected] = useState(false);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNodeLabel, setSelectedNodeLabel] = useState("");
  const [selectedNodeId, setSelectedNodeId] = useState("");

  const reactFlowInstance = useReactFlow();
  const { setViewport } = reactFlowInstance;

  const notifyErrorSavingFlow = () =>
    toast.error(
      "you have more than 2 nodes on the canvas and more than 1 node have empty target handles",
      {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      }
    );

  const onSave = useCallback(() => {
    const connectedEdges = getConnectedEdges(nodes, edges);
    const allTargetsArray = connectedEdges.map((edge) => edge.target);
    const allUniqueTargetsSet = new Set(allTargetsArray);
    console.log(allUniqueTargetsSet);
    // checking the required condition as described in job description gdrive document
    if (nodes.length > 2 && allUniqueTargetsSet.size != nodes.length - 1) {
      notifyErrorSavingFlow();
      return;
    }
    if (reactFlowInstance) {
      const flow = reactFlowInstance.toObject();
      localStorage.setItem(flowKey, JSON.stringify(flow));
    }
  }, [reactFlowInstance, nodes, edges]);

  // restore the saved flow
  const onRestore = useCallback(() => {
    const restoreFlow = async () => {
      const flow = JSON.parse(localStorage.getItem(flowKey));
      if (flow) {
        const { x = 0, y = 0, zoom = 1 } = flow.viewport;
        setNodes(flow.nodes || []);
        setEdges(flow.edges || []);
        setViewport({ x, y, zoom });
      }
    };

    restoreFlow();
  }, [setNodes, setViewport, setEdges]);

  // called when an edge is connected
  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  // called when a node is dragged over the canvas
  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  // called when a node is dropped on the canvas
  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const type = event.dataTransfer.getData("application/reactflow");

      // check if the dropped element is valid
      if (typeof type === "undefined" || !type) {
        return;
      }

      // reactFlowInstance.project was renamed to reactFlowInstance.screenToFlowPosition
      // and you don't need to subtract the reactFlowBounds.left/top anymore
      // details: https://reactflow.dev/whats-new/2023-11-10
      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      const nodeId = nanoid();
      const newNode = {
        id: nodeId,
        type,
        position,
        data: { label: `Node ${nodeId}` },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, setNodes]
  );

  const openUpdateNodeForm = (e, object) => {
    console.log(object); // object gives all the data about the selected node
    setIsANodeSelected(true);
    setSelectedNodeLabel(object.data.label);
    setSelectedNodeId(object.id);
  };

  const updateSelectedNodeLabel = () => {
    setNodes(
      nodes.map((node) => {
        return node.id === selectedNodeId
          ? { ...node, data: { label: selectedNodeLabel } }
          : node;
      })
    );
    // after updating the node label, setting below state to false will take back to nodes panel
    setIsANodeSelected(false);
  };

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
            onDrop={onDrop}
            onDragOver={onDragOver}
            onNodeClick={(e, object) => openUpdateNodeForm(e, object)}
            // fitView
          >
            <Controls />
            <MiniMap />
            <Background variant="dots" gap={12} size={1} />
          </ReactFlow>
        </div>
        <div className={styles["controls-container"]}>
          <Sidebar
            isANodeSelected={isANodeSelected}
            selectedNodeLabel={selectedNodeLabel}
            setSelectedNodeLabel={setSelectedNodeLabel}
            updateSelectedNodeLabel={updateSelectedNodeLabel}
            setIsANodeSelected={setIsANodeSelected}
          />
        </div>
        <ToastContainer />
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
