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
import './App.css';

import StartBotNode from './components/nodes/StartBotNode';
import DefaultNode from './components/nodes/DefaultNode';
import StartBotEditor from './components/editors/StartBotEditor';
import DefaultNodeEditor from './components/editors/DefaultNodeEditor';
import Toolbar from './components/nodes/Toolbar';




let id = 1;
const getId = () => `node_${id++}`;

const initialNodes = [
  {
    id: 'start',
    type: 'startBot',
    data: {}, // will inject openEditor later
    position: { x: 250, y: 50 },
  },
];


function App() {
  const [savedStartBotData, setSavedStartBotData] = useState(null);
  const [nodeContentMap, setNodeContentMap] = useState({});
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [showStartEditor, setShowStartEditor] = useState(false);
  const [selectedDefaultNode, setSelectedDefaultNode] = useState(null);

const nodeTypes = useMemo(() => ({
  startBot: StartBotNode,
  defaultNode: (nodeProps) => (
    <DefaultNode {...nodeProps} nodeContentMap={nodeContentMap} />
  ),
}), [nodeContentMap]);


  useEffect(() => {
    setNodes((nds) =>
      nds.map((node) =>
        node.type === 'startBot'
          ? { ...node, data: { ...node.data, savedData: savedStartBotData, openEditor: openStartBotEditor } }
          : node
      )
    );
  }, [savedStartBotData]);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      const nodeType = event.dataTransfer.getData('application/reactflow');
      const position = { x: event.clientX - 250, y: event.clientY - 100 };

      const newNode = {
        id: getId(),
        type: 'defaultNode',
        position,
        data: { type: nodeType },
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


//   const updateNode = (nodeId) => {
//   setNodes((nds) =>
//     nds.map((node) =>
//       node.id === nodeId
//         ? { ...node, data: { ...node.data, updatedAt: Date.now() } } // add a dummy timestamp
//         : node
//     )
//   );
// };


  // 🔥 Inject the open editor function into StartBotNode's data
  const updatedNodes = nodes.map((node) =>
    node.type === 'startBot'
      ? { ...node, data: { ...node.data, openEditor: openStartBotEditor } }
      : node
  );

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Toolbar />
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
      <StartBotEditor isOpen={showStartEditor} onClose={closeStartBotEditor} savedData={savedStartBotData} setSavedData={setSavedStartBotData} />
      <DefaultNodeEditor node={selectedDefaultNode} onClose={closeDefaultNodeEditor}  nodeContentMap={nodeContentMap} setNodeContentMap={setNodeContentMap} />
    </div>
  );
}

export default App;
