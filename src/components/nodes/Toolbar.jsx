import React from 'react';
import { Icon } from '@iconify/react';

const nodeTypes = [
  { type: 'Text', icon: 'proicons:draw-text', color: 'blue' },
  { type: 'Image', icon: 'solar:gallery-add-bold', color: 'black' },
  { type: 'YouTube', icon: 'openmoji:youtube' },
  { type: 'Voice', icon: 'fluent-color:mic-16' },
  { type: 'File', icon: 'codex:file', color: 'green' },
  { type: 'Location', icon: 'mingcute:location-line', color: 'purple' },
  { type: 'Share', icon: 'material-symbols:share-outline', color: 'greenyellow' },
  { type: 'Computer', icon: 'icon-park:add-computer', color: 'red' },
  { type: 'Logic', icon: 'ic:baseline-greater-than-equal', color: 'blue' },
  { type: 'Message', icon: 'ri:message-2-line', color: 'grey' },
  { type: 'StackOverflow', icon: 'devicon:stackoverflow', color: 'brown' },
  { type: 'Template', icon: 'vscode-icons:folder-type-template-opened', color: 'orange' },
];

const Toolbar = () => {
  const handleDragStart = (event, type) => {
    event.dataTransfer.setData('application/reactflow', type);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="button-div">
      <div className="btn-box">
        {nodeTypes.map(({ type, icon, color }) => (
          <button
            key={type}
            className="btn bg-light"
            draggable
            onDragStart={(e) => handleDragStart(e, type)}
          >
            <Icon icon={icon} width="20" height="20" color={color || 'black'} />
          </button>
        ))}
      </div>
      <div>
        <button className="btn save-btn">Save</button>
      </div>
    </div>
  );
};

export default Toolbar;
