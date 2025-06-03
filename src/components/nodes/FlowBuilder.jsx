import React, { useCallback, useState, useEffect, useMemo } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  useReactFlow
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
  // nodeContentMap will still be used to store content that might not be directly in node.data (e.g., for editors)
  // but for the nodes themselves, node.data.content will be the source of truth for display.
  const [nodeContentMap, setNodeContentMap] = useState({});
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [showStartEditor, setShowStartEditor] = useState(false);
  const [selectedDefaultNode, setSelectedDefaultNode] = useState(null);

  // interactive editor
  const [showInteractiveEditor, setShowInteractiveEditor] = useState(false);
  const [activeInteractiveNodeId, setActiveInteractiveNodeId] = useState(null);

  const [selectedNode, setSelectedNode] = useState(null); // Used for Button, List, Ecommerce
  const [editorType, setEditorType] = useState(null);

  const [selectedSequenceNode, setSelectedSequenceNode] = useState(null);
  const [selectedSendMessageNode, setSelectedSendMessageNode] = useState(null);

  // The console log below isn't strictly necessary for functionality, but good for debugging.
  // useEffect(() => {
  //   console.log('nodeContentMap reference changed');
  // }, [nodeContentMap]);

  const onNodeClick = useCallback((_event, node) => {
    switch (node.type) {
      case 'defaultNode':
        setSelectedDefaultNode(node);
        break;
      case 'buttonNode':
        setSelectedNode(node);
        setEditorType('buttonNode');
        break;
      case 'interactiveNode':
        // Interactive nodes should set their own ID to activeInteractiveNodeId
        setActiveInteractiveNodeId(node.id);
        setShowInteractiveEditor(true);
        break;
      case 'listNode': // Added for ListNode
        setSelectedNode(node);
        setEditorType('listNode');
        break;
      case 'ecommerceNode': // Added for EcommerceNode
        setSelectedNode(node);
        setEditorType('ecommerceNode');
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
  }, []);

  // Handler for saving DefaultNodeEditor content
  const handleSaveDefaultNodeContent = useCallback((nodeId, content) => {
    console.log(`Saving DefaultNode content for ${nodeId}:`, content);

    // Update nodeContentMap (for other components that might still rely on it, though less critical for DefaultNode display now)
    setNodeContentMap(prev => ({
      ...prev,
      [nodeId]: content,
    }));

    // Update the 'nodes' state to reflect the new content
    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId
          ? {
              ...node,
              data: {
                ...node.data,
                content: content, // This is crucial: store the content directly in node.data
              },
            }
          : node
      )
    );
  }, [setNodes, setNodeContentMap]);

  // Unified handler for saving content for interactive, button, list, ecommerce, etc.
  const handleSaveNodeContent = useCallback((nodeId, content) => {
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
                content: content,
              },
            }
          : node
      )
    );
  }, [setNodes, setNodeContentMap]);


  const navigate = useNavigate();

  const spawnConnectedNode = useCallback((sourceNodeId, sourceHandle, type) => {
    const newNodeId = getId();
    const nodeTypeMap = {
      button: 'buttonNode',
      list: 'listNode',
      ecommerce: 'ecommerceNode',
      // Ensure other types handled here match your node definitions if needed
    };

    const sourceNode = nodes.find(node => node.id === sourceNodeId);
    let newPosition = { x: 0, y: 0 };
    if (sourceNode) {
      newPosition = {
        x: sourceNode.position.x + 300,
        y: sourceNode.position.y,
      };
    } else {
      newPosition = { x: Math.random() * 200 + 100, y: Math.random() * 200 + 100 };
    }

    const newNode = {
      id: newNodeId,
      type: nodeTypeMap[type] || 'defaultNode', // Fallback to defaultNode if type not found
      position: newPosition,
      data: {
        label: `${type.charAt(0).toUpperCase() + type.slice(1)} Node`,
        type, // e.g., 'button', 'list', 'text', 'image'
        content: {}, // Initialize content as an empty object for new nodes
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
  }, [setNodes, setEdges, nodes]); // removed nodeContentMap from dependencies here, as content is initialized as empty object


  const handleSaveSequenceContent = useCallback((content) => {
    if (!selectedSequenceNode) return;
    handleSaveNodeContent(selectedSequenceNode.id, content); // Use unified handler
    setSelectedSequenceNode(null);
  }, [selectedSequenceNode, handleSaveNodeContent]);

  const handleSaveSendMessageContent = useCallback((content) => {
    if (!selectedSendMessageNode) return;
    handleSaveNodeContent(selectedSendMessageNode.id, content); // Use unified handler
    setSelectedSendMessageNode(null);
  }, [selectedSendMessageNode, handleSaveNodeContent]);


  const onRemoveNode = useCallback((nodeId) => {
    setNodes((nds) => nds.filter((node) => node.id !== nodeId));
    setEdges((eds) => eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId));

    // Also remove from nodeContentMap if still used for other purposes
    setNodeContentMap((prev) => {
      const updated = { ...prev };
      delete updated[nodeId];
      return updated;
    });
    // Ensure the editor closes if the selected node is removed
    if (selectedDefaultNode && selectedDefaultNode.id === nodeId) {
      setSelectedDefaultNode(null);
    }
    if (activeInteractiveNodeId === nodeId) {
      setActiveInteractiveNodeId(null);
      setShowInteractiveEditor(false);
    }
    if (selectedNode && selectedNode.id === nodeId) {
      setSelectedNode(null);
      setEditorType(null);
    }
    if (selectedSequenceNode && selectedSequenceNode.id === nodeId) {
      setSelectedSequenceNode(null);
    }
    if (selectedSendMessageNode && selectedSendMessageNode.id === nodeId) {
      setSelectedSendMessageNode(null);
    }
  }, [setNodes, setEdges, setNodeContentMap, selectedDefaultNode, activeInteractiveNodeId, selectedNode, selectedSequenceNode, selectedSendMessageNode]);

  const handleSubscribeToSequence = useCallback((buttonNodeId) => {
    const buttonNode = nodes.find(node => node.id === buttonNodeId);
    if (!buttonNode) { console.error('ButtonNode not found:', buttonNodeId); return; }

    const newNodes = [];
    const newEdges = [];

    const sequenceNodeId = getId();
    const sequenceNodePosition = {
      x: buttonNode.position.x + 300,
      y: buttonNode.position.y + 50,
    };
    const sequenceNode = {
      id: sequenceNodeId,
      type: 'sequenceNode',
      position: sequenceNodePosition,
      data: {
        label: `New Sequence from Button`,
        content: {}, // Initialize content as empty object
      },
    };
    newNodes.push(sequenceNode);

    newEdges.push({
      id: `e-${buttonNodeId}-${sequenceNodeId}-button-subscribe`,
      source: buttonNodeId,
      sourceHandle: 'subscribe',
      target: sequenceNodeId,
      targetHandle: 'subscribe-target',
      type: 'smoothstep',
    });

    for (let i = 0; i < 3; i++) {
      const sendMessageNodeId = getId();
      const sendMessageNodePosition = {
        x: sequenceNodePosition.x + 300,
        y: sequenceNodePosition.y + (i * 180) - 50,
      };
      const sendMessageNode = {
        id: sendMessageNodeId,
        type: 'sendMessageAfterNode',
        position: sendMessageNodePosition,
        data: {
          label: `Send Message After ${i + 1}`,
          content: {}, // Initialize content as empty object
        },
      };
      newNodes.push(sendMessageNode);

      newEdges.push({
        id: `e-${sequenceNodeId}-schedule-sequence-msg-${sendMessageNodeId}-send-after-${i}`,
        source: sequenceNodeId,
        sourceHandle: 'schedule-sequence-msg',
        target: sendMessageNodeId,
        targetHandle: 'send-after',
        type: 'smoothstep',
      });
    }

    setNodes((nds) => [...nds, ...newNodes]);
    setEdges((eds) => [...eds, ...newEdges]);

  }, [nodes, setNodes, setEdges]); // Removed nodeContentMap from dependencies here


  useEffect(() => {
    setNodes((nds) =>
      nds.map((node) =>
        node.type === 'startBot'
          ? { ...node, data: { ...node.data, savedData: savedStartBotData, openEditor: openStartBotEditor } }
          : node
      )
    );
  }, [savedStartBotData, setNodes]);

  const onConnect = useCallback(
    (params) => {
      setEdges((eds) => addEdge(params, eds));
    },
    [setEdges]
  );

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      const dataTransferData = event.dataTransfer.getData('application/reactflow');

      let nodeType = 'defaultNode';
      let contentType = '';
      try {
        const parsed = JSON.parse(dataTransferData);
        nodeType = parsed.nodeType;
        contentType = parsed.contentType;
      } catch (e) {
        contentType = dataTransferData;
      }

      const position = screenToFlowPosition({ x: event.clientX, y: event.clientY });

      if (['button', 'list', 'ecommerce'].includes(contentType.toLowerCase())) {
        nodeType = `${contentType.toLowerCase()}Node`;
      }

      const newNodeId = getId();

      if (nodeType === 'sequenceNode') {
        const sequenceNode = {
          id: newNodeId,
          type: 'sequenceNode',
          position,
          data: {
            label: 'Sequence Node',
            content: {}, // Initialize content as an empty object
          },
        };

        const newNodes = [sequenceNode];
        const newEdges = [];

        for (let i = 0; i < 3; i++) {
          const sendMessageNodeId = getId();
          const sendMessageNodePosition = {
            x: position.x + 300,
            y: position.y + (i * 180) - 50,
          };
          const sendMessageNode = {
            id: sendMessageNodeId,
            type: 'sendMessageAfterNode',
            position: sendMessageNodePosition,
            data: {
              label: `Send Message After ${i + 1}`,
              content: {}, // Initialize content as an empty object
            },
          };
          newNodes.push(sendMessageNode);

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
            type: contentType, // This should be the 'Text', 'Image', etc. from toolbar
            content: {}, // Always initialize content as an empty object for new nodes
            onRemoveNode: onRemoveNode,
            onCloseEditor: closeDefaultNodeEditor,
          },
        };
        setNodes((nds) => nds.concat(newNode));
      }
    },
    [setNodes, setEdges, screenToFlowPosition, onRemoveNode] // Removed nodeContentMap from dependencies here
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

  // Register node types
  const nodeTypes = useMemo(() => ({
    startBot: StartBotNode,
    // DefaultNode now directly consumes node.data.content
    defaultNode: DefaultNode,
    interactiveNode: (nodeProps) => (
      <InteractiveNode
        {...nodeProps}
        // nodeContentMap is no longer the primary source for DefaultNode's display,
        // but can be passed for other reasons if needed within the component itself.
        // The display content should come from nodeProps.data.content
        onRemoveNode={onRemoveNode}
        data={{
          ...nodeProps.data,
          onEditInteractiveNode: () => {
            setActiveInteractiveNodeId(nodeProps.id); // Set the active ID for the editor
            setShowInteractiveEditor(true);
          },
          onClose: () => setShowInteractiveEditor(false),
          spawnConnectedNode: spawnConnectedNode,
          // content is already in nodeProps.data.content, so no need to pass it separately
        }}
      />
    ),
    buttonNode: (nodeProps) => (
      <ButtonNode
        {...nodeProps}
        // nodeContentMap is no longer the primary source for ButtonNode's display.
        // Display content should come from nodeProps.data.content
        onRemoveNode={onRemoveNode}
        onEditButtonNode={(id) => {
          setSelectedNode(nodes.find(n => n.id === id));
          setEditorType('buttonNode');
        }}
        onSubscribeToSequence={handleSubscribeToSequence}
      />
    ),
    listNode: (nodeProps) => (
      <ListNode
        {...nodeProps}
        onRemoveNode={onRemoveNode}
        onEditListNode={(id) => {
          setSelectedNode(nodes.find(n => n.id === id)); // Find the actual node object
          setEditorType('listNode');
        }}
      />
    ),
    ecommerceNode: (nodeProps) => (
      <EcommerceNode
        {...nodeProps}
        onRemoveNode={onRemoveNode}
        onEditEcommerceNode={(id) => {
          setSelectedNode(nodes.find(n => n.id === id)); // Find the actual node object
          setEditorType('ecommerceNode');
        }}
      />
    ),
    sequenceNode: (nodeProps) => (
      <SequenceNode
        {...nodeProps}
        onRemoveNode={onRemoveNode}
        onEditSequenceNode={(nodeId) => {
          const nodeToEdit = nodes.find(n => n.id === nodeId);
          console.log('Attempting to open editor for node:', nodeToEdit);
          setSelectedSequenceNode(nodeToEdit);
        }}
        // content is already in nodeProps.data.content, so no need to pass it separately
      />
    ),
    sendMessageAfterNode: (nodeProps) => (
      <SendMessageAfterNode
        {...nodeProps}
        onRemoveNode={onRemoveNode}
        onEditSendMessageNode={(nodeId) => setSelectedSendMessageNode(nodes.find(n => n.id === nodeId))}
        // content is already in nodeProps.data.content, so no need to pass it separately
      />
    ),
  }), [
    nodes, // Added nodes to dependencies as node type functions might need it to find specific nodes
    onRemoveNode,
    spawnConnectedNode,
    handleSubscribeToSequence,
  ]);


  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Toolbar
        nodes={nodes}
        edges={edges}
        nodeContentMap={nodeContentMap} // Keep for now if toolbar needs to access it
        savedStartBotData={savedStartBotData}
        setNodes={setNodes}
        setEdges={setEdges}
        setNodeContentMap={setNodeContentMap} // Keep for now if toolbar modifies it
        setSavedStartBotData={setSavedStartBotData}
        onDashboardClick={() => navigate('/dashboard')}
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
        onSave={handleSaveDefaultNodeContent}
      />
      {/* InteractiveNodeEditor should fetch content from the node's data.content directly */}
      <InteractiveNodeEditor
        show={showInteractiveEditor}
        onClose={() => {
          setShowInteractiveEditor(false);
          setActiveInteractiveNodeId(null); // Clear active node when closing
        }}
        nodeId={activeInteractiveNodeId}
        // Fetch content directly from the node's data
        content={nodes.find(n => n.id === activeInteractiveNodeId)?.data?.content || {}}
        onSave={handleSaveNodeContent} // Use the unified handler
      />
      {selectedSequenceNode && (
        <SequenceEditor
          node={selectedSequenceNode}
          // Fetch content directly from the node's data
          content={nodes.find(n => n.id === selectedSequenceNode.id)?.data?.content || {}}
          onSave={handleSaveSequenceContent}
          onClose={() => setSelectedSequenceNode(null)}
        />
      )}

      {selectedSendMessageNode && (
        <SendMessageAfterEditor
          node={selectedSendMessageNode}
          // Fetch content directly from the node's data
          content={nodes.find(n => n.id === selectedSendMessageNode.id)?.data?.content || {}}
          onSave={handleSaveSendMessageContent}
          onClose={() => setSelectedSendMessageNode(null)}
        />
      )}

      {editorType === 'buttonNode' && selectedNode && (
        <ButtonEditor
          show={true}
          nodeId={selectedNode?.id}
          // Fetch content directly from the node's data
          content={nodes.find(n => n.id === selectedNode.id)?.data?.content || {}}
          onSave={handleSaveNodeContent} // Use the unified handler
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
          // Fetch content directly from the node's data
          content={nodes.find(n => n.id === selectedNode.id)?.data?.content || {}}
          onSave={handleSaveNodeContent} // Use the unified handler
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
          // Fetch content directly from the node's data
          content={nodes.find(n => n.id === selectedNode.id)?.data?.content || {}}
          onSave={handleSaveNodeContent} // Use the unified handler
        />
      )}
    </div>
  );
}

export default FlowBuilder;