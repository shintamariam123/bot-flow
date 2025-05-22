import React, { useCallback, useState, useEffect, useMemo } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import StartBotNode from './StartBotNode';
import DefaultNode from './DefaultNode';
import StartBotEditor from '../editors/StartBotEditor';
import DefaultNodeEditor from '../editors/DefaultNodeEditor';
import Toolbar from './Toolbar';
import { useNavigate } from 'react-router-dom';
import InteractiveNode from './InteractiveNode';
import InteractiveNodeEditor from '../editors/InteractiveNodeEditor';

let id = 1;
const getId = () => `node_${id++}`;

const initialNodes = [
  {
    id: 'start',
    type: 'startBot',
    data: {},
    position: { x: 250, y: 50 },
  },
];

function FlowBuilder() {
  const [savedStartBotData, setSavedStartBotData] = useState(null);
  const [nodeContentMap, setNodeContentMap] = useState({});
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [showStartEditor, setShowStartEditor] = useState(false);
  const [selectedDefaultNode, setSelectedDefaultNode] = useState(null);

  // interactive editor
  const [showInteractiveEditor, setShowInteractiveEditor] = useState(false);
  const [activeInteractiveNodeId, setActiveInteractiveNodeId] = useState(null);
  // const [interactiveContent, setInteractiveContent] = useState({});


  // Function to save updated content for interactive nodes in the shared nodeContentMap state
  const handleSaveInteractiveContent = (nodeId, content) => {
    setNodeContentMap(prev => ({
      ...prev,
      [nodeId]: content,
    }));
  };


  const handleEditInteractiveNode = (id) => {
    setActiveInteractiveNodeId(id);
    setShowInteractiveEditor(true);
  };

  const navigate = useNavigate();

  const spawnConnectedNode = useCallback((sourceNodeId, sourceHandle, type) => {
    const newNodeId = getId();
    const newNode = {
      id: newNodeId,
      type: 'defaultNode',
      position: { x: Math.random() * 200 + 100, y: Math.random() * 200 + 100 }, // random position for now
      data: {
        label: `${type.charAt(0).toUpperCase() + type.slice(1)} Node`,
        type,
      },
    };

    const newEdge = {
      id: `e-${sourceNodeId}-${newNodeId}`,
      source: sourceNodeId,
      sourceHandle,
      target: newNodeId,
      type: 'smoothstep',
    };

    setNodes((nds) => [...nds, newNode]);
    setEdges((eds) => [...eds, newEdge]);
  }, [setNodes, setEdges]);


  // Register node types, including interactiveNode
  const nodeTypes = useMemo(() => ({
    startBot: StartBotNode,
    defaultNode: (nodeProps) => (
      <DefaultNode
        {...nodeProps}
        nodeContentMap={nodeContentMap}
        onRemoveNode={onRemoveNode}
      />
    ),
    interactiveNode: (nodeProps) => (
      <InteractiveNode
        {...nodeProps}
        nodeContentMap={nodeContentMap}
        onRemoveNode={onRemoveNode}
        data={{
          ...nodeProps.data,
          onEditInteractiveNode: handleEditInteractiveNode,
          spawnConnectedNode: spawnConnectedNode, // ✅ pass it here
        }}
      />
    ),
  }), [nodeContentMap, spawnConnectedNode]);



  const onRemoveNode = (nodeId) => {
    setNodes((nds) => nds.filter((node) => node.id !== nodeId));
    setEdges((eds) => eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId));


    setNodeContentMap((prev) => {
      const updated = { ...prev };
      delete updated[nodeId];
      return updated;
    });
  };



  useEffect(() => {
    setNodes((nds) =>
      nds.map((node) =>
        node.type === 'startBot'
          ? { ...node, data: { ...node.data, savedData: savedStartBotData, openEditor: openStartBotEditor } }
          : node
      )
    );
  }, [savedStartBotData, setNodes]);

  // Handle connections: spawn new defaultNode if from interactiveNode's handle
  const onConnect = useCallback(
    (params) => {
      const { source, sourceHandle } = params;
      if (sourceHandle) {
        const newNode = {
          id: getId(),
          type: 'defaultNode',
          position: { x: Math.random() * 400 + 100, y: Math.random() * 300 + 100 },
          data: { type: sourceHandle },
        };
        setNodes((nds) => nds.concat(newNode));
        setEdges((eds) => addEdge({ ...params, target: newNode.id }, eds));
      } else {
        setEdges((eds) => addEdge(params, eds));
      }
    },
    [setNodes, setEdges]
  );

  // Drop new nodes: parse JSON from Toolbar drag
  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      const data = event.dataTransfer.getData('application/reactflow');
      let nodeType = 'defaultNode';
      let contentType = '';
      try {
        const parsed = JSON.parse(data);
        nodeType = parsed.nodeType;
        contentType = parsed.contentType;
      } catch {
        contentType = data;
      }
      const position = { x: event.clientX - 250, y: event.clientY - 100 };

      const newNode = {
        id: getId(),
        type: nodeType,
        position,
        data: { type: contentType },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [setNodes]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);


  const openStartBotEditor = () => setShowStartEditor(true);
  const closeStartBotEditor = () => setShowStartEditor(false);

  const onDefaultNodeClick = (_event, node) => {
    if (node.type === 'defaultNode') {
      setSelectedDefaultNode(node);
    }
  };
  const closeDefaultNodeEditor = () => setSelectedDefaultNode(null);

  const updatedNodes = nodes.map((node) =>
    node.type === 'startBot'
      ? { ...node, data: { ...node.data, openEditor: openStartBotEditor } }
      : node
  );

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Toolbar
        nodes={nodes}
        edges={edges}
        nodeContentMap={nodeContentMap}
        savedStartBotData={savedStartBotData}
        setNodes={setNodes}
        setEdges={setEdges}
        setNodeContentMap={setNodeContentMap}
        setSavedStartBotData={setSavedStartBotData}
        onDashboardClick={() => navigate('/dashboard')} // Pass navigate fn
      />
      <div style={{ width: '100%', height: '90%' }}>
        <ReactFlow
          nodes={updatedNodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onNodeClick={onDefaultNodeClick}
          nodeTypes={nodeTypes}
          fitView
        >
          <MiniMap />
          <Controls />
          <Background />
        </ReactFlow>
      </div>

      {/* Offcanvas editors */}
      <StartBotEditor
        isOpen={showStartEditor}
        onClose={closeStartBotEditor}
        savedData={savedStartBotData}
        setSavedData={setSavedStartBotData}
      />
      <DefaultNodeEditor
        node={selectedDefaultNode}
        onClose={closeDefaultNodeEditor}
        nodeContentMap={nodeContentMap}
        setNodeContentMap={setNodeContentMap}
        onRemoveNode={onRemoveNode}
      />
      <InteractiveNodeEditor
        show={showInteractiveEditor}
        onClose={() => setShowInteractiveEditor(false)}
        nodeId={activeInteractiveNodeId}
        content={nodeContentMap[activeInteractiveNodeId] || {}}
        onSave={handleSaveInteractiveContent}
      />

    </div>
  );
}

export default FlowBuilder;
