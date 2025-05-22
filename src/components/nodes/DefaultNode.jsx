import React, { useState } from 'react';

import { Handle, Position } from '@xyflow/react';
import { Icon } from '@iconify/react';

const DefaultNode = ({ id, data, nodeContentMap, onRemoveNode }) => {
  const content = nodeContentMap?.[id];
  console.log('Node Content:', content);

  const iconMap = {
    Text: "ic:baseline-textsms",
    Image: "mdi:image-outline",
    Video: "mdi:video-outline",
    Audio: "mdi:music-note-outline",
    File: "mdi:file-document-outline",
    Location: "tabler:location",
    Whatsapp: "fluent:flowchart-20-regular"
  };
  const [showClose, setShowClose] = useState(false);

  // Right-click handler
  const handleContextMenu = (e) => {
    e.preventDefault();  // prevent default context menu
    setShowClose(true);
  };

  // Click outside the close icon or on the node (left click) hides the close icon
  const handleClick = () => {
    if (showClose) setShowClose(false);
  };


  const renderContent = () => {
    switch (data.type) {
      case 'Text':
        if (content?.type) {
          return (
            <div className='p-1 d-flex flex-column align-items-center w-100'>
              <div className='delay-box pt-1 w-fit-content'>
                <p style={{ fontSize: '8px', margin: 0, color: 'blue' }}>Delay: {content.delay} sec </p>
              </div>
              <div className='reply-box mt-1 w-fit-content'>
                <p style={{ fontSize: '8px', margin: 0, color: "grey" }}>Reply : <span style={{ color: 'black' }}>{content.text}</span>  </p>
              </div>
            </div>

          );
        }
        break;
      case 'Image':
        if (content?.image) {
          return (
            <div className='p-1 d-flex flex-column align-items-center w-100'>
              <div className='delay-box pt-1  w-fit-content'>
                <p style={{ fontSize: '8px', margin: 0, color: 'blue' }}>Delay: {content.delay} sec</p>
              </div>
              <div className='reply-box mt-1  w-fit-content'>
                <img src={content.image} alt="node-img" />
              </div>
            </div>
          );
        }
        break;
      case 'Video':
        if (content?.video) {
          return (
            <div className='p-1 d-flex flex-column align-items-center w-100'>
              <div className='delay-box pt-1  w-fit-content'>
                <p style={{ fontSize: '8px', margin: 0, color: 'blue' }}>Delay: {content.delay} sec</p>
              </div>
              <div className='reply-box mt-1  w-fit-content'>
                <video controls >
                  <source src={content.video} type="video/mp4" />
                  Your browser does not support the video element.
                </video>

              </div>
            </div>
          );
        }
        break;
      case 'Audio':
        if (content?.audio) {
          return (
            <div className='p-1 d-flex flex-column align-items-center w-100'>
              <div className='delay-box  w-fit-content pt-1'>
                <p style={{ fontSize: '8px', margin: 0, color: 'blue' }}>Delay: {content.delay} sec</p>
              </div>
              <div className='reply-box mt-1  w-fit-content'>
                <audio controls style={{ width: '100px', height: '30px' }}>
                  <source src={content.audio} type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
              </div>
            </div>
          );
        }
        break;
      case 'File':
        if (content?.file?.url && content?.file?.type) {
          const fileUrl = content.file.url;
          const fileType = content.file.type;

          if (fileType === 'application/pdf') {
            return (
              <div className='p-1 d-flex flex-column align-items-center w-100'>
                <div className='delay-box w-fit-content pt-1'>
                  <p style={{ fontSize: '8px', margin: 0, color: 'blue' }}>Delay: {content.delay} sec</p>
                </div>
                <div className='mt-1 reply-box w-fit-content'>
                  <iframe
                    src={fileUrl}
                    title="PDF Preview"
                    style={{ width: '150px', height: '100px', border: 'none' }}
                  />
                </div>
              </div>
            );
          } else if (fileType.startsWith('image/')) {
            return (
              <div className='d-flex flex-column'>
                <div className='delay-box pt-1'>
                  <p style={{ fontSize: '8px' }}>Delay: {content.delay} sec</p>
                </div>
                <div className='mt-1'>
                  <img src={fileUrl} alt={content.file.name} style={{ maxWidth: '100px' }} />
                </div>
              </div>
            );
          } else {
            return (
              <div className='d-flex flex-column'>
                <div className='delay-box pt-1'>
                  <p style={{ fontSize: '8px' }}>Delay: {content.delay} sec</p>
                </div>
                <div className='mt-1'>
                  <p style={{ fontSize: '8px' }}>Cannot preview this file type</p>
                  <a href={fileUrl} target="_blank" rel="noopener noreferrer">
                    <p style={{ fontSize: '8px', textDecoration: 'underline' }}>{content.file.name}</p>
                  </a>
                </div>
              </div>
            );
          }
        }
        break;
      case 'Location':
        if (content?.type) {
          return (
            <div className='p-1 d-flex flex-column align-items-center w-100'>
              <div className='delay-box pt-1 w-fit-content'>
                <p style={{ fontSize: '8px', margin: 0, color: 'blue' }}>Delay: {content.delay} sec </p>
              </div>
              <div className='reply-box mt-1 w-fit-content'>
                <p style={{ fontSize: '8px', margin: 0, color: "grey" }}>Reply : <span style={{ color: 'black' }}>{content.text}</span>  </p>
              </div>
            </div>

          );
        }
        break;
      case 'Whatsapp':
        if (content?.type) {
          return (
            <div className='p-1 d-flex flex-column align-items-center w-100'>
              <div className='delay-box pt-1 w-fit-content'>
                <p style={{ fontSize: '8px', margin: 0, color: 'blue' }}>Delay: {content.delay} sec </p>
              </div>
              <div className='reply-box mt-1 w-fit-content'>
                <p style={{ fontSize: '8px', margin: 0, color: "grey" }}>Selected Whatsapp Flow: <span style={{ color: 'black' }}>{content.flowType}</span>  </p>
              </div>
              <div className='reply-box mt-1 w-fit-content'>
                <p style={{ fontSize: '8px', margin: 0, color: "grey" }}>Message Header: <span style={{ color: 'black' }}>{content.field1}</span>  </p>

              </div>
              <div className='reply-box mt-1 w-fit-content'>
                <p style={{ fontSize: '8px', margin: 0, color: "grey" }}>Message Body: <span style={{ color: 'black' }}>{content.field2}</span>  </p>

              </div>
              <div className='reply-box mt-1 w-fit-content'>
                <p style={{ fontSize: '8px', margin: 0, color: "grey" }}>Message Footer: <span style={{ color: 'black' }}>{content.field3}</span>  </p>

              </div>
              <div className='reply-box mt-1 w-fit-content'>
                <p style={{ fontSize: '8px', margin: 0, color: "grey" }}>Message Button Text: <span style={{ color: 'black' }}>{content.field4}</span>  </p>

              </div>


            </div>

          );
        }
        break;
      default:
        return null;
    }



    return (
      <Icon icon="mdi:cursor-pointer" width="20" height="20" color='black' style={{ cursor: 'pointer' }} />
    );
  };

  return (
    <div
      className={`content ${showClose ? 'node-highlighted' : ''}`}
      style={{ width: '100%', position: 'relative' }}
      onContextMenu={handleContextMenu} // show close on right click
      onClick={handleClick} // hide close on left click
    >
      {showClose && (
        <div className={`close-box ${showClose ? 'node-highlighted' : ''}`} onClick={(e) => {e.stopPropagation();
            if (onRemoveNode && id) {
              onRemoveNode(id);
            } setShowClose(false); // hide close icon after removing
          }} style={{ position: 'absolute',top: -8,   right: -6, cursor: 'pointer', fontSize: '8px',
            color: 'black',zIndex: 10,userSelect: 'none',border:'1px solid black',borderRadius:'50%'
          }}
          title="Remove node"
        >
            <Icon icon="ic:baseline-close" width="15" height="15"/>
        </div>
      )}

      <div className="p-2 d-flex flex-column align-items-center w-100">
        {/* Your existing content */}
        <div className="d-flex align-self-start align-items-center gap-1 mb-3">
          <Icon icon={iconMap[data.type || data.label]} width="10" height="10" />
          <p className="default-heading mb-0">{data.type}</p>
        </div>

        <div className="d-flex bot_flow" style={{ marginBottom: '0px' }}>
          <Icon icon="hugeicons:sent" width="8" height="8" color="blue" />
          <p className="me-1 ms-1">
            Sent
            <br />
            0
          </p>
          <Icon icon="hugeicons:package-delivered" width="8" height="8" color="green" />
          <p className="me-1 ms-1">
            Delivered
            <br />
            0
          </p>
          <Icon icon="mdi:users-outline" width="8" height="8" color="yellow" />
          <p className="me-1 ms-1">
            Subscribers
            <br />
            0
          </p>
          <Icon icon="codicon:run-errors" width="8" height="8" color="red" />
          <p className="me-1 ms-1">
            Errors
            <br />
            0
          </p>
        </div>

        <div className="node-message-content text-center w-100" style={{ fontSize: '0.8em' }}>
          {renderContent()}
        </div>
      </div>

      <div className="dotted-line mt-2" />
      <div className="px-2 footer mt-2 d-flex align-self-end">
        <p>Message</p>
        <p className="ms-auto">Compose Next Message</p>
      </div>
      <Handle
        type="target"
        position={Position.Bottom}
        style={{ right: 'auto', left: 0, bottom: 20, width: 10,
    height: 10,
    borderRadius: '50%',  // Circle
    background: 'white',
    border: '1px solid grey'  }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        style={{ left: 'auto', right: -10, bottom: 20 , width: 10,
    height: 10,
    borderRadius: '50%',  // Circle
    background: 'white',
    border: '1px solid grey' }}
      />
    </div>
  );
};

export default DefaultNode;
