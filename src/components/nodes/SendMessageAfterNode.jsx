import React from 'react';
import { Handle, Position } from 'reactflow';

const SendMessageAfterNode = ({ data, id }) => { // Added id to props
  console.log(`Rendering SendMessageAfterNode with ID: ${id}`); // New log
  return (
    <div className="bg-yellow-100 border border-yellow-400 p-3 rounded-lg shadow-md text-sm w-64 relative">
      <div className="font-bold text-yellow-800">Send Message After</div>
      <p className="text-gray-700 mt-1">
        Message scheduled after a delay in sequence.
      </p>

      {/* Target Handle: Send Message After */}
      <Handle
        type="target"
        position={Position.Left}
        id="send-after"
        style={{ top: '30%', background: '#ca8a04' }}
      >
        <div className="text-xs text-white bg-yellow-700 px-2 py-1 rounded-md absolute -left-32 top-1/2 transform -translate-y-1/2">
          Send Message After
        </div>
      </Handle>

      {/* Source Handle: Schedule Msg */}
      <Handle
        type="source"
        position={Position.Right}
        id="schedule-msg"
        style={{ top: '70%', background: '#eab308' }}
      >
        <div className="text-xs text-white bg-yellow-700 px-2 py-1 rounded-md absolute left-8 top-1/2 transform -translate-y-1/2">
          Schedule Msg
        </div>
      </Handle>
    </div>
  );
};

export default SendMessageAfterNode;
