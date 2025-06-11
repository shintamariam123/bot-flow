import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import { saveOrUpdateBot } from '../api/botApi';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const nodeTypes = [
  { type: 'Text', icon: 'proicons:draw-text', color: 'blue' },
  { type: 'Image', icon: 'solar:gallery-add-bold', color: 'black' },
  { type: 'Video', icon: 'openmoji:youtube', color: 'red' },
  { type: 'Audio', icon: 'fluent-color:mic-16', color: 'purple' },
  { type: 'File', icon: 'codex:file', color: 'green' },
  { type: 'Location', icon: 'mingcute:location-line', color: 'purple' },
  { type: 'Whatsapp', icon: 'fluent:flowchart-16-filled', color: 'greenyellow' },
  { type: 'Interactive', icon: 'material-symbols:interactive-space', color: 'red' },
  { type: 'Condition', icon: 'ic:baseline-greater-than-equal', color: 'blue' },
  { type: 'Sequence', icon: 'ri:message-2-line', color: 'black' },
  { type: 'StackOverflow', icon: 'devicon:stackoverflow', color: 'brown' },
  { type: 'Template', icon: 'vscode-icons:folder-type-template-opened', color: 'orange' },
];

const Toolbar = ({
  nodes,
  edges,
  nodeContentMap,
  savedStartBotData,
  setNodes,
  setEdges,
  setNodeContentMap,
  setSavedStartBotData, onDashboardClick
}) => {

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);

    // 🧠 Enrich nodes with their respective data
    const enrichedNodes = nodes.map((node) => {
      if (node.type === 'defaultNode') {
        const nodeData = nodeContentMap[node.id] || {};
        return {
          ...node,
          data: {
            ...node.data,
            ...nodeData,
          },
        };
      }

      if (node.type === 'startBot') {
        return {
          ...node,
          data: {
            ...node.data,
            ...savedStartBotData,
          },
        };
      }

      return node;
    });

    // 📦 Construct payload
    const botData = {
      startBotTitle: savedStartBotData?.title || 'Untitled Bot',
      nodes: enrichedNodes,
      edges,
    };

    // ❌ Validation: ensure all non-startBot nodes are connected
    const unconnectedNodes = enrichedNodes.filter(node => {
      const isConnected = edges.some(e => e.source === node.id || e.target === node.id);
      return !isConnected && node.type !== 'startBot';
    });

    if (unconnectedNodes.length > 0) {
      toast.error('Make sure all nodes are connected before saving.');
      setIsSaving(false);
      return;
    }

    // 💾 Save or update the bot
    try {
      const response = await saveOrUpdateBot(botData);
      toast.success(response.data.message || 'Bot saved successfully!');

      // 🔄 Reset flow canvas
      setNodes([
        {
          id: 'start',
          type: 'startBot',
          position: { x: 250, y: 100 },
          data: {},
        },
      ]);
      setEdges([]);
      setNodeContentMap({});
      setSavedStartBotData(null);
    } catch (err) {
      toast.error('Error saving bot');
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDragStart = (event, type) => {
    let nodeType; // Initialize without a default value
    let contentType = type;

    if (type === 'Interactive') {
      nodeType = 'interactiveNode';
    } else if (type === 'Sequence') { // Check for Sequence first
      nodeType = 'sequenceNode';
    } else if (type === 'SendMessageAfter') {
      nodeType = 'sendMessageAfterNode';
    } else if (['Button', 'List', 'eCommerce'].includes(type)) {
      nodeType = type.toLowerCase() + 'Node';
    } else if (type === 'Condition') {
      nodeType = 'conditionNode';
    } else {
      nodeType = 'defaultNode'; // Default only if no other type matches
    }

    const transferData = JSON.stringify({ nodeType, contentType });
    event.dataTransfer.setData('application/reactflow', transferData);
    event.dataTransfer.effectAllowed = 'move';
    console.log('Toolbar: Setting dataTransfer:', transferData); // New log
  };


  return (
    <div className="button-div row">
      <div className="btn-box col-md-10">
        {nodeTypes.map(({ type, icon, color }) => (
          <button
            key={type}
            className="btn bg-light"
            draggable
            onDragStart={(e) => handleDragStart(e, type)}
            title={type}
          >
            <Icon icon={icon} width="20" height="20" color={color || 'black'} />
          </button>
        ))}
      </div>

      <div className='col-md-2'>
        <button
          onClick={handleSave}
          className="btn save-btn"
          disabled={isSaving}
        >
          {isSaving ? 'Saving...' : 'Save'}
        </button>
        <button className='btn save-dash ms-2' onClick={onDashboardClick}>Dashboard</button>
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default Toolbar;
