import React, { useCallback, useState, useEffect, useMemo } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge, ReactFlowProvider
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
import ButtonNode from './ButtonNode';
import ButtonEditor from '../editors/ButtonEditor';
import ListNode from './ListNode';
import ListEditor from '../editors/ListEditor';
import EcommerceNode from './EcommerceNode';
import EcommerceEditor from '../editors/EcommerceEditor';
import SequenceNode from './SequenceNode';
import SequenceEditor from '../editors/SequenceEditor';
import SendMessageAfterNode from './SendMessageAfterNode';
import SendMessageAfterEditor from '../editors/SendMessageAfterEditor';




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


  const [selectedNode, setSelectedNode] = useState(null);
  const [editorType, setEditorType] = useState(null);

  const [selectedSequenceNode, setSelectedSequenceNode] = useState(null);
  const [selectedSendMessageNode, setSelectedSendMessageNode] = useState(null);


  const onNodeClick = (_event, node) => {
    switch (node.type) {
      case 'defaultNode':
        setSelectedDefaultNode(node);
        break;
      case 'buttonNode':
        setSelectedNode(node);
        setEditorType('buttonNode');
        break;
      case 'interactiveNode':
      case 'button':
      case 'list':
      case 'ecommerce':
        handleEditInteractiveNode(node.id);
        break;
      case 'startBot':
        setShowStartEditor(true);
        break;
      case 'sequenceNode':
        setSelectedSequenceNode(node);
        break;
      case 'sendMessageAfterNode':
        setSelectedSendMessageNode(node);
        break;
      default:
        break;
    }
  };




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
    const nodeTypeMap = {
      button: 'buttonNode',
      list: 'listNode',
      ecommerce: 'ecommerceNode',
    };
    const newNode = {
      id: newNodeId,
      type: nodeTypeMap[type] || 'defaultNode',
      position: { x: Math.random() * 200 + 100, y: Math.random() * 200 + 100 },
      data: {
        label: `${type.charAt(0).toUpperCase() + type.slice(1)} Node`,
        type,
        ...nodeContentMap[newNodeId] || {}, // ✅ this passes only the node-specific content
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


  const handleSaveButtonContent = (id, content) => {
    console.log('Saving content for ButtonNode:', id, content);

    setNodeContentMap(prev => ({
      ...prev,
      [id]: content,
    }));

    setNodes((nds) =>
      nds.map((node) =>
        node.id === id
          ? {
            ...node,
            data: {
              ...node.data,
              // just triggering a data change
              updateTrigger: new Date().toISOString(),
            },
          }
          : node
      )
    );
  };



  // Register node types, including interactiveNode
  const nodeTypes = useMemo(() => ({
    startBot: StartBotNode,
    defaultNode: (nodeProps) => (
      <DefaultNode
        {...nodeProps}
        nodeContentMap={nodeContentMap}
        onRemoveNode={onRemoveNode}
        onClose={closeDefaultNodeEditor}
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
          onClose: { setShowInteractiveEditor },
          spawnConnectedNode: spawnConnectedNode, // ✅ pass it here
        }}
      />
    ),
    buttonNode: (nodeProps) => (
      <ButtonNode
        {...nodeProps}
        nodeContentMap={nodeContentMap}
        onRemoveNode={onRemoveNode}
        onEditButtonNode={(id) => {
          setSelectedNode(nodes.find(n => n.id === id));
          setEditorType('buttonNode');
        }} />
    ),
    listNode: (nodeProps) => (
      <ListNode
        {...nodeProps}
        onRemoveNode={onRemoveNode}
        onEditListNode={(id) => {
          setSelectedNode(nodeProps);  // Save the selected node
          setEditorType('listNode'); // Set the editor type
        }} />
    ),
    ecommerceNode: (nodeProps) => (
      <EcommerceNode
        {...nodeProps}
        onRemoveNode={onRemoveNode}
        onEditEcommerceNode={(id) => {
          setSelectedNode(nodeProps);  // Save the selected node
          setEditorType('ecommerceNode'); // Set the editor type
        }} />
    ),

    sequenceNode: (nodeProps) => (
      <SequenceNode
        {...nodeProps}
        nodeContentMap={nodeContentMap}
        onRemoveNode={onRemoveNode}
        onEditSequenceNode={() => setSelectedSequenceNode(nodeProps)}

      />
    ),
    sendMessageAfterNode: (nodeProps) => (
      <SendMessageAfterNode
        {...nodeProps}
        nodeContentMap={nodeContentMap}
        onRemoveNode={onRemoveNode}
        onEditSendMessageNode={() => setSelectedSendMessageNode(nodeProps)}
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
      setEdges((eds) => addEdge(params, eds));
    },
    [setEdges]
  );

  // Drop new nodes: parse JSON from Toolbar drag
  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      const data = event.dataTransfer.getData('application/reactflow');
      console.log('FlowBuilder: onDrop received data:', data); // New log

      let nodeType = 'defaultNode';
      let contentType = '';
      try {
        const parsed = JSON.parse(data);
        nodeType = parsed.nodeType;
        contentType = parsed.contentType;
      } catch (e) {
        console.error('FlowBuilder: Error parsing dataTransfer data:', e); // Log parsing error
        contentType = data; // Fallback
      }
      console.log('FlowBuilder: Parsed nodeType:', nodeType, 'contentType:', contentType);

      const position = { x: event.clientX - 250, y: event.clientY - 100 };

      // Use interactiveNode if it's one of the interactive subtypes
      if (['button', 'list', 'ecommerce'].includes(contentType.toLowerCase())) { // Ensure case-insensitivity here
        nodeType = `${contentType.toLowerCase()}Node`;
      }

      const newNodeId = getId();

      // Special handling for SequenceNode: automatically connect 3 SendMessageAfterNodes
      if (nodeType === 'sequenceNode') {
        console.log('FlowBuilder: Dropping Sequence Node logic triggered.'); // Log 3
        const sequenceNode = {
          id: newNodeId,
          type: 'sequenceNode',
          position,
          data: {
            label: 'Sequence Node',
            ...nodeContentMap[newNodeId] || {},
          },
        };

        const newNodes = [sequenceNode];
        const newEdges = [];

        // Create 3 SendMessageAfterNodes and connect them
        for (let i = 0; i < 3; i++) {
          const sendMessageNodeId = getId();
          const sendMessageNodePosition = {
            x: position.x + 300, // Position to the right of the sequence node
            y: position.y + (i * 100) - 50, // Stack vertically
          };
          const sendMessageNode = {
            id: sendMessageNodeId,
            type: 'sendMessageAfterNode',
            position: sendMessageNodePosition,
            data: {
              label: `Send Message After ${i + 1}`,
              ...nodeContentMap[sendMessageNodeId] || {},
            },
          };
          newNodes.push(sendMessageNode);

          // Connect SequenceNode's source handle to SendMessageAfterNode's target handle
          newEdges.push({
            id: `e-${newNodeId}-schedule-sequence-msg-${sendMessageNodeId}-send-after`,
            source: newNodeId,
            sourceHandle: 'schedule-sequence-msg',
            target: sendMessageNodeId,
            targetHandle: 'send-after',
            type: 'smoothstep',
          });
        }

        console.log('FlowBuilder: New nodes to add:', newNodes); // Log 4
        console.log('FlowBuilder: New edges to add:', newEdges); // Log 5

        setNodes((nds) => {
          const updated = nds.concat(newNodes);
          console.log('FlowBuilder: Nodes after setNodes:', updated); // Log 6
          return updated;
        });
        setEdges((eds) => {
          const updated = eds.concat(newEdges);
          console.log('FlowBuilder: Edges after setEdges:', updated); // Log 7
          return updated;
        });

      } else {
        console.log('FlowBuilder: Dropping other node type:', nodeType); // Log for other types
        const newNode = {
          id: newNodeId,
          type: nodeType,
          position,
          data: {
            type: contentType,
            ...nodeContentMap[newNodeId] || {},
          },
        };
        setNodes((nds) => nds.concat({ ...newNode, id: newNodeId }));
        console.log('FlowBuilder: Nodes after adding single node:', nodes.concat({ ...newNode, id: newNodeId }));
      }
    },
    [setNodes, setEdges, nodeContentMap] // Added nodeContentMap to dependencies
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
    <ReactFlowProvider>
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
            onNodeClick={onNodeClick}
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
        {selectedSequenceNode && (
          <SequenceEditor
            node={selectedSequenceNode}
            content={nodeContentMap[selectedSequenceNode.id] || {}}
            onSave={(content) => {
              setNodeContentMap(prev => ({ ...prev, [selectedSequenceNode.id]: content }));
              setSelectedSequenceNode(null);
            }}
            onClose={() => setSelectedSequenceNode(null)}
          />
        )}

        {selectedSendMessageNode && (
          <SendMessageAfterEditor
            node={selectedSendMessageNode}
            content={nodeContentMap[selectedSendMessageNode.id] || {}}
            onSave={(content) => {
              setNodeContentMap(prev => ({ ...prev, [selectedSendMessageNode.id]: content }));
              setSelectedSendMessageNode(null);
            }}
            onClose={() => setSelectedSendMessageNode(null)}
          />
        )}

        {editorType === 'buttonNode' && selectedNode && (
          <ButtonEditor
            show={true}
            nodeId={selectedNode?.id}
            content={nodeContentMap[selectedNode.id]}
            onSave={
              handleSaveButtonContent
            }

            onClose={() => {
              setSelectedNode(null);
              setEditorType(null);
            }}
          />



        )}

        {editorType === 'listNode' && selectedNode && (
          <ListEditor
            show={editorType === 'listNode'}
            onClose={() => {
              setSelectedNode(null);
              setEditorType(null);
            }}
            nodeId={selectedNode.id}
            content={nodeContentMap[selectedNode.id]}
            onSave={(id, content) => {
              setNodeContentMap((prev) => ({ ...prev, [id]: content }));
            }}
          />
        )}
        {editorType === 'ecommerceNode' && selectedNode && (
          <EcommerceEditor
            show={editorType === 'ecommerceNode'}
            onClose={() => {
              setSelectedNode(null);
              setEditorType(null);
            }}
            nodeId={selectedNode.id}
            content={nodeContentMap[selectedNode.id]}
            onSave={(id, content) => {
              setNodeContentMap((prev) => ({ ...prev, [id]: content }));
            }}
          />
        )}
      </div>
    </ReactFlowProvider>
  );
}

export default FlowBuilder;
