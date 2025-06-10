import React, { useState, useEffect } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Icon } from '@iconify/react';

const ConditionNode = React.memo(({ id, data }) => {
  const { onRemoveNode, onEditConditionNode, onCloseConditionEditor } = data;
  const content = data.content || {}; // Ensure content is an object, default to empty if null/undefined

  const [showClose, setShowClose] = useState(false);

  // Right-click handler
  const handleContextMenu = (e) => {
    e.preventDefault(); // prevent default context menu
    setShowClose(true);
  };

  // Click handler for the whole node
  const handleNodeClick = (e) => {
    // Only trigger edit if not clicking the close button
    if (!e.target.closest('.close-box')) {
      onEditConditionNode();
    }
  };

  // Function to render field conditions
  const renderFieldConditions = (fields, type) => {
    if (!fields || fields.length === 0) {
      return null;
    }

    return (
      <div className='reply-box pt-1 w-fit-content mb-2'>
        <p className="mb-1" style={{ fontSize: '8px', color: 'grey' }}>
          {type === 'system' ? 'System Fields:' : 'Custom Fields:'}
        </p>
        {fields.map((field, idx) => (
          (field.variable && field.operator) && ( // Only render if variable and operator are selected
            <p key={field.id || idx} style={{ fontSize: '8px', margin: 0 }}>
              {/* Display logical operator only if it's not the first condition and there's more than one field */}
              {idx > 0 && fields.length > 1 && (
                <span style={{ color: 'black', marginRight: '3px' }}>{logicalOperator} </span>
              )}
              <span style={{ color: 'blue' }}>if </span>
              <span >{field.variable} </span>
              <span style={{ color: 'red' }}>{field.operator} </span>
              <span style={{ color: 'black' }}>{field.value || '""'}</span>
            </p>
          )
        ))}
      </div>
    );
  };

  // Effect to hide close button after some time if node is not interacted with
  useEffect(() => {
    let timer;
    if (showClose) {
      timer = setTimeout(() => {
        setShowClose(false);
      }, 3000); // Hide after 3 seconds
    }
    return () => clearTimeout(timer);
  }, [showClose]);

  return (
    <>
      <div
        className={`content ${showClose ? 'node-highlighted' : ''}`}
        style={{ width: '100%', position: 'relative' }}
        onContextMenu={handleContextMenu}
        onClick={handleNodeClick} // Add onClick to the content div
      >
        {showClose && (
          <div className={`close-box ${showClose ? 'node-highlighted' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              if (onRemoveNode && id) {
                onRemoveNode(id);
                onCloseConditionEditor();
              }
              setShowClose(false);
            }}
            style={{
              position: 'absolute', top: -8,
              right: -6, cursor: 'pointer', fontSize: '6px', color: 'black', zIndex: 10, userSelect: 'none', border: '1px solid black', borderRadius: '50%', backgroundColor: 'white' // Added background for better visibility
            }}
            title="Remove node"
          >
            <Icon icon="ic:baseline-close" width="10" height="10" />
          </div>
        )}
        <div className="d-flex flex-column align-items-center w-100">
          <div className="d-flex align-self-start align-items-center gap-1 mb-2 p-2">
            <Icon icon='ic:baseline-greater-than-equal' width="10" height="10" />
            <p className="default-heading mb-0">Condition</p>
          </div>

          <div className="d-flex bot_flow p-1" style={{ marginBottom: '0px' }}>
            {/* These are static elements, no changes needed here unless you want to dynamically update them */}
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

          {content && (content.systemFields?.length > 0 || content.customFields?.length > 0) ? (
            <div className='p-1 d-flex flex-column align-items-center w-100'>
              {/* Render System Fields */}
              {renderFieldConditions(content.systemFields, 'system')}

              {/* Render Custom Fields */}
              {renderFieldConditions(content.customFields, 'custom')}

              {/* Display Match Type */}
              {content.matchType && (
                <div className='delay-box pt-1 w-fit-content'>
                  <p style={{ fontSize: '8px', margin: 0, color: 'blue' }}>
                    <span style={{ color: 'black' }}>Match Type: {content.matchType} </span>
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="d-flex justify-content-center align-items-center mt-2 mb-2">
              <Icon onClick={handleNodeClick} icon="mdi:cursor-pointer" width="20" height="20" color='black' style={{ cursor: 'pointer' }} />
            </div>
          )}
        </div>

        <div className="dotted-line mt-3" />

        <div className='container' style={{
          position: 'relative',
          height: 'auto',
          minHeight: '50px',
          padding: '10px 0',
          width: '100%',
        }}>
          {/* Target Handle (Reply) */}
          <div style={{ position: 'absolute', left: 0, bottom: 20, fontSize: '6px', cursor: 'pointer', paddingLeft: '13px' }}>
            Reply
            <Handle
              type="target"
              position={Position.Left}
              style={{
                left: 0, bottom: 0, width: 10,
                height: 10, borderRadius: '50%', background: 'white', border: '1px solid grey'
              }}
            />
          </div>

          {/* Source Handle (True) */}
          <div style={{ position: 'absolute', right: 10, bottom: 25, fontSize: '6px', cursor: 'pointer' }}>
            True
            <Handle type="source" position={Position.Right} id="true" style={{ // Added id="true" for distinct handle
              left: 'auto', right: -10, bottom: 5, width: 10,
              height: 10, borderRadius: '50%', background: 'white', border: '1px solid grey'
            }} />
          </div>

          {/* Source Handle (False) */}
          <div style={{ position: 'absolute', right: 10, bottom: 10, fontSize: '6px', cursor: 'pointer' }}
          >
            False
            <Handle type="source" position={Position.Right} id="false" style={{ // Changed id from "ecommerce" to "false"
              left: 'auto', right: -10, bottom: 5, width: 10,
              height: 10, borderRadius: '50%', background: 'white', border: '1px solid grey'
            }} />
          </div>
        </div>
      </div >
    </>
  );
});

export default ConditionNode;