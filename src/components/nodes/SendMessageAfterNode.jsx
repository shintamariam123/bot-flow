import React, { useState, useEffect } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Icon } from '@iconify/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHandPointer } from '@fortawesome/free-solid-svg-icons';

// Wrap the component with React.memo
const SendMessageAfterNode = React.memo(({ data, id, onRemoveNode, onEditSendMessageNode }) => {
  // console.log(`Rendering SendMessageAfterNode with ID: ${id}`);

  const [showClose, setShowClose] = useState(false);
  const [displayedContent, setDisplayedContent] = useState({});

  // Use an effect to update internal state when the data.content prop changes
  useEffect(() => {
    if (data.content) {
      setDisplayedContent(data.content);
    }
  }, [data.content]); // Dependency array: re-run when data.content changes

  // Right-click handler
  const handleContextMenu = (e) => {
    e.preventDefault();  // prevent default context menu
    setShowClose(true);
  };

  // Click outside the close icon or on the node (left click) hides the close icon
  const handleClick = () => {
    if (showClose) setShowClose(false);
  };

  const handleThumbIconClick = (e) => {
    if (showClose) {
      setShowClose(false);
    } else {
      if (onEditSendMessageNode) {
        onEditSendMessageNode(id); // Call the passed function
      }
    }

  };

  return (
    <div className={`content ${showClose ? 'node-highlighted' : ''}`}
      style={{ width: '100%', position: 'relative' }}
      onContextMenu={handleContextMenu} // show close on right click
      onClick={handleClick}>
      {showClose && (
        <div className={`close-box ${showClose ? 'node-highlighted' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            if (onRemoveNode && id) {
              onRemoveNode(id);
            }
            setShowClose(false); // hide close icon after removing
          }}
          style={{
            position: 'absolute', top: -8,
            right: -6, cursor: 'pointer', fontSize: '6px', color: 'black', zIndex: 10, userSelect: 'none', border: '1px solid black', borderRadius: '50%'
          }}
          title="Remove node">
          <Icon icon="ic:baseline-close" width="10" height="10" />
        </div>
      )}
      <div className=" d-flex flex-column align-items-center w-100">

        <div className="d-flex align-self-start align-items-center gap-1 mb-3 p-2">
          <Icon icon='rivet-icons:question-mark-solid' width="10" height="10" />
          <p className="default-heading mb-0">Send Message After</p>
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
        {displayedContent.is24HourWindowEnabled || displayedContent.isDailySequenceEnabled ?
          (
            <>
              <div className='p-1 d-flex flex-column align-items-center w-100'>
                {displayedContent.is24HourWindowEnabled && (
                  <div className='delay-box mt-1 w-fit-content'>
                    <p style={{ fontSize: '8px', margin: 0, color: "blue" }}><span style={{ color: 'blue' }}>{displayedContent.scheduleAfterTime}</span> : Inside 24 - Hour Window  </p>
                  </div>
                )}
                {displayedContent.isDailySequenceEnabled && (
                  <div className='delay-box mt-1 w-fit-content'>
                    <p style={{ fontSize: '8px', margin: 0, color: "blue" }}><span style={{ color: 'blue' }}>{displayedContent.scheduleForDay}</span> : Outside 24- Hour Window   </p>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div >
              <FontAwesomeIcon onClick={handleThumbIconClick} icon={faHandPointer} width="20" height="20" color='black' style={{ cursor: 'pointer' }} />
            </div>
          )
        }
      </div>

      <div className="dotted-line mt-3 mb-5 " />

      {/* <div className="px-2 footer mt-2 d-flex align-self-end">
        <p style={{ fontSize: '6px' }}>Send Message After</p>
      </div>

      <Handle
        type="target"
        position={Position.Bottom}
        id="send-after"
        style={{
          right: 'auto', left: 0, bottom: 15, width: 10,
          height: 10,
          borderRadius: '50%',
          background: 'white',
          border: '1px solid grey'
        }}
      /> */}
      <div className='container mt-4'>
        <div style={{ position: 'absolute', left: 0, bottom: 20, fontSize: '6px', cursor: 'pointer', paddingLeft: '13px' }}>
          Message
          <Handle
            type="target"
            position={Position.Left}
            id="send-after"
            style={{
              left: 0, bottom: 0, width: 10,
              height: 10, borderRadius: '50%', background: 'white', border: '1px solid grey'
            }}
          />
        </div>

        {/* Source Handle: Schedule Msg */}
        <div style={{ position: 'absolute', right: 10, bottom: 20, fontSize: '6px', cursor: 'pointer' }}>
          Schedule Message
          <Handle
            type="source"
            position={Position.Right}
            id="schedule-msg"
            style={{
              left: 'auto', right: -10, bottom: 5, width: 10,
              height: 10, borderRadius: '50%', background: 'white', border: '1px solid grey'
            }}
          />
        </div>

      </div>

    </div >
  );
}); // Don't forget to close the React.memo call

export default SendMessageAfterNode;