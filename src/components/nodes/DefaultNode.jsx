import React, { useState, memo, useEffect } from 'react';
import { Handle, Position, useUpdateNodeInternals } from '@xyflow/react';
import { Icon } from '@iconify/react';

const DefaultNode = memo(({ id, data, onRemoveNode }) => {
  const content = data.content;
   const updateNodeInternals = useUpdateNodeInternals();
  
  // console.log(content);
useEffect(() => {
        updateNodeInternals(id); // <--- Call this with the node's ID
    }, [updateNodeInternals, id]);
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

  const handleContextMenu = (e) => {
    e.preventDefault();
    setShowClose(true);
    console.log(`DefaultNode ${id}: Right-clicked to show close icon.`);
  };

  const handleClick = () => {
    if (showClose) setShowClose(false);
  };

  const renderContent = () => {
    // Check if content exists AND if it has any meaningful data for the specific type
    // This handles cases where 'content' object might be empty or specific fields are missing
    if (!content || Object.keys(content).length === 0 ||
      (data.type === 'Text' && !content.text && !content.delay) ||
      (data.type === 'Image' && !content.image && !content.delay) ||
      (data.type === 'Video' && !content.video && !content.delay) ||
      (data.type === 'Audio' && !content.audio && !content.delay) ||
      (data.type === 'File' && (!content.file || (!content.file.url && !content.file.type)) && !content.delay) ||
      (data.type === 'Location' && !content.text && !content.delay) ||
      (data.type === 'Whatsapp' && !content.flowType && !content.field1 && !content.field2 && !content.field3 && !content.field4 && !content.delay)
    ) {
      return (
        <Icon icon="mdi:cursor-pointer" width="20" height="20" color='black' style={{ cursor: 'pointer' }} />
      );
    }

    // If content exists and has data, proceed with the switch case
    switch (data.type) {
      case 'Text':
        return (
          <div className='p-1 d-flex flex-column align-items-center w-100'>
            {content.delay !== undefined && (
              <div className='delay-box pt-1 w-fit-content'>
                <p style={{ fontSize: '8px', margin: 0, color: 'blue' }}>Delay: {content.delay || 0} sec </p>
              </div>
            )}
            {content.text && (
              <div className='reply-box mt-1 w-fit-content'>
                <p style={{ fontSize: '8px', margin: 0, color: "black" }}>Reply : <span style={{ color: 'black' }}>{content.text}</span> </p>
              </div>
            )}
            {(!content.text && content.delay === undefined) && (
              <Icon icon="mdi:cursor-pointer" width="20" height="20" color='black' style={{ cursor: 'pointer' }} />
            )}
          </div>
        );
      case 'Image':
        return (
          <div className='p-1 d-flex flex-column align-items-center w-100'>
            {content.delay !== undefined && (
              <div className='delay-box pt-1 w-fit-content'>
                <p style={{ fontSize: '8px', margin: 0, color: 'blue' }}>Delay: {content.delay || 0} sec</p>
              </div>
            )}
            {content.image ?
              <div className='reply-box mt-1 w-fit-content'>

                <img src={content.image} alt="node-img" /></div> :
              ((!content.image && content.delay === undefined) && <Icon icon="mdi:cursor-pointer" width="20" height="20" color='black' style={{ cursor: 'pointer' }} />)}
          </div>
        );
      case 'Video':
        return (
          <div className='p-1 d-flex flex-column align-items-center w-100'>
            {content.delay !== undefined && (
              <div className='delay-box pt-1 w-fit-content'>
                <p style={{ fontSize: '8px', margin: 0, color: 'blue' }}>Delay: {content.delay || 0} sec</p>
              </div>
            )}
            {content.video ? (
              <div className='reply-box mt-1 w-fit-content'>
                <video controls style={{ width: '150px', height: '100px' }}>
                  <source src={content.video} type="video/mp4" />
                  Your browser does not support the video element.
                </video>
              </div>
            ) : ((!content.video && content.delay === undefined) && <Icon icon="mdi:cursor-pointer" width="20" height="20" color='black' style={{ cursor: 'pointer' }} />)}
          </div>
        );
      case 'Audio':
        return (
          <div className='p-1 d-flex flex-column align-items-center w-100'>
            {content.delay !== undefined && (
              <div className='delay-box w-fit-content pt-1'>
                <p style={{ fontSize: '8px', margin: 0, color: 'blue' }}>Delay: {content.delay || 0} sec</p>
              </div>
            )}
            {content.audio ? (
              <div className='reply-box mt-1 w-fit-content'>
                <audio controls style={{ width: '100px', height: '30px' }}>
                  <source src={content.audio} type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
              </div>
            ) : ((!content.audio && content.delay === undefined) && <Icon icon="mdi:cursor-pointer" width="20" height="20" color='black' style={{ cursor: 'pointer' }} />)}
          </div>
        );
      case 'File':
        if (content?.file?.url && content?.file?.type) {
          const fileUrl = content.file.url;
          const fileType = content.file.type;

          if (fileType === 'application/pdf') {
            return (
              <div className='p-1 d-flex flex-column align-items-center w-100'>
                {content.delay !== undefined && (
                  <div className='delay-box w-fit-content pt-1'>
                    <p style={{ fontSize: '8px', margin: 0, color: 'blue' }}>Delay: {content.delay || 0} sec</p>
                  </div>
                )}
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
                {content.delay !== undefined && (
                  <div className='delay-box pt-1'>
                    <p style={{ fontSize: '8px' }}>Delay: {content.delay || 0} sec</p>
                  </div>
                )}
                <div className='mt-1'>
                  <img src={fileUrl} alt={content.file.name} style={{ maxWidth: '100px' }} />
                </div>
              </div>
            );
          } else {
            return (
              <div className='d-flex flex-column'>
                {content.delay !== undefined && (
                  <div className='delay-box pt-1'>
                    <p style={{ fontSize: '8px' }}>Delay: {content.delay || 0} sec</p>
                  </div>
                )}
                <div className='mt-1'>
                  <p style={{ fontSize: '8px' }}>Cannot preview this file type</p>
                  <a href={fileUrl} target="_blank" rel="noopener noreferrer">
                    <p style={{ fontSize: '8px', textDecoration: 'underline' }}>{content.file.name || 'File'}</p>
                  </a>
                </div>
              </div>
            );
          }
        }
        return <Icon icon="mdi:cursor-pointer" width="20" height="20" color='black' style={{ cursor: 'pointer' }} />; // Fallback for file with no URL/type or content.delay === undefined
      case 'Location':
        return (
          <div className='p-1 d-flex flex-column align-items-center w-100'>
            {content.delay !== undefined && (
              <div className='delay-box pt-1 w-fit-content'>
                <p style={{ fontSize: '8px', margin: 0, color: 'blue' }}>Delay: {content.delay || 0} sec </p>
              </div>
            )}
            {content.text && (
              <div className='reply-box mt-1 w-fit-content'>
                <p style={{ fontSize: '8px', margin: 0, color: "black" }}>Reply : <span style={{ color: 'black' }}>{content.text}</span> </p>
              </div>
            )}
            {(!content.text && content.delay === undefined) && (
              <Icon icon="mdi:cursor-pointer" width="20" height="20" color='black' style={{ cursor: 'pointer' }} />
            )}
          </div>
        );
      case 'Whatsapp':
        return (
          <div className='p-1 d-flex flex-column align-items-center w-100'>
            {content.delay !== undefined && (
              <div className='delay-box pt-1 w-fit-content'>
                <p style={{ fontSize: '8px', margin: 0, color: 'blue' }}>Delay: {content.delay || 0} sec </p>
              </div>
            )}
            {(content.flowType || content.field1 || content.field2 || content.field3 || content.field4) ? (
              <>
                {content.flowType && (
                  <div className='reply-box mt-1 w-fit-content'>
                    <p style={{ fontSize: '8px', margin: 0, color: "black" }}>Selected Whatsapp Flow: <span style={{ color: 'black' }}>{content.flowType}</span> </p>
                  </div>
                )}
                {content.field1 && (
                  <div className='reply-box mt-1 w-fit-content'>
                    <p style={{ fontSize: '8px', margin: 0, color: "black" }}>Message Header: <span style={{ color: 'black' }}>{content.field1}</span> </p>
                  </div>
                )}
                {content.field2 && (
                  <div className='reply-box mt-1 w-fit-content'>
                    <p style={{ fontSize: '8px', margin: 0, color: "black" }}>Message Body: <span style={{ color: 'black' }}>{content.field2}</span> </p>
                  </div>
                )}
                {content.field3 && (
                  <div className='reply-box mt-1 w-fit-content'>
                    <p style={{ fontSize: '8px', margin: 0, color: "black" }}>Message Footer: <span style={{ color: 'black' }}>{content.field3}</span> </p>
                  </div>
                )}
                {content.field4 && (
                  <div className='reply-box mt-1 w-fit-content'>
                    <p style={{ fontSize: '8px', margin: 0, color: "black" }}>Message Button Text: <span style={{ color: 'black' }}>{content.field4}</span> </p>
                  </div>
                )}
              </>
            ) : ((!content.flowType && !content.field1 && !content.field2 && !content.field3 && !content.field4 && content.delay === undefined) && <Icon icon="mdi:cursor-pointer" width="20" height="20" color='black' style={{ cursor: 'pointer' }} />)}
          </div>
        );
      default:
        return (
          <Icon icon="mdi:cursor-pointer" width="20" height="20" color='black' style={{ cursor: 'pointer' }} />
        );
    }
  };

  return (
    <div
      className={`content ${showClose ? 'node-highlighted' : ''}`}
      style={{ width: '100%', position: 'relative' }}
      onContextMenu={handleContextMenu}
      onClick={handleClick}
    >
      {showClose && (
        <div className={`close-box ${showClose ? 'node-highlighted' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
             console.log(`DefaultNode ${id}: Close icon clicked.`);
            if (onRemoveNode && id) {
              console.log(`DefaultNode ${id}: Calling onRemoveNode with ID: ${id}`);
              onRemoveNode(id);
              if (data.onCloseEditor) {
                 console.log(`DefaultNode ${id}: Calling onCloseEditor.`);
                data.onCloseEditor();
              }
            }else{
              console.log(`DefaultNode ${id}: onRemoveNode or ID is missing. onRemoveNode: ${!!onRemoveNode}, id: ${id}`);
            }
            setShowClose(false);
          }}
          style={{
            position: 'absolute', top: -8, right: -6, cursor: 'pointer', fontSize: '6px',
            color: 'black', zIndex: 10, userSelect: 'none', border: '1px solid black', borderRadius: '50%'
          }}
          title="Remove node"
        >
          <Icon icon="ic:baseline-close" width="10" height="10" />
        </div>
      )}

      <div className="p-2 d-flex flex-column align-items-center w-100">
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
      {/* <div className="px-2 footer mt-2 d-flex align-self-end">
        <p>Message</p>
        <p className="ms-auto">Compose Next Message</p>
      </div> */}
     <div className='container mt-5'>
                    <div style={{ position: 'absolute', left: 0, bottom: 20, fontSize: '6px', cursor: 'pointer',paddingLeft: '13px' }}>
                         Message
                        <Handle
                            type="target"
                            position={Position.Left}
                          id='input'
                            style={{
                                left: 0, bottom: 0, width: 10,
                                height: 10, borderRadius: '50%', background: 'white', border: '1px solid grey'
                            }}
                        />
                    </div>
    
                {/* Source Handle: Schedule Sequence Message */}
                    <div style={{ position: 'absolute', right: 0, bottom: 20, fontSize: '6px', cursor: 'pointer',paddingRight: '15px' }}>
                       Compose Next Message
                        <Handle
                            type="source"
                            position={Position.Right}
                           
                            style={{
                                right: 0, bottom: 0, width: 10,
                                height: 10, borderRadius: '50%', background: 'white', border: '1px solid grey'
                            }}
                        />
                    </div>
                </div>
    
    
      {/* <Handle
        type="target"  id="input" 
        position={Position.Bottom}
        style={{
          right: 'auto', left: 0, bottom: 20, width: 10,
          height: 10,
          borderRadius: '50%',
          background: 'white',
          border: '1px solid black'
        }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        style={{
          left: 'auto', right: -10, bottom: 20, width: 10,
          height: 10,
          borderRadius: '50%',
          background: 'white',
          border: '1px solid black'
        }}
      /> */}
    </div>
  );
});

export default DefaultNode;