import React, { useCallback, useState, useRef, useEffect, useMemo } from 'react';

import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge, MarkerType,
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
import SectionNode from './SectionNode';
import SectionEditor from '../editors/SectionEditor';
import RowSection from './RowSection';
import RowSectionEditor from '../editors/RowSectionEditor';
import Product from './Product';
import ProductSection from './ProductSection';
import ProductEditor from '../editors/ProductEditor'
import ProductSectionEditor from '../editors/ProductSectionEditor'
import SingleProduct from './SingleProduct';
import SingleProductEditor from '../editors/SingleProductEditor';


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

  const [selectedNode, setSelectedNode] = useState(null); // Used for Button, List, Ecommerce
  const [editorType, setEditorType] = useState(null);

  const [selectedSequenceNode, setSelectedSequenceNode] = useState(null);
  const [selectedSendMessageNode, setSelectedSendMessageNode] = useState(null);

  const [selectedSectionNode, setSelectedSectionNode] = useState(null);
  const [selectedRowSectionNode, setSelectedRowSectionNode] = useState(null);

  const [selectedProductSectionNode, setSelectedProductSectionNode] = useState(null);
  const [selectedProductNode, setSelectedProductNode] = useState(null);
  const [selectedSingleProductNode, setSelectedSingleProductNode] = useState(null);



  const nodesRef = useRef(nodes); // Create a ref to hold the latest nodes state

  // Update the ref whenever 'nodes' state changes
  useEffect(() => {
    nodesRef.current = nodes;
  }, [nodes]);
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
      case 'sectionNode':
        setSelectedSectionNode(node);
        break;
      case 'rowSectionNode':
        setSelectedRowSectionNode(node);
        break;
      case 'productSectionNode':
        setSelectedProductSectionNode(node);
        break;
      case 'productsSectionNode':
        setSelectedProductNode(node);
        break;
      case 'singleProductNode':
        setSelectedSingleProductNode(node);
        break;
      default:
        break;
    }
  }, []);

  // Handler for saving DefaultNodeEditor content
  const handleSaveDefaultNodeContent = useCallback((nodeId, content) => {
    console.log(`Saving DefaultNode content for ${nodeId}:`, content);
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

  const onRemoveNode = useCallback((nodeId) => {
    console.log(`FlowBuilder: Attempting to remove node with ID: ${nodeId}`);
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
    if (selectedSectionNode && selectedSectionNode.id === nodeId) {
      setSelectedSectionNode(null);
    }
    if (selectedRowSectionNode && selectedRowSectionNode.id === nodeId) {
      setSelectedRowSectionNode(null);
    }
    if (selectedProductSectionNode && selectedProductSectionNode.id === nodeId) {
      setSelectedProductSectionNode(null);
    }
    if (selectedProductNode && selectedProductNode.id === nodeId) {
      setSelectedProductNode(null);
    }
  }, [setNodes, setEdges, setNodeContentMap, selectedDefaultNode, activeInteractiveNodeId, selectedNode, selectedSequenceNode, selectedSendMessageNode, selectedSectionNode, selectedRowSectionNode, selectedProductSectionNode, selectedProductNode]);

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
        style: {
          zIndex: 10, // <--- Apply zIndex here, a lower value than your edge zIndex
        },
      },
    };
    newNodes.push(sequenceNode);

    newEdges.push({
      id: `e-${buttonNodeId}-${sequenceNodeId}-button-subscribe`,
      source: buttonNodeId,
      sourceHandle: 'subscribe',
      target: sequenceNodeId,
      targetHandle: 'subscribe-target',
      type: 'default',
     
      style: {
        zIndex: 1000, // Make sure this is higher than your node's z-index
      },
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
          style: {
            zIndex: 10, // <--- Apply zIndex here, a lower value than your edge zIndex
          },
        },
      };

      newNodes.push(sendMessageNode);
      newEdges.push({
        id: `e-${sequenceNodeId}-schedule-sequence-msg-${sendMessageNodeId}-send-after-${i}`,
        source: sequenceNodeId,
        sourceHandle: 'schedule-sequence-msg',
        target: sendMessageNodeId,
        targetHandle: 'send-after',
        type: 'default',
      });
    }

    setNodes((nds) => [...nds, ...newNodes]);
    setEdges((eds) => [...eds, ...newEdges]);
  }, [nodes, setNodes, setEdges]); // Removed nodeContentMap from dependencies here

  const handleSubscribeToSection = useCallback((listNodeId) => {
    const listNode = nodes.find(node => node.id === listNodeId);
    if (!listNode) { console.error('list node not found:', listNodeId); return; }
    const newNodes = [];
    const newEdges = [];
    const sectionNodeId = getId(); // This generates 'node_9'
    const sectionNodePosition = {
      x: listNode.position.x + 300,
      y: listNode.position.y + 50,
    };
    const sectionNode = {
      id: sectionNodeId,
      type: 'sectionNode',
      position: sectionNodePosition,
      data: {
        label: `New section from list`,
        content: {},
        style: {
          zIndex: 10, // <--- Apply zIndex here, a lower value than your edge zIndex
        },
      },
    };
    newNodes.push(sectionNode);

    newEdges.push({
      id: `e-<span class="math-inline">\{listNodeId\}\-</span>{sectionNodeId}-list-subscribe`,
      source: listNodeId,
      sourceHandle: 'section',
      target: sectionNodeId,
      targetHandle: 'section-target',
      type: 'default',

    });

    for (let i = 0; i < 3; i++) {
      const rowNodeId = getId();
      const rowNodePosition = {
        x: sectionNodePosition.x + 300,
        y: sectionNodePosition.y + (i * 180) - 50,
      };
      const rowSectionNode = {
        id: rowNodeId,
        type: 'rowSectionNode',
        position: rowNodePosition,
        data: {
          label: `Row ${i + 1}`,
          content: {},
          style: {
            zIndex: 10, // <--- Apply zIndex here, a lower value than your edge zIndex
          },
        },
      };
      newNodes.push(rowSectionNode);
      newEdges.push({
        id: `e-<span class="math-inline">\{sectionNodeId\}\-row\-msg\-</span>{rowNodeId}-row-target-${i}`,
        source: sectionNodeId,
        sourceHandle: 'row-msg',
        target: rowNodeId,
        targetHandle: 'row-target',
        type: 'default',
      
      });
    }

    console.log('handleSubscribeToSection: New nodes to add:', newNodes); // ADD THIS
    setNodes((nds) => {
      const updatedNodes = [...nds, ...newNodes];
      console.log('handleSubscribeToSection: Nodes after setNodes:', updatedNodes); // ADD THIS
      return updatedNodes;
    });
    setEdges((eds) => [...eds, ...newEdges]);
  }, [nodes, setNodes, setEdges]); // Ensure `nodes` is a dependency here.
  // FlowBuilder.js (Excerpt from spawnConnectedNode)

  const handleSubscribeToProductSection = useCallback((ecommerceNodeId) => {
    const ecommerceNode = nodes.find(node => node.id === ecommerceNodeId);
    if (!ecommerceNode) { console.error('ecommerce node not found:', ecommerceNodeId); return; }
    const newNodes = [];
    const newEdges = [];
    const productSectionNodeId = getId(); // This generates 'node_9'
    const productSectionNodePosition = {
      x: ecommerceNode.position.x + 300,
      y: ecommerceNode.position.y + 50,
    };
    const productSectionNode = {
      id: productSectionNodeId,
      type: 'productSectionNode',
      position: productSectionNodePosition,
      data: {
        label: `New product section from ecommerce`,
        content: {},
        content: {},
        style: {
          zIndex: 10, // <--- Apply zIndex here, a lower value than your edge zIndex
        },
      },
    };
    newNodes.push(productSectionNode);

    newEdges.push({
      id: `e-<span class="math-inline">\{ecommerceNodeId\}\-</span>{productSectionNodeId}-ecommerce-subscribe`,
      source: ecommerceNodeId,
      sourceHandle: 'productSection',
      target: productSectionNodeId,
      targetHandle: 'productSection-target',
      type: 'default',
     
    });

    for (let i = 0; i < 3; i++) {
      const productNodeId = getId();
      const productNodePosition = {
        x: productSectionNodePosition.x + 300,
        y: productSectionNodePosition.y + (i * 180) - 50,
      };
      const productsSectionNode = {
        id: productNodeId,
        type: 'productsSectionNode',
        position: productNodePosition,
        data: {
          label: `Product ${i + 1}`,
          content: {},
          style: {
            zIndex: 10, // <--- Apply zIndex here, a lower value than your edge zIndex
          },
        },
      };
      newNodes.push(productsSectionNode);
      newEdges.push({
        id: `e-<span class="math-inline">\{productSectionNodeId\}\-product\-msg\-</span>{productNodeId}-product-target-${i}`,
        source: productSectionNodeId,
        sourceHandle: 'product-msg',
        target: productNodeId,
        targetHandle: 'product-target',
        type: 'default',
      
      });
    }

    console.log('handleSubscribeToproductSection: New nodes to add:', newNodes); // ADD THIS
    setNodes((nds) => {
      const updatedNodes = [...nds, ...newNodes];
      console.log('handleSubscribeToproductSection: Nodes after setNodes:', updatedNodes); // ADD THIS
      return updatedNodes;
    });
    setEdges((eds) => [...eds, ...newEdges]);
  }, [nodes, setNodes, setEdges]);

  const handleSubscribeToSingleProduct = useCallback((ecommerceNodeId) => {
    const ecommerceNode = nodes.find(node => node.id === ecommerceNodeId);
    if (!ecommerceNode) { console.error('ecommerce node not found:', ecommerceNodeId); return; }
    const newNodes = [];
    const newEdges = [];
    const singleProductNodeId = getId(); // This generates 'node_9'
    const singleProductNodePosition = {
      x: ecommerceNode.position.x + 300,
      y: ecommerceNode.position.y + 50,
    };
    const singleProductNode = {
      id: singleProductNodeId,
      type: 'singleProductNode',
      position: singleProductNodePosition,
      data: {
        label: `New single product section from ecommerce`,
        content: {},
        style: {
          zIndex: 10, // <--- Apply zIndex here, a lower value than your edge zIndex
        },
        onRemoveNode: onRemoveNode,
        onEditSingleProductNode: (nodeId) => setSelectedSingleProductNode(nodes.find(n => n.id === nodeId)),
      },
    };
    newNodes.push(singleProductNode);

    newEdges.push({
      id: `e-<span class="math-inline">\{ecommerceNodeId\}\-</span>{singleProductNodeId}-ecommerce-single-subscribe`,
      source: ecommerceNodeId,
      sourceHandle: 'singleProduct',
      target: singleProductNodeId,
      targetHandle: 'singleProduct-target',
      type: 'default',
     
    });

    console.log('handleSubscribeToproductSection: New nodes to add:', newNodes); // ADD THIS
    setNodes((nds) => {
      const updatedNodes = [...nds, ...newNodes];
      console.log('handleSubscribeToproductSection: Nodes after setNodes:', updatedNodes); // ADD THIS
      return updatedNodes;
    });
    setEdges((eds) => [...eds, ...newEdges]);
  }, [nodes, setNodes, setEdges, onRemoveNode]);

  const spawnConnectedNode = useCallback((sourceNodeId, sourceHandle, type) => {

    const newNodeId = getId();
    const nodeTypeMap = {
      button: 'buttonNode',
      list: 'listNode',
      ecommerce: 'ecommerceNode',
      reply: 'defaultNode',

    };

    const targetHandleMap = {
      button: 'button-target',
      list: 'list-target', // Matches the id in ListNode.js
      ecommerce: 'ecommerce-target', // Matches the id in EcommerceNode.js
      reply: 'input',
    };

    const sourceNode = nodes.find(node => node.id === sourceNodeId);
    let newPosition = { x: 0, y: 0 };
    if (sourceNode) {
      newPosition = {
        x: sourceNode.position.x + 300, // Offset horizontally
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
        content: {},
        onRemoveNode: onRemoveNode,
        spawnConnectedNode: spawnConnectedNode, // Pass this down for further connections
        onEditInteractiveNode: () => { // For interactive node specifically
          setActiveInteractiveNodeId(newNodeId);
          setShowInteractiveEditor(true);
        },
        onCloseInteractiveEditor: () => setShowInteractiveEditor(false),
        onEditListNode: (id) => { setSelectedNode(nodes.find(n => n.id === id)); setEditorType('listNode'); },
        onEditEcommerceNode: (id) => { setSelectedNode(nodes.find(n => n.id === id)); setEditorType('ecommerceNode'); },
        onEditButtonNode: (id) => { setSelectedNode(nodes.find(n => n.id === id)); setEditorType('buttonNode'); },
        onSubscribeToSequence: handleSubscribeToSequence, // Ensure this is passed to ButtonNode if needed
        onSubscribeToSection: handleSubscribeToSection,
        onSubscribeToProductSection: handleSubscribeToProductSection,
        onSubscribeToSingleProduct: handleSubscribeToSingleProduct
      },
    };

    const newEdge = {
      id: `e-${sourceNodeId}-${newNodeId}`,
      source: sourceNodeId,
      sourceHandle, // This is the ID from the calling node (e.g., "list" or "ecommerce" from InteractiveNode)
      target: newNodeId,
      targetHandle: targetHandleMap[type], // --- NEW: Use the mapped target handle ---
      type: 'default',
    };

    setNodes((nds) => [...nds, newNode]);
    setEdges((eds) => [...eds, newEdge]);
  }, [setNodes, setEdges, nodes, onRemoveNode, handleSubscribeToSequence, handleSubscribeToSection, handleSubscribeToProductSection]); // Keep dependencies up to date

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

  const handleSaveSectionContent = useCallback((nodeId, newContent) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === nodeId) {
          // Return a new node object with updated data.content
          return {
            ...node,
            data: {
              ...node.data,
              content: newContent, // <--- UPDATE THE CONTENT HERE
            },
          };
        }
        return node;
      })
    );
  }, [setNodes]);

  const handleSaveRowContent = useCallback((nodeId, content) => {
    // This is crucial: Use nodeId to find and update the correct node
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
    setSelectedRowSectionNode(null); // Close the editor after saving
  }, [setNodes]);

  const handleSaveProductSectionContent = useCallback((nodeId, newContent) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === nodeId) {
          // Return a new node object with updated data.content
          return {
            ...node,
            data: {
              ...node.data,
              content: newContent, // <--- UPDATE THE CONTENT HERE
            },
          };
        }
        return node;
      })
    );
  }, [setNodes]);

  const handleSaveProductContent = useCallback((nodeId, content) => {
    // This is crucial: Use nodeId to find and update the correct node
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
    setSelectedProductNode(null); // Close the editor after saving
  }, [setNodes]);
  const handleSaveSingleProductContent = useCallback((nodeId, newContent) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === nodeId) {
          // Return a new node object with updated data.content
          return {
            ...node,
            data: {
              ...node.data,
              content: newContent, // <--- UPDATE THE CONTENT HERE
            },
          };
        }
        return node;
      })
    );
  }, [setNodes]);


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
            onRemoveNode: onRemoveNode,
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
            type: 'default',
          });
        }
        setNodes((nds) => nds.concat(newNodes));
        setEdges((eds) => eds.concat(newEdges));
      }
      else {
        const newNode = {
          id: newNodeId,
          type: nodeType,
          position,
          data: {
            type: contentType, // This should be the 'Text', 'Image', etc. from toolbar
            content: {}, // Always initialize content as an empty object for new nodes
            onRemoveNode: onRemoveNode,
            onCloseEditor: closeDefaultNodeEditor,
            onEditInteractiveNode: () => {
              setActiveInteractiveNodeId(newNodeId);
              setShowInteractiveEditor(true);
            },
            onCloseInteractiveEditor: () => setShowInteractiveEditor(false), // A more specific close handler
            spawnConnectedNode: spawnConnectedNode,
          },
        };
        setNodes((nds) => nds.concat(newNode));
      }
    },
    [setNodes, setEdges, screenToFlowPosition, onRemoveNode]
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

  const nodeTypes = useMemo(() => ({
    startBot: StartBotNode,
    defaultNode: (nodeProps) => (
      <DefaultNode
        {...nodeProps}
        onRemoveNode={onRemoveNode} // Explicitly pass here
      />
    ),
    interactiveNode: InteractiveNode,
    buttonNode: ButtonNode,
    listNode: ListNode,
    ecommerceNode: EcommerceNode,

    sequenceNode: (nodeProps) => (
      <SequenceNode
        {...nodeProps}
        onRemoveNode={onRemoveNode}
        onEditSequenceNode={(nodeId) => {
          const nodeToEdit = nodes.find(n => n.id === nodeId);
          console.log('Attempting to open editor for node:', nodeToEdit);
          setSelectedSequenceNode(nodeToEdit);
        }}
        targetHandleId="subscribe-target" />
    ),
    sendMessageAfterNode: (nodeProps) => (
      <SendMessageAfterNode
        {...nodeProps}
        onRemoveNode={onRemoveNode}
        onEditSendMessageNode={(nodeId) => setSelectedSendMessageNode(nodes.find(n => n.id === nodeId))}
        targetHandleId="send-after" />
    ),
    sectionNode: (nodeProps) => (
      <SectionNode
        {...nodeProps}
        onRemoveNode={onRemoveNode}
        onEditSectionNode={(nodeId) => {
          console.log('FlowBuilder: received nodeId for editor:', nodeId); // ADD THIS
          const nodeToEdit = nodesRef.current.find(n => n.id === nodeId);
          console.log('Attempting to open editor for node:', nodeToEdit);
          setSelectedSectionNode(nodeToEdit);
        }}
        targetHandleId="section-target" />
    ),
    rowSectionNode: (nodeProps) => (
      <RowSection
        {...nodeProps}
        onRemoveNode={onRemoveNode}
        onEditRowSectionNode={(nodeId) => setSelectedRowSectionNode(nodes.find(n => n.id === nodeId))}
        targetHandleId="row-target" />
    ),
    productSectionNode: (nodeProps) => (
      <ProductSection
        {...nodeProps}
        onRemoveNode={onRemoveNode}
        onEditProductSectionNode={(nodeId) => {
          console.log('FlowBuilder: received nodeId for editor:', nodeId); // ADD THIS
          const nodeToEdit = nodesRef.current.find(n => n.id === nodeId);
          console.log('Attempting to open editor for node:', nodeToEdit);
          setSelectedProductSectionNode(nodeToEdit);
        }}
        targetHandleId="productSection-target"
      />
    ),
    productsSectionNode: (nodeProps) => (
      <Product
        {...nodeProps}
        onRemoveNode={onRemoveNode}
        onEditProductNode={(nodeId) => setSelectedProductNode(nodes.find(n => n.id === nodeId))}
        targetHandleId="product-target"

      />
    ),
    singleProductNode: (nodeProps) => (
      <SingleProduct
        {...nodeProps}
        onRemoveNode={onRemoveNode}
        onEditSingleProductNode={(nodeId) => {
          console.log('FlowBuilder: received nodeId for editor:', nodeId); // ADD THIS
          const nodeToEdit = nodesRef.current.find(n => n.id === nodeId);
          console.log('Attempting to open editor for node:', nodeToEdit);
          setSelectedSingleProductNode(nodeToEdit);
        }}
        targetHandleId="singleProduct-target"
      />
    )

  }), []);

  useEffect(() => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.type === 'defaultNode') { // Assuming DefaultNode type is 'defaultNode'
          return {
            ...node,
            data: {
              ...node.data,
              onRemoveNode: onRemoveNode,
              onCloseEditor: closeDefaultNodeEditor, // Ensure this is also passed if needed
            },
          };
        }
        else if (node.type === 'interactiveNode') {
          return {
            ...node,
            data: {
              ...node.data,
              onRemoveNode: onRemoveNode,
              onEditInteractiveNode: () => {
                setActiveInteractiveNodeId(node.id);
                setShowInteractiveEditor(true)
              },
              onCloseInteractiveEditor: () => setShowInteractiveEditor(false),
              spawnConnectedNode: spawnConnectedNode,
            },
          };
        } else if (node.type === 'buttonNode') {
          return {
            ...node,
            data: {
              ...node.data,
              onRemoveNode: onRemoveNode,
              onEditButtonNode: (id) => {
                const nodeToEdit = nds.find(n => n.id === id);
                setSelectedNode(nodeToEdit);
                setEditorType('buttonNode');
              },
              onSubscribeToSequence: handleSubscribeToSequence,
            },
          };
        } else if (node.type === 'listNode') {
          return {
            ...node,
            data: {
              ...node.data,
              onRemoveNode: onRemoveNode,
              onEditListNode: (id) => {
                setSelectedNode(nodes.find(n => n.id === id));
                setEditorType('listNode');
              },
              onSubscribeToSection: handleSubscribeToSection
            },
          };
        } else if (node.type === 'ecommerceNode') {
          return {
            ...node,
            data: {
              ...node.data,
              onRemoveNode: onRemoveNode,
              onEditEcommerceNode: (id) => {
                setSelectedNode(nodes.find(n => n.id === id));
                setEditorType('ecommerceNode');
              },
              onSubscribeToProductSection: handleSubscribeToProductSection,
              onSubscribeToSingleProduct: handleSubscribeToSingleProduct
            },
          };
        } else if (node.type === 'sequenceNode') {
          return {
            ...node,
            data: {
              ...node.data,
              onRemoveNode: onRemoveNode,
              onEditSequenceNode: (nodeId) => {
                const nodeToEdit = nodes.find(n => n.id === nodeId);
                setSelectedSequenceNode(nodeToEdit);
              },
            },
          };
        } else if (node.type === 'sendMessageAfterNode') {
          return {
            ...node,
            data: {
              ...node.data,
              onRemoveNode: onRemoveNode,
              onEditSendMessageNode: (nodeId) => setSelectedSendMessageNode(nodes.find(n => n.id === nodeId)),
            },
          };
        } else if (node.type === 'sectionNode') { // **Updated useEffect for SectionNode**
          return {
            ...node,
            data: {
              ...node.data,
              onRemoveNode: onRemoveNode,
              onEditSectionNode: (nodeId) => {
                console.log('FlowBuilder useEffect: received nodeId for editor:', nodeId); // ADD THIS
                const nodeToEdit = nodesRef.current.find(n => n.id === nodeId);
                console.log('FlowBuilder useEffect: Attempting to open editor for node:', nodeToEdit);
                setSelectedSectionNode(nodeToEdit);
              },
            },
          };
        } else if (node.type === 'rowSectionNode') { // **Updated useEffect for RowSectionNode**
          return {
            ...node,
            data: {
              ...node.data,
              onRemoveNode: onRemoveNode,
              onEditRowSectionNode: (nodeId) => setSelectedRowSectionNode(nodes.find(n => n.id === nodeId)),
            },
          };
        } else if (node.type === 'productSectionNode') { // **Updated useEffect for SectionNode**
          return {
            ...node,
            data: {
              ...node.data,
              onRemoveNode: onRemoveNode,
              onEditProductSectionNode: (nodeId) => {
                console.log('FlowBuilder useEffect: received nodeId for editor:', nodeId); // ADD THIS
                const nodeToEdit = nodesRef.current.find(n => n.id === nodeId);
                console.log('FlowBuilder useEffect: Attempting to open editor for node:', nodeToEdit);
                setSelectedProductSectionNode(nodeToEdit);
              },
            },
          };
        } else if (node.type === 'productsSectionNode') { // **Updated useEffect for RowSectionNode**
          return {
            ...node,
            data: {
              ...node.data,
              onRemoveNode: onRemoveNode,
              onEditProductNode: (nodeId) => setSelectedProductNode(nodes.find(n => n.id === nodeId)),
            },
          };
        } else if (node.type === 'singleProductNode') { // **Updated useEffect for SectionNode**
          return {
            ...node,
            data: {
              ...node.data,
              onRemoveNode: onRemoveNode,
              onEditSingleProductNode: (nodeId) => {
                console.log('FlowBuilder useEffect: received nodeId for editor:', nodeId); // ADD THIS
                const nodeToEdit = nodesRef.current.find(n => n.id === nodeId);
                console.log('FlowBuilder useEffect: Attempting to open editor for node:', nodeToEdit);
                setSelectedSingleProductNode(nodeToEdit);
              },
            },
          };
        }
        return node;
      }));
  }, [setNodes, onRemoveNode, spawnConnectedNode, handleSubscribeToSequence, handleSubscribeToSection, handleSubscribeToProductSection, handleSubscribeToSingleProduct]);

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
          defaultEdgeOptions={{
            type: 'default',
            markerEnd: {
              type: MarkerType.ArrowClosed,
              color: 'black',
            },
            style: { // <--- Add style here
              zIndex: 1000, // A high value to ensure visibility
            },
          }}
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
        content={nodes.find(n => n.id === activeInteractiveNodeId)?.data?.content || {}}
        onSave={handleSaveNodeContent} // Use the unified handler
      />
      {selectedSequenceNode && (
        <SequenceEditor
          node={selectedSequenceNode}
          content={nodes.find(n => n.id === selectedSequenceNode.id)?.data?.content || {}}
          onSave={handleSaveSequenceContent}
          onClose={() => setSelectedSequenceNode(null)}
        />
      )}

      {selectedSendMessageNode && (
        <SendMessageAfterEditor
          node={selectedSendMessageNode}
          content={nodes.find(n => n.id === selectedSendMessageNode.id)?.data?.content || {}}
          onSave={handleSaveSendMessageContent}
          onClose={() => setSelectedSendMessageNode(null)}
        />
      )}
      {selectedSectionNode && (
        <SectionEditor
          show={true} // It's true because selectedSectionNode is not null
          nodeId={selectedSectionNode.id}
          // Pass the current content from the selected node's data
          content={selectedSectionNode.data?.content || {}}
          onSave={handleSaveSectionContent} // <--- Pass your new save handler
          onClose={() => setSelectedSectionNode(null)}
        />
      )}
      {selectedRowSectionNode && (
        <RowSectionEditor
          show={true}
          nodeId={selectedRowSectionNode.id}
          content={selectedRowSectionNode.data?.content || {}} // Access content from the selected node's data
          onSave={handleSaveRowContent}
          onClose={() => setSelectedRowSectionNode(null)}
        />
      )}
      {selectedProductSectionNode && (
        <ProductSectionEditor
          show={true} // It's true because selectedSectionNode is not null
          nodeId={selectedProductSectionNode.id}
          // Pass the current content from the selected node's data
          content={selectedProductSectionNode.data?.content || {}}
          onSave={handleSaveProductSectionContent} // <--- Pass your new save handler
          onClose={() => setSelectedProductSectionNode(null)}
        />
      )}
      {selectedProductNode && (
        <ProductEditor
          show={true}
          nodeId={selectedProductNode.id}
          content={selectedProductNode.data?.content || {}} // Access content from the selected node's data
          onSave={handleSaveProductContent}
          onClose={() => setSelectedProductNode(null)}
        />
      )}
      {selectedSingleProductNode && (
        <SingleProductEditor
          show={true} // It's true because selectedSectionNode is not null
          nodeId={selectedSingleProductNode.id}
          // Pass the current content from the selected node's data
          content={selectedSingleProductNode.data?.content || {}}
          onSave={handleSaveSingleProductContent} // <--- Pass your new save handler
          onClose={() => setSelectedSingleProductNode(null)}
        />
      )}
      {editorType === 'buttonNode' && selectedNode && (
        <ButtonEditor
          show={true}
          nodeId={selectedNode?.id}
          content={nodes.find(n => n.id === selectedNode.id)?.data?.content || {}}
          onSave={handleSaveNodeContent} // Use the unified handler
          onClose={() => {
            setSelectedNode(null);
            setEditorType(null);
          }} />
      )}
      {editorType === 'listNode' && selectedNode && (
        <ListEditor
          show={true}
          nodeId={selectedNode?.id}
          content={nodes.find(n => n.id === selectedNode.id)?.data?.content || {}}
          onSave={handleSaveNodeContent} // Use the unified handler
          onClose={() => {
            setSelectedNode(null);
            setEditorType(null);
          }} />
      )}
      {editorType === 'ecommerceNode' && selectedNode && (
        <EcommerceEditor
          show={true}
          nodeId={selectedNode?.id}
          content={nodes.find(n => n.id === selectedNode.id)?.data?.content || {}}
          onSave={handleSaveNodeContent} // Use the unified handler
          onClose={() => {
            setSelectedNode(null);
            setEditorType(null);
          }}
        />
      )}
    </div>
  );
}

export default FlowBuilder;