import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { Icon } from '@iconify/react';

const DefaultNode = ({ id, data, nodeContentMap }) => {
  const content = nodeContentMap?.[id];
  console.log('Node Content:', content);

  return (
    <div className='content p-1 d-flex flex-column align-items-center'>
      <div className='d-flex'>
        <p className='default-heading'>{data.type}</p>
      </div>

      <div className='d-flex bot_flow'>
        <Icon icon="hugeicons:sent" width="8" height="8" color='blue' />
        <p className='me-1 ms-1'>Sent <br />0</p>
        <Icon icon="hugeicons:package-delivered" width="8" height="8" color='green' />
        <p className='me-1 ms-1'>Delivered <br />0</p>
        <Icon icon="mdi:users-outline" width="8" height="8" color='yellow' />
        <p className='me-1 ms-1'>Subscribers <br />0</p>
        <Icon icon="codicon:run-errors" width="8" height="8" color='red' />
        <p className='me-1 ms-1'>Errors <br />0</p>
      </div>

      <div className="node-message-content mt-2 text-center" style={{ fontSize: '0.8em' }}>
        {data.type === 'Text' && content?.type ? (
          <>
            <div className='d-flex flex-column'>
              <div><p style={{ fontSize: '8px' }}>Delay: {content.delay} sec</p></div>
              <div><p style={{ fontSize: '8px' }}>Reply: {content.text}</p></div>
            </div>
          </>
        ) : (
          <Icon icon="mingcute:hand-finger-line" width="25" height="25" color='black' style={{ cursor: 'pointer' }} />
        )}

        {data.type === 'Image' && content?.url ? (
          <>
            <strong>Image URL:</strong><br />
            <img src={content.url} alt="node-img" style={{ maxWidth: '100px' }} />
          </>
        ) : data.type === 'image' ? (
          <Icon icon="mingcute:hand-finger-line" width="25" height="25" color='black' style={{ cursor: 'pointer' }} />
        ) : null}

        {data.type === 'youtube' && content?.url ? (
          <>
            <strong>YouTube URL:</strong><br />
            <a href={content.url} target="_blank" rel="noopener noreferrer">{content.url}</a>
          </>
        ) : data.type === 'youtube' ? (
          <Icon icon="mingcute:hand-finger-line" width="25" height="25" color='black' style={{ cursor: 'pointer' }} />
        ) : null}

        {data.type === 'file' && content?.filename ? (
          <>
            <strong>File:</strong> {content.filename}
          </>
        ) : data.type === 'file' ? (
          <Icon icon="mingcute:hand-finger-line" width="25" height="25" color='black' style={{ cursor: 'pointer' }} />
        ) : null}

        {data.type === 'location' && content?.lat && content?.lng ? (
          <>
            <strong>Location:</strong><br />
            Lat: {content.lat}, Lng: {content.lng}
          </>
        ) : data.type === 'location' ? (
          <Icon icon="mingcute:hand-finger-line" width="25" height="25" color='black' style={{ cursor: 'pointer' }} />
        ) : null}
      </div>

      <Handle type="target" position={Position.Left}  />
      <Handle type="source" position={Position.Right}  />
    </div>
  );
};

export default DefaultNode;
