import React, { useState } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Icon } from '@iconify/react';

const InteractiveNode = React.memo(({ id, data }) => {
  const { onRemoveNode, onEditInteractiveNode, onCloseInteractiveEditor, spawnConnectedNode, content } = data;

  const [showClose, setShowClose] = useState(false);

  const isContentEmpty = !content || Object.keys(content).length === 0;

  // Right-click handler
  const handleContextMenu = (e) => {
    e.preventDefault(); // prevent default context menu
    setShowClose(true);
  };

  // Click handler for the whole node
  const handleNodeClick = (e) => {
    // If the close button is showing, clicking the node body should hide it.
    // Otherwise, it should open the editor.
    if (showClose) {
      setShowClose(false);
    } else {
      // Only trigger editor on left-click (e.button === 0)
      if (e.type === 'click' && e.button === 0) {
        console.log('Calling onEditInteractiveNode for ID:', id);
         onEditInteractiveNode?.(id); // This will call the function passed from FlowBuilder
      }
    }
  };

  const iconMap = {
    Interactive: "material-symbols:interactive-space",
  };

  return (
    <>
      <div
        className={`content ${showClose ? 'node-highlighted' : ''}`}
        style={{ width: '100%', position: 'relative' }}
        onContextMenu={handleContextMenu} // show close on right click
        onClick={handleNodeClick} // Handle both hiding close and opening editor
      >
        {showClose && (
          <div className={`close-box ${showClose ? 'node-highlighted' : ''}`}
            onClick={(e) => {
              e.stopPropagation(); // Prevent the node's onClick from firing
              if (onRemoveNode && id) {
                onRemoveNode(id);
                onCloseInteractiveEditor();
              }
              setShowClose(false); // hide close icon after removing
            }}
            style={{
              position: 'absolute', top: -8,
              right: -6, cursor: 'pointer', fontSize: '6px', color: 'black', zIndex: 10, userSelect: 'none', border: '1px solid black', borderRadius: '50%'
            }}
            title="Remove node"
          >
            <Icon icon="ic:baseline-close" width="10" height="10" />
          </div>
        )}
        <div className=" d-flex flex-column align-items-center w-100">
          {/* Your existing content */}
          <div className="d-flex align-self-start align-items-center gap-1 mb-3 p-2">
            <Icon icon={iconMap[data.type]} width="10" height="10" />
            <p className="default-heading mb-0">{data.type}</p>
          </div>

          <div className="d-flex bot_flow p-1" style={{ marginBottom: '0px' }}>
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
          {!isContentEmpty && (content.type === 'text' || content.type === 'media') ? (
            <div>
              {content?.type === 'text' && (
                <div className='p-1 d-flex flex-column align-items-center w-100'>
                  <div className='delay-box pt-1 w-fit-content'>
                    <p style={{ fontSize: '8px', margin: 0, color: 'blue' }}>Delay: {content.delay} sec </p>
                  </div>
                  <div className='reply-box mt-1 w-fit-content'>
                    <p style={{ fontSize: '8px', margin: 0, color: "grey" }}>Header Text : <span style={{ color: 'black' }}>{content.body}</span>  </p>
                  </div>
                  <div className='reply-box mt-1 w-fit-content'>
                    <p style={{ fontSize: '8px', margin: 0, color: "grey" }}>Message Body : <span style={{ color: 'black' }}>{content.dropdownValue}</span>  </p>
                  </div>
                  <div className='reply-box mt-1 w-fit-content'>
                    <p style={{ fontSize: '8px', margin: 0, color: "grey" }}>Footer Text : <span style={{ color: 'black' }}>{content.footer}</span>  </p>
                  </div>
                </div>

              )}
              {content?.type === 'media' && (
                <div className='p-1 d-flex flex-column align-items-center w-100'>
                  <div className='delay-box pt-1 w-fit-content'>
                    <p style={{ fontSize: '8px', margin: 0, color: 'blue' }}>Delay: {content.delay} sec </p>
                  </div>
                  <div className='reply-box mt-1  w-fit-content'>
                    <img style={{ height: '100px' }} src={content.mediaUrl} alt="node-img" />
                  </div>
                  <div className='reply-box mt-1 w-fit-content'>
                    <p style={{ fontSize: '8px', margin: 0, color: "grey" }}>Message Body : <span style={{ color: 'black' }}>{content.dropdownValue}</span>  </p>
                  </div>
                  <div className='reply-box mt-1 w-fit-content'>
                    <p style={{ fontSize: '8px', margin: 0, color: "grey" }}>Footer Text : <span style={{ color: 'black' }}>{content.footer}</span>  </p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            // This 'thumb' icon will now only appear if content is empty.
            // The node itself will open the editor on click.
            <div className="d-flex justify-content-center align-items-center" style={{ height: '50px' }}>
              <Icon icon="mdi:thumb-up" width="20" height="20" color='black'  style={{cursor:'pointer'}}/>
            </div>
          )}
        </div>

        <div className="dotted-line mt-2 mb-5" />
        <div className="px-2 footer mt-2 d-flex align-self-end">
          <p>Reply</p>
        </div>
        {/* Four source handles */}
        <Handle type="target" position={Position.Bottom} style={{
          right: 'auto', left: 0, bottom: 20, width: 10,
          height: 10,
          borderRadius: '50%',  // Circle
          background: 'white',
          border: '1px solid grey'
        }} />

        <div className='container'>
          {/* Labels for each source handle */}
          <div style={{ position: 'absolute', right: 10, bottom: 55, fontSize: '6px' }}>
            Next
            <Handle type="source" position={Position.Right} style={{
              left: 'auto', right: -10, bottom: 5, width: 10,
              height: 10,
              borderRadius: '50%',  // Circle
              background: 'white',
              border: '1px solid grey'
            }} />
          </div>
          <div style={{ position: 'absolute', right: 10, bottom: 40, fontSize: '6px', cursor: 'pointer' }}
          >
            Buttons
            <Handle onClick={(e) => {
              e.stopPropagation();
              data?.spawnConnectedNode?.(id, "button", "button");
            }} type="source" position={Position.Right} id="button" style={{
              left: 'auto', right: -10, bottom: 5, width: 10,
              height: 10, borderRadius: '50%', background: 'white', border: '1px solid grey'
            }} />
          </div>

          <div style={{ position: 'absolute', right: 10, bottom: 25, fontSize: '6px', cursor: 'pointer' }}
            onClick={(e) => {
              e.stopPropagation();
              data?.spawnConnectedNode?.(id, "list", "list");
            }}>
            List Messages
            <Handle type="source" position={Position.Right} id="list" style={{
              left: 'auto', right: -10, bottom: 5, width: 10,
              height: 10, borderRadius: '50%', background: 'white', border: '1px solid grey'
            }} />
          </div>

          <div style={{ position: 'absolute', right: 10, bottom: 10, fontSize: '6px', cursor: 'pointer' }}
            onClick={(e) => {
              e.stopPropagation();
              data?.spawnConnectedNode?.(id, "ecommerce", "ecommerce");
            }}>
            E-commerce
            <Handle type="source" position={Position.Right} id="ecommerce" style={{
              left: 'auto', right: -10, bottom: 5, width: 10,
              height: 10, borderRadius: '50%', background: 'white', border: '1px solid grey'
            }} />
          </div>
        </div>
      </div>
    </>
  );
});

export default InteractiveNode;