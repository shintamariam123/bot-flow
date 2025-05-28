import React, { useCallback, useState, useEffect, useMemo } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  useReactFlow // Import useReactFlow to get screenToFlowPosition
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
  const { screenToFlowPosition } = useReactFlow();

  const [savedStartBotData, setSavedStartBotData] = useState(null);
  const [nodeContentMap, setNodeContentMap] = useState({});
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [showStartEditor, setShowStartEditor] = useState(false);
  const [selectedDefaultNode, setSelectedDefaultNode] = useState(null);

  // interactive editor
  const [showInteractiveEditor, setShowInteractiveEditor] = useState(false);
  const [activeInteractiveNodeId, setActiveInteractiveNodeId] = useState(null);

  const [selectedNode, setSelectedNode] = useState(null);
  const [editorType, setEditorType] = useState(null);

  const [selectedSequenceNode, setSelectedSequenceNode] = useState(null);
  const [selectedSendMessageNode, setSelectedSendMessageNode] = useState(null);


  const onNodeClick = useCallback((_event, node) => { // Added useCallback
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
  }, []); // Empty dependency array as it only sets state based on clicked node properties


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
    // Get the source node to position the new node relative to it
    const sourceNode = nodes.find(node => node.id === sourceNodeId);
    let newPosition = { x: 0, y: 0 };
    if (sourceNode) {
      newPosition = {
        x: sourceNode.position.x + 300, // Position to the right of the source node
        y: sourceNode.position.y,
      };
    } else {
      // Fallback if sourceNode is not found (e.g., if somehow a node calls this without being on canvas)
      newPosition = { x: Math.random() * 200 + 100, y: Math.random() * 200 + 100 };
    }

    const newNode = {
      id: newNodeId,
      type: nodeTypeMap[type] || 'defaultNode',
      position: newPosition,
      data: {
        label: `${type.charAt(0).toUpperCase() + type.slice(1)} Node`,
        type,
        ...nodeContentMap[newNodeId] || {},
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
  }, [setNodes, setEdges, nodes, nodeContentMap]); // Added nodes to dependency array


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
              updateTrigger: new Date().toISOString(),
            },
          }
          : node
      )
    );
  };

  // NEW: Handler for saving SequenceEditor content
  const handleSaveSequenceContent = useCallback((content) => {
    if (!selectedSequenceNode) return; // Ensure a node is selected

    const nodeId = selectedSequenceNode.id;

    // Update the nodeContentMap with the new content for this node
    setNodeContentMap(prev => ({
      ...prev,
      [nodeId]: content,
    }));


    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId
          ? {
            ...node,
            data: {
              ...node.data,
              updateTrigger: new Date().toISOString(),
             
            },
          }
          : node
      )
    );

    // Close the editor after saving
    setSelectedSequenceNode(null);
  }, [selectedSequenceNode, setNodeContentMap, setNodes]);

 // NEW: Handler for saving SendMessageAfterEditor content
  const handleSaveSendMessageContent = useCallback((content) => {
    if (!selectedSendMessageNode) return;

    const nodeId = selectedSendMessageNode.id;

    setNodeContentMap(prev => ({
      ...prev,
      [nodeId]: content,
    }));

    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId
          ? {
            ...node,
            data: {
              ...node.data,
              content: content, // Pass the saved content directly to the node's data
              updateTrigger: new Date().toISOString(), // Trigger re-render
            },
          }
          : node
      )
    );

    setSelectedSendMessageNode(null); // Close the editor
  }, [selectedSendMessageNode, setNodeContentMap, setNodes]);


  const onRemoveNode = (nodeId) => {
    setNodes((nds) => nds.filter((node) => node.id !== nodeId));
    setEdges((eds) => eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId));


    setNodeContentMap((prev) => {
      const updated = { ...prev };
      delete updated[nodeId];
      return updated;
    });
  };

  // --- ADDED FUNCTION: handleSubscribeToSequence (spawns new sequence and connects) ---
  const handleSubscribeToSequence = useCallback((buttonNodeId) => {
    const buttonNode = nodes.find(node => node.id === buttonNodeId);
    if (!buttonNode) {
      console.error('ButtonNode not found:', buttonNodeId);
      return;
    }

    const newNodes = [];
    const newEdges = [];

    // 1. Create the new SequenceNode
    const sequenceNodeId = getId();
    const sequenceNodePosition = {
      x: buttonNode.position.x + 300, // To the right of the button node
      y: buttonNode.position.y + 50, // Slightly below for visual separation
    };
    const sequenceNode = {
      id: sequenceNodeId,
      type: 'sequenceNode',
      position: sequenceNodePosition,
      data: {
        label: `New Sequence from Button`,
        ...nodeContentMap[sequenceNodeId] || {},
      },
    };
    newNodes.push(sequenceNode);

    // 2. Connect ButtonNode to the newly spawned SequenceNode
    newEdges.push({
      id: `e-${buttonNodeId}-${sequenceNodeId}-button-subscribe`,
      source: buttonNodeId,
      sourceHandle: 'subscribe', // The handle from ButtonNode.jsx
      target: sequenceNodeId,
      targetHandle: 'subscribe-target', // The target handle you need to define in SequenceNode.jsx
      type: 'smoothstep',
    });

    // 3. Create 3 SendMessageAfterNodes and connect them to the new SequenceNode
    for (let i = 0; i < 3; i++) {
      const sendMessageNodeId = getId();
      const sendMessageNodePosition = {
        x: sequenceNodePosition.x + 300, // To the right of the sequence node
        y: sequenceNodePosition.y + (i * 180) - 50, // Stack vertically
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
        id: `e-${sequenceNodeId}-schedule-sequence-msg-${sendMessageNodeId}-send-after-${i}`,
        source: sequenceNodeId,
        sourceHandle: 'schedule-sequence-msg', // This handle needs to be defined in SequenceNode.jsx
        target: sendMessageNodeId,
        targetHandle: 'send-after', // This handle needs to be defined in SendMessageAfterNode.jsx
        type: 'smoothstep',
      });
    }

    setNodes((nds) => [...nds, ...newNodes]);
    setEdges((eds) => [...eds, ...newEdges]);

  }, [nodes, setNodes, setEdges, nodeContentMap]);


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
        }}
        onSubscribeToSequence={handleSubscribeToSequence} // Pass the handler here!
      />
    ),
    listNode: (nodeProps) => (
      <ListNode
        {...nodeProps}
        onRemoveNode={onRemoveNode}
        onEditListNode={(id) => {
          setSelectedNode(nodeProps);  // Save the selected node
          setEditorType('listNode'); // Set the editor type
        }} />
    ),
    ecommerceNode: (nodeProps) => (
      <EcommerceNode
        {...nodeProps}
        onRemoveNode={onRemoveNode}
        onEditEcommerceNode={(id) => {
          setSelectedNode(nodeProps);  // Save the selected node
          setEditorType('ecommerceNode'); // Set the editor type
        }} />
    ),

    sequenceNode: (nodeProps) => (
      <SequenceNode
        {...nodeProps}
        nodeContentMap={nodeContentMap}
        onRemoveNode={onRemoveNode}
        onEditSequenceNode={(nodeId) => {
          const nodeToEdit = nodes.find(n => n.id === nodeId);
          console.log('Attempting to open editor for node:', nodeToEdit);
          setSelectedSequenceNode(nodeToEdit);
        }}
        data={{
          ...nodeProps.data,
          content: nodeContentMap[nodeProps.id] || {}, // This is key!
        }}
      />
    ),
    sendMessageAfterNode: (nodeProps) => (
      <SendMessageAfterNode
        {...nodeProps}
        nodeContentMap={nodeContentMap}
        onRemoveNode={onRemoveNode}
        onEditSendMessageNode={(nodeId) => setSelectedSendMessageNode(nodes.find(n => n.id === nodeId))}
         data={{
          ...nodeProps.data,
          content: nodeContentMap[nodeProps.id] || {}, // Pass content from map
        }}
        />
   
      ),

  }), [nodeContentMap, spawnConnectedNode, onRemoveNode, nodes, handleSubscribeToSequence, handleSaveSequenceContent]); // Added handleSubscribeToSequence to dependencies


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

      let nodeType = 'defaultNode';
      let contentType = '';
      try {
        const parsed = JSON.parse(data);
        nodeType = parsed.nodeType;
        contentType = parsed.contentType;
      } catch (e) {
        contentType = data; // Fallback
      }

      // Use screenToFlowPosition for accurate dropping
      const position = screenToFlowPosition({ x: event.clientX, y: event.clientY });

      // Use interactiveNode if it's one of the interactive subtypes
      if (['button', 'list', 'ecommerce'].includes(contentType.toLowerCase())) {
        nodeType = `${contentType.toLowerCase()}Node`;
      }

      const newNodeId = getId();

      // Special handling for SequenceNode: automatically connect 3 SendMessageAfterNodes
      if (nodeType === 'sequenceNode') {
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
            y: position.y + (i * 180) - 50, // Stack vertically
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

        setNodes((nds) => nds.concat(newNodes));
        setEdges((eds) => eds.concat(newEdges));

      } else {
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
      }
    },
    [setNodes, setEdges, nodeContentMap, screenToFlowPosition] // Added screenToFlowPosition to dependencies
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);


  const openStartBotEditor = () => setShowStartEditor(true);
  const closeStartBotEditor = () => setShowStartEditor(false);


  const closeDefaultNodeEditor = () => setSelectedDefaultNode(null);

  const updatedNodes = nodes.map((node) =>
    node.type === 'startBot'
      ? { ...node, data: { ...node.data, savedData: savedStartBotData, openEditor: openStartBotEditor } }
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
          onSave={handleSaveSequenceContent}
          onClose={() => setSelectedSequenceNode(null)}
        />
      )}

      {selectedSendMessageNode && (
        <SendMessageAfterEditor
          node={selectedSendMessageNode}
          content={nodeContentMap[selectedSendMessageNode.id] || {}}
          onSave={handleSaveSendMessageContent}
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
  );
}

export default FlowBuilder;