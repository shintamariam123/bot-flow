import React, { useCallback, useState, useRef, useEffect, useMemo } from 'react';
import { ReactFlow, MiniMap, Controls, Background, useNodesState, useEdgesState, addEdge, MarkerType, useReactFlow } from '@xyflow/react';
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
import ConditionNode from './ConditionNode';
import ConditionEditor from '../editors/ConditionEditor';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UserInputFlowNode from './UserInputFlowNode';
import UserInputFlowEditor from '../editors/UserInputFlowEditor';
import QuestionNode from './QuestionNode';
import QuestionEditor from '../editors/QuestionEditor';
import TemplateNode from './TemplateNode';
import TemplateEditor from '../editors/TemplateEditor';



let id = 1;
const getId = () => `node_${id++}`;
const initialNodes = [
  {
    id: 'start',
    type: 'startBot',
    data: { connected: false },
    position: { x: 250, y: 50 },
  },
];

function FlowBuilder() {
  const { screenToFlowPosition, setViewport, getViewport, fitView } = useReactFlow(); const [savedStartBotData, setSavedStartBotData] = useState(null);
  const [nodeContentMap, setNodeContentMap] = useState({});
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [showStartEditor, setShowStartEditor] = useState(false);
  const [selectedDefaultNode, setSelectedDefaultNode] = useState(null);
  const [showInteractiveEditor, setShowInteractiveEditor] = useState(false);
  const [activeInteractiveNodeId, setActiveInteractiveNodeId] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null); 
  const [editorType, setEditorType] = useState(null);
  const [selectedSequenceNode, setSelectedSequenceNode] = useState(null);
  const [selectedSendMessageNode, setSelectedSendMessageNode] = useState(null);
  const [selectedSectionNode, setSelectedSectionNode] = useState(null);
  const [selectedRowSectionNode, setSelectedRowSectionNode] = useState(null);
  const [selectedProductSectionNode, setSelectedProductSectionNode] = useState(null);
  const [selectedProductNode, setSelectedProductNode] = useState(null);
  const [selectedSingleProductNode, setSelectedSingleProductNode] = useState(null);
  const [initialZoomApplied, setInitialZoomApplied] = useState(false);
  const [selectedConditionNode, setSelectedConditionNode] = useState(null);
  const [selectedUserInputFlowNode, setSelectedUserInputFlowNode] = useState(null);
  const [selectedQuestionNode, setSelectedQuestionNode] = useState(null);
    const [selectedTemplateNode, setSelectedTemplateNode] = useState(null);


  useEffect(() => {
    if (!initialZoomApplied && getViewport()) {
      const timer = setTimeout(() => {
        const viewport = getViewport();
        setViewport({ x: viewport.x, y: viewport.y, zoom: 1 }, { duration: 0 });
        setInitialZoomApplied(true);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [initialZoomApplied, setViewport, getViewport, nodes]);

  const nodesRef = useRef(nodes);

  useEffect(() => {
    nodesRef.current = nodes;
  }, [nodes]);

  const onNodeClick = useCallback((_event, node) => {
    setShowStartEditor(false);
    setSelectedDefaultNode(null);
    setShowInteractiveEditor(false);
    setActiveInteractiveNodeId(null);
    setSelectedNode(null);
    setEditorType(null);
    setSelectedSequenceNode(null);
    setSelectedSendMessageNode(null);
    setSelectedSectionNode(null);
    setSelectedRowSectionNode(null);
    setSelectedProductSectionNode(null);
    setSelectedProductNode(null);
    setSelectedSingleProductNode(null);
    setSelectedConditionNode(null);
    setSelectedUserInputFlowNode(null);
    setSelectedQuestionNode(null);
    setSelectedTemplateNode(null);

    switch (node.type) {
      case 'defaultNode':
        setSelectedDefaultNode(node);
        break;
      case 'conditionNode':
        setSelectedConditionNode(node);
        break;
      case 'questionNode':
        setSelectedQuestionNode(node);
        break;
        case 'templateNode':
        setSelectedTemplateNode(node);
        break;
      case 'buttonNode':
        setSelectedNode(node);
        setEditorType('buttonNode');
        break;
      case 'interactiveNode':
        setActiveInteractiveNodeId(node.id);
        setShowInteractiveEditor(true);
        break;
      case 'listNode':
        setSelectedNode(node);
        setEditorType('listNode'); 
        break;
      case 'ecommerceNode':
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
      case 'userInputFlowNode':
        setSelectedUserInputFlowNode(node);
        break;
      default:
        break;
    }
  }, []);

  const handleSaveDefaultNodeContent = useCallback((nodeId, content) => {
    console.log(`Saving DefaultNode content for ${nodeId}:`, content);
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
    setNodeContentMap((prev) => {
      const updated = { ...prev };
      delete updated[nodeId];
      return updated;
    });
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
    if (selectedConditionNode && selectedConditionNode.id === nodeId) {
      setSelectedConditionNode(null);
    }
    if (selectedUserInputFlowNode && selectedUserInputFlowNode.id === nodeId) {
      setSelectedUserInputFlowNode(null);
    }
    if (selectedQuestionNode && selectedQuestionNode.id === nodeId) { 
      setSelectedQuestionNode(null);
    }
     if (selectedTemplateNode && selectedTemplateNode.id === nodeId) { 
      setSelectedTemplateNode(null);
    }
  }, [setNodes, setEdges, setNodeContentMap, selectedDefaultNode, selectedConditionNode, selectedQuestionNode, activeInteractiveNodeId,selectedTemplateNode, selectedNode, selectedSequenceNode, selectedSendMessageNode, selectedSectionNode, selectedRowSectionNode, selectedProductSectionNode, selectedProductNode, selectedUserInputFlowNode]);

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
        content: {}, 
        style: {
          zIndex: 10, 
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
        zIndex: 1000, 
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
          content: {}, 
          style: {
            zIndex: 10, 
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
  }, [nodes, setNodes, setEdges]);

  const handleSubscribeToListMessage = useCallback((interactiveNodeId) => {
    const interactiveNode = nodes.find(node => node.id === interactiveNodeId);
    if (!interactiveNode) {
      console.error('InteractiveNode not found:', interactiveNodeId);
      return;
    }

    const newNodes = [];
    const newEdges = [];

    const listNodeId = getId();
    const listNodePosition = {
      x: interactiveNode.position.x + 300,
      y: interactiveNode.position.y,
    };
    const listNode = {
      id: listNodeId,
      type: 'listNode',
      position: listNodePosition,
      data: {
        label: 'New List Message',
        content: {},
        onRemoveNode: onRemoveNode,
      },
    };
    newNodes.push(listNode);

    newEdges.push({
      id: `e-${interactiveNodeId}-${listNodeId}-interactive-listmessage`,
      source: interactiveNodeId,
      sourceHandle: 'listmessage', 
      target: listNodeId,
      targetHandle: 'list-target', 
      type: 'default',
    });

    // 2. Create SectionNode
    const sectionNodeId = getId();
    const sectionNodePosition = {
      x: listNodePosition.x + 300,
      y: listNodePosition.y,
    };
    const sectionNode = {
      id: sectionNodeId,
      type: 'sectionNode',
      position: sectionNodePosition,
      data: {
        label: 'New Section',
        content: {},
        onRemoveNode: onRemoveNode,
        onEditSectionNode: (nodeId) => {
          setSelectedSectionNode(nodesRef.current.find(n => n.id === nodeId));
        },
      },
    };
    newNodes.push(sectionNode);

    // Connect ListNode 'section' handle to SectionNode 'section-target'
    newEdges.push({
      id: `e-${listNodeId}-${sectionNodeId}-list-section`,
      source: listNodeId,
      sourceHandle: 'section', 
      target: sectionNodeId,
      targetHandle: 'section-target', 
      type: 'default',
    });

    // 3. Create three RowSectionNodes
    for (let i = 0; i < 3; i++) {
      const rowNodeId = getId();
      const rowNodePosition = {
        x: sectionNodePosition.x + 300,
        y: sectionNodePosition.y + (i * 180) - 50,
      };
      const rowNode = {
        id: rowNodeId,
        type: 'rowSectionNode',
        position: rowNodePosition,
        data: {
          label: `Row ${i + 1}`,
          content: {},
          onRemoveNode: onRemoveNode,
          onEditRowSectionNode: (nodeId) => setSelectedRowSectionNode(nodes.find(n => n.id === nodeId)),
        },
      };
      newNodes.push(rowNode);

      // Connect SectionNode 'row' handle to RowSectionNode 'row-target'
      newEdges.push({
        id: `e-${sectionNodeId}-${rowNodeId}-section-row-${i}`,
        source: sectionNodeId,
        sourceHandle: 'row', 
        target: rowNodeId,
        targetHandle: 'row-target', 
        type: 'default',
      });
    }

    setNodes((nds) => [...nds, ...newNodes]);
    setEdges((eds) => [...eds, ...newEdges]);
  }, [nodes, setNodes, setEdges, onRemoveNode]);

  const handleSubscribeToProductSection = useCallback((ecommerceNodeId) => {
    const ecommerceNode = nodes.find(node => node.id === ecommerceNodeId);
    if (!ecommerceNode) { console.error('ecommerce node not found:', ecommerceNodeId); return; }
    const newNodes = [];
    const newEdges = [];
    const productSectionNodeId = getId(); 
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

        style: {
          zIndex: 10,
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
            zIndex: 10, 
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
    const singleProductNodeId = getId(); 
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
          zIndex: 10,
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

    console.log('handleSubscribeToproductSection: New nodes to add:', newNodes); 
    setNodes((nds) => {
      const updatedNodes = [...nds, ...newNodes];
      console.log('handleSubscribeToproductSection: Nodes after setNodes:', updatedNodes);
      return updatedNodes;
    });
    setEdges((eds) => [...eds, ...newEdges]);
  }, [nodes, setNodes, setEdges, onRemoveNode]);

  const handleSubscribeToQuestion = useCallback((sourceUserInputFlowNodeId) => {
    console.log('handleSubscribeToQuestion called from', sourceUserInputFlowNodeId);
    const sourceUserInputFlowNode = nodesRef.current.find(node => node.id === sourceUserInputFlowNodeId);
    if (!sourceUserInputFlowNode) {
      console.error('Source UserInputFlowNode not found:', sourceUserInputFlowNodeId);
      return;
    }

    const newNodes = [];
    const newEdges = [];

    const newQuestionNodeId = getId();
    const newQuestionNodePosition = {
      x: sourceUserInputFlowNode.position.x + 300,
      y: sourceUserInputFlowNode.position.y,
    };
    const newQuestionNode = {
      id: newQuestionNodeId,
      type: 'questionNode',
      position: newQuestionNodePosition,
      data: {
        label: `New Question`,
        content: {},
        onRemoveNode: onRemoveNode,
        onEditQuestionNode: (nodeId) => setSelectedQuestionNode(nodesRef.current.find(n => n.id === nodeId)),
        onCloseQuestionEditor: () => setSelectedQuestionNode(null),
      },
    };
    newNodes.push(newQuestionNode);

    newEdges.push({
      id: `e-${sourceUserInputFlowNodeId}-subscribe-question-${newQuestionNodeId}`,
      source: sourceUserInputFlowNodeId,
      sourceHandle: 'question',
      target: newQuestionNodeId,
      targetHandle: 'question-target',
      type: 'default',
    });

    setNodes((nds) => [...nds, ...newNodes]);
    setEdges((eds) => [...eds, ...newEdges]);
  }, [setNodes, setEdges, onRemoveNode, nodesRef, setSelectedQuestionNode]);

  const handleSubscribeToNextQuestion = useCallback((sourceQuestionNodeId) => {
    console.log('handleSubscribeToNextQuestion called from', sourceQuestionNodeId);
    const sourceQuestionNode = nodesRef.current.find(node => node.id === sourceQuestionNodeId);
    if (!sourceQuestionNode) {
      console.error('Source QuestionNode not found:', sourceQuestionNodeId);
      return;
    }

    const newNodes = [];
    const newEdges = [];

    const newQuestionNodeId = getId();
    const newQuestionNodePosition = {
      x: sourceQuestionNode.position.x + 300,
      y: sourceQuestionNode.position.y + 50,
    };
    const newQuestionNode = {
      id: newQuestionNodeId,
      type: 'questionNode',
      position: newQuestionNodePosition,
      data: {
        label: `Next Question`,
        content: {},
        onRemoveNode: onRemoveNode,
        onEditQuestionNode: (nodeId) => setSelectedQuestionNode(nodesRef.current.find(n => n.id === nodeId)),
        onCloseQuestionEditor: () => setSelectedQuestionNode(null),
      },
    };
    newNodes.push(newQuestionNode);

    newEdges.push({
      id: `e-${sourceQuestionNodeId}-${newQuestionNodeId}-next-question`,
      source: sourceQuestionNodeId,
      sourceHandle: 'next-question', 
      target: newQuestionNodeId,
      targetHandle: 'question-target',
      type: 'default',
    });

    setNodes((nds) => [...nds, ...newNodes]);
    setEdges((eds) => [...eds, ...newEdges]);
  }, [setNodes, setEdges, onRemoveNode, nodesRef, setSelectedQuestionNode]);

  const spawnConnectedNode = useCallback((sourceNodeId, sourceHandle, type) => {

    const newNodeId = getId();
    const nodeTypeMap = {
      button: 'buttonNode',
      list: 'listNode',
      ecommerce: 'ecommerceNode',
      reply: 'defaultNode',
      question: 'questionNode',
    };

    const targetHandleMap = {
      button: 'button-target',
      list: 'list-target', 
      ecommerce: 'ecommerce-target', 
      reply: 'input',
      question: 'question-target',
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
    if (sourceHandle === 'listmessage') {
      handleSubscribeToListMessage(sourceNodeId);
      return; 
    }
    if (sourceHandle === 'question') {
      handleSubscribeToQuestion(sourceNodeId);
      return; 
    }
     if (sourceHandle === 'next-question') {
      handleSubscribeToNextQuestion(sourceNodeId);
      return;
    }
    const newNode = {
      id: newNodeId,
      type: nodeTypeMap[type] || 'defaultNode', 
      position: newPosition,
      data: {
        label: `${type.charAt(0).toUpperCase() + type.slice(1)} Node`,
        type, 
        content: {},
        onRemoveNode: onRemoveNode,
        spawnConnectedNode: spawnConnectedNode, 
        onEditInteractiveNode: () => { 
          setActiveInteractiveNodeId(newNodeId);
          setShowInteractiveEditor(true);
        },
        onCloseInteractiveEditor: () => setShowInteractiveEditor(false),
        onEditEcommerceNode: (id) => { setSelectedNode(nodes.find(n => n.id === id)); setEditorType('ecommerceNode'); },
        onEditButtonNode: (id) => { setSelectedNode(nodes.find(n => n.id === id)); setEditorType('buttonNode'); },
        onSubscribeToSequence: handleSubscribeToSequence, 
        onSubscribeToProductSection: handleSubscribeToProductSection,
        onSubscribeToSingleProduct: handleSubscribeToSingleProduct,
        onEditConditionNode: (id) => setSelectedConditionNode(nodes.find(n => n.id === id)),
        onEditQuestionNode: (id) => setSelectedQuestionNode(nodes.find(n => n.id === id)),
      },
    };

    const newEdge = {
      id: `e-${sourceNodeId}-${newNodeId}`,
      source: sourceNodeId,
      sourceHandle, 
      target: newNodeId,
      targetHandle: targetHandleMap[type], 
      type: 'default',
    };

    setNodes((nds) => [...nds, newNode]);
    setEdges((eds) => [...eds, newEdge]);
  }, [setNodes, setEdges, nodes, onRemoveNode, handleSubscribeToSequence, handleSubscribeToProductSection, handleSubscribeToQuestion]); 

  const handleSaveSequenceContent = useCallback((content) => {
    if (!selectedSequenceNode) return;
    handleSaveNodeContent(selectedSequenceNode.id, content); 
    setSelectedSequenceNode(null);
  }, [selectedSequenceNode, handleSaveNodeContent]);

  const handleSaveSendMessageContent = useCallback((content) => {
    if (!selectedSendMessageNode) return;
    handleSaveNodeContent(selectedSendMessageNode.id, content); 
    setSelectedSendMessageNode(null);
  }, [selectedSendMessageNode, handleSaveNodeContent]);

  const handleSaveConditionContent = useCallback((nodeId, newContent) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === nodeId) {
          return {
            ...node,
            data: {
              ...node.data,
              content: newContent, 
            },
          };
        }
        return node;
      })
    );
  }, [setNodes]);

  const handleSaveQuestionContent = useCallback((nodeId, newContent) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === nodeId) {
          return {
            ...node,
            data: {
              ...node.data,
              content: newContent,
            },
          };
        }
        return node;
      })
    );
  }, [setNodes]);

  const handleSaveUserInputFlowContent = useCallback((nodeId, newContent) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === nodeId) {
          return {
            ...node,
            data: {
              ...node.data,
              content: newContent, 
            },
          };
        }
        return node;
      })
    );
  }, [setNodes]);
  
  const handleSaveTemplateContent = useCallback((nodeId, newContent) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === nodeId) {
          return {
            ...node,
            data: {
              ...node.data,
              content: newContent, 
            },
          };
        }
        return node;
      })
    );
  }, [setNodes]);

  const handleSaveSectionContent = useCallback((nodeId, newContent) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === nodeId) {
          return {
            ...node,
            data: {
              ...node.data,
              content: newContent, 
            },
          };
        }
        return node;
      })
    );
  }, [setNodes]);

  const handleSaveRowContent = useCallback((nodeId, content) => {
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
    setSelectedRowSectionNode(null); 
  }, [setNodes]);

  const handleSaveProductSectionContent = useCallback((nodeId, newContent) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === nodeId) {
          return {
            ...node,
            data: {
              ...node.data,
              content: newContent, 
            },
          };
        }
        return node;
      })
    );
  }, [setNodes]);

  const handleSaveProductContent = useCallback((nodeId, content) => {
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
    setSelectedProductNode(null); 
  }, [setNodes]);

  const handleSaveSingleProductContent = useCallback((nodeId, newContent) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === nodeId) {
          return {
            ...node,
            data: {
              ...node.data,
              content: newContent, 
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
            if (params.source === params.target) {
                toast.error("A node cannot connect to itself!", { position: "top-right" });
                return;
            }
            const hasExistingOutgoingConnectionFromHandle = edges.some(
                (edge) => edge.source === params.source && edge.sourceHandle === params.sourceHandle
            );

            if (hasExistingOutgoingConnectionFromHandle) {
                toast.error("This source handle already has an outgoing connection!", { position: "top-right" });
                return;
            }

            const sourceNode = nodes.find((node) => node.id === params.source);
            const targetNode = nodes.find((node) => node.id === params.target);

            if (sourceNode?.type === 'startBot' && sourceNode.data.connected) {
                toast.error("Start Bot node can only connect to one node!", { position: "top-center" });
                return;
            }

            if (targetNode?.type === 'sequenceNode' && params.targetHandle === 'subscribe-target') {
                if (sourceNode?.type === 'buttonNode' && params.sourceHandle === 'next-step') {
                } else {
                    toast.error("Sequence node can only connect from a Button node", { position: "top-right" });
                    return;
                }
            }

            setEdges((eds) => addEdge(params, eds));
            if (sourceNode?.type === 'startBot') {
                setNodes((nds) =>
                    nds.map((node) =>
                        node.id === sourceNode.id
                            ? { ...node, data: { ...node.data, connected: true } }
                            : node
                    )
                );
            }
        },
        [setEdges, nodes, edges] 
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
      if (['button', 'list', 'ecommerce', 'question'].includes(contentType.toLowerCase())) {
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
            content: {}, 
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
              content: {}, 
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
            type: contentType,
            content: {},
            onRemoveNode: onRemoveNode,
            onCloseEditor: closeDefaultNodeEditor,
            onEditInteractiveNode: () => {
              setActiveInteractiveNodeId(newNodeId);
              setShowInteractiveEditor(true);
            },
            onCloseInteractiveEditor: () => setShowInteractiveEditor(false), 
            spawnConnectedNode: spawnConnectedNode,
            onEditConditionNode: (id) => setSelectedConditionNode(nodesRef.current.find(n => n.id === id)),
            onCloseConditionEditor: () => setSelectedConditionNode(null),
            onEditUserInputFlowNode: (id) => setSelectedUserInputFlowNode(nodesRef.current.find(n => n.id === id)),
            onCloseUserInputFlowEditor: () => setSelectedUserInputFlowNode(null),
            onEditQuestionNode: (id) => setSelectedQuestionNode(nodesRef.current.find(n => n.id === id)), 
            onCloseQuestionEditor: () => setSelectedQuestionNode(null),
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
        onRemoveNode={onRemoveNode} 
      />
    ),
    interactiveNode: InteractiveNode,
    buttonNode: ButtonNode,
    listNode: ListNode,
    ecommerceNode: EcommerceNode,
    questionNode: (nodeProps) => (
      <QuestionNode
        {...nodeProps}
        onRemoveNode={onRemoveNode}
        onEditQuestionNode={() => setSelectedQuestionNode(nodeProps)}
        onCloseQuestionEditor={() => setSelectedQuestionNode(null)}
        spawnConnectedNode={spawnConnectedNode}
      />
    ),
    conditionNode: (nodeProps) => (
      <ConditionNode
        {...nodeProps}
        onRemoveNode={onRemoveNode}
        onEditConditionNode={() => {

          setSelectedConditionNode(nodeProps);
        }}
        onCloseConditionEditor={() => setSelectedConditionNode(null)}
      />
    ),
    userInputFlowNode: (nodeProps) => (
      <UserInputFlowNode
        {...nodeProps}
        onRemoveNode={onRemoveNode}
        onEditUserInputFlowNode={() => {
          setSelectedUserInputFlowNode(nodeProps);
        }}
        onCloseUserInputFlowEditor={() => setSelectedUserInputFlowNode(null)}
        spawnConnectedNode={spawnConnectedNode}
      />
    ),
     templateNode: (nodeProps) => (
      <TemplateNode
        {...nodeProps}
        onRemoveNode={onRemoveNode}
        onEditTemplateNode={() => {
          setSelectedTemplateNode(nodeProps);
        }}
        onCloseTemplateEditor={() => setSelectedTemplateNode(null)}
        spawnConnectedNode={spawnConnectedNode}
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
          console.log('FlowBuilder: received nodeId for editor:', nodeId); 
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
          console.log('FlowBuilder: received nodeId for editor:', nodeId); 
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
          console.log('FlowBuilder: received nodeId for editor:', nodeId); 
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
        if (node.type === 'defaultNode') {
          return {
            ...node,
            data: {
              ...node.data,
              onRemoveNode: onRemoveNode,
              onCloseEditor: closeDefaultNodeEditor, 
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
        } else if (node.type === 'conditionNode') { 
          return {
            ...node,
            data: {
              ...node.data,
              onRemoveNode: onRemoveNode,
              onEditConditionNode: (nodeId) => {
                console.log('FlowBuilder useEffect: received nodeId for editor:', nodeId); 
                const nodeToEdit = nodesRef.current.find(n => n.id === nodeId);
                console.log('FlowBuilder useEffect: Attempting to open editor for node:', nodeToEdit);
                setSelectedConditionNode(nodeToEdit);
              },
            },
          };
        } else if (node.type === 'userInputFlowNode') {
          return {
            ...node,
            data: {
              ...node.data,
              onRemoveNode: onRemoveNode,
              spawnConnectedNode: spawnConnectedNode, 
              onEditUserInputFlowNode: (nodeId) => setSelectedUserInputFlowNode(nodes.find(n => n.id === nodeId)),
            },
          };
        }else if (node.type === 'templateNode') {
          return {
            ...node,
            data: {
              ...node.data,
              onRemoveNode: onRemoveNode,
              spawnConnectedNode: spawnConnectedNode, 
              onEditTemplateNode: (nodeId) => setSelectedTemplateNode(nodes.find(n => n.id === nodeId)),
            },
          };
        }


        else if (node.type === 'questionNode') {
          return {
            ...node,
            data: {
              ...node.data,
              onRemoveNode: onRemoveNode,
              onEditQuestionNode: (nodeId) => {
                const nodeToEdit = nodes.find(n => n.id === nodeId);
                setSelectedQuestionNode(nodeToEdit);
              },
                spawnConnectedNode: spawnConnectedNode,
            },
          };
        }


        else if (node.type === 'sectionNode') { 
          return {
            ...node,
            data: {
              ...node.data,
              onRemoveNode: onRemoveNode,
              onEditSectionNode: (nodeId) => {
                console.log('FlowBuilder useEffect: received nodeId for editor:', nodeId); 
                const nodeToEdit = nodesRef.current.find(n => n.id === nodeId);
                console.log('FlowBuilder useEffect: Attempting to open editor for node:', nodeToEdit);
                setSelectedSectionNode(nodeToEdit);
              },
            },
          };
        } else if (node.type === 'rowSectionNode') {
          return {
            ...node,
            data: {
              ...node.data,
              onRemoveNode: onRemoveNode,
              onEditRowSectionNode: (nodeId) => setSelectedRowSectionNode(nodes.find(n => n.id === nodeId)),
            },
          };
        } else if (node.type === 'productSectionNode') { 
          return {
            ...node,
            data: {
              ...node.data,
              onRemoveNode: onRemoveNode,
              onEditProductSectionNode: (nodeId) => {
                console.log('FlowBuilder useEffect: received nodeId for editor:', nodeId); 
                const nodeToEdit = nodesRef.current.find(n => n.id === nodeId);
                console.log('FlowBuilder useEffect: Attempting to open editor for node:', nodeToEdit);
                setSelectedProductSectionNode(nodeToEdit);
              },
            },
          };
        } else if (node.type === 'productsSectionNode') { 
          return {
            ...node,
            data: {
              ...node.data,
              onRemoveNode: onRemoveNode,
              onEditProductNode: (nodeId) => setSelectedProductNode(nodes.find(n => n.id === nodeId)),
            },
          };
        } else if (node.type === 'singleProductNode') { 
          return {
            ...node,
            data: {
              ...node.data,
              onRemoveNode: onRemoveNode,
              onEditSingleProductNode: (nodeId) => {
                console.log('FlowBuilder useEffect: received nodeId for editor:', nodeId); 
                const nodeToEdit = nodesRef.current.find(n => n.id === nodeId);
                console.log('FlowBuilder useEffect: Attempting to open editor for node:', nodeToEdit);
                setSelectedSingleProductNode(nodeToEdit);
              },
            },
          };
        }
        return node;
      }));
  }, [setNodes, onRemoveNode, spawnConnectedNode, handleSubscribeToSequence, handleSubscribeToProductSection, handleSubscribeToSingleProduct, handleSubscribeToQuestion]);

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
              width: 15,
              height: 15,
            },
            style: {
              strokeWidth: 2, 
              zIndex: 1000,
            },
          }}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onNodeClick={onNodeClick}
          //  onEdgesDelete={onEdgesDelete} 
          nodeTypes={nodeTypes}
        // fitView
        >
          {/* <MiniMap /> */}
          {/* <Controls /> */}
          <Background />
        </ReactFlow>
      </div>

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

      <InteractiveNodeEditor
        show={showInteractiveEditor}
        onClose={() => {
          setShowInteractiveEditor(false);
          setActiveInteractiveNodeId(null); 
        }}
        nodeId={activeInteractiveNodeId}
        content={nodes.find(n => n.id === activeInteractiveNodeId)?.data?.content || {}}
        onSave={handleSaveNodeContent}
      />

      {selectedConditionNode && (
        <ConditionEditor
          node={selectedConditionNode}
          content={selectedConditionNode.data?.content || {}} 
          onSave={handleSaveConditionContent}
          onClose={() => setSelectedConditionNode(null)}
        />
      )}
      {selectedUserInputFlowNode && (
        <UserInputFlowEditor
          node={selectedUserInputFlowNode}
          content={selectedUserInputFlowNode.data?.content || {}} 
          onSave={handleSaveUserInputFlowContent}
          onClose={() => setSelectedUserInputFlowNode(null)}
        />
      )}
        {selectedTemplateNode && (
        <TemplateEditor
          node={selectedTemplateNode}
          content={selectedTemplateNode.data?.content || {}} 
          onSave={handleSaveTemplateContent}
          onClose={() => setSelectedTemplateNode(null)}
        />
      )}
      {selectedQuestionNode && ( 
        <QuestionEditor
          node={selectedQuestionNode}
          content={selectedQuestionNode.data?.content || {}}
          onSave={handleSaveQuestionContent}
          onClose={() => setSelectedQuestionNode(null)}
        />
      )}
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
          show={true} 
          nodeId={selectedSectionNode.id}
          content={selectedSectionNode.data?.content || {}}
          onSave={handleSaveSectionContent}
          onClose={() => setSelectedSectionNode(null)}
        />
      )}
      {selectedRowSectionNode && (
        <RowSectionEditor
          show={true}
          nodeId={selectedRowSectionNode.id}
          content={selectedRowSectionNode.data?.content || {}} 
          onSave={handleSaveRowContent}
          onClose={() => setSelectedRowSectionNode(null)}
        />
      )}
      {selectedProductSectionNode && (
        <ProductSectionEditor
          show={true} 
          nodeId={selectedProductSectionNode.id}
          content={selectedProductSectionNode.data?.content || {}}
          onSave={handleSaveProductSectionContent} 
          onClose={() => setSelectedProductSectionNode(null)}
        />
      )}
      {selectedProductNode && (
        <ProductEditor
          show={true}
          nodeId={selectedProductNode.id}
          content={selectedProductNode.data?.content || {}} 
          onSave={handleSaveProductContent}
          onClose={() => setSelectedProductNode(null)}
        />
      )}
      {selectedSingleProductNode && (
        <SingleProductEditor
          show={true} 
          nodeId={selectedSingleProductNode.id}
          content={selectedSingleProductNode.data?.content || {}}
          onSave={handleSaveSingleProductContent} 
          onClose={() => setSelectedSingleProductNode(null)}
        />
      )}
      {editorType === 'buttonNode' && selectedNode && (
        <ButtonEditor
          show={true}
          nodeId={selectedNode?.id}
          content={nodes.find(n => n.id === selectedNode.id)?.data?.content || {}}
          onSave={handleSaveNodeContent}
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
          onSave={handleSaveNodeContent} 
          onClose={() => {
            setSelectedNode(null);
            setEditorType(null);
          }}
        />
      )}
      <ToastContainer />
    </div>
  );
}

export default FlowBuilder;