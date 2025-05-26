import React from 'react';
import { Handle, Position } from 'reactflow';

const SequenceNode = ({ data, id }) => { // Added id to props
  console.log(`Rendering SequenceNode with ID: ${id}`); // New log
  return (
    <div className="bg-purple-100 border border-purple-400 p-3 rounded-lg shadow-md text-sm w-64 relative">
      <div className="font-bold text-purple-800">Sequence Node</div>
      <p className="text-gray-700 mt-1">Configure a sequence of messages to be sent.</p>

      {/* Target Handle: Setup New Sequence */}
      <Handle
        type="target"
        position={Position.Left}
        id="setup-sequence"
        style={{ top: '30%', background: '#7e22ce' }}
      >
        <div className="text-xs text-white bg-purple-700 px-2 py-1 rounded-md absolute -left-28 top-1/2 transform -translate-y-1/2">
          Setup New Sequence
        </div>
      </Handle>

      {/* Source Handle: Schedule Sequence Message */}
      <Handle
        type="source"
        position={Position.Right}
        id="schedule-sequence-msg"
        style={{ top: '70%', background: '#9333ea' }}
      >
        <div className="text-xs text-white bg-purple-700 px-2 py-1 rounded-md absolute left-8 top-1/2 transform -translate-y-1/2">
          Schedule Sequence Message
        </div>
      </Handle>
    </div>
  );
};

export default SequenceNode;