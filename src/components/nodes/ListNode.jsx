// ButtonNode.jsx
import React, { useState } from 'react';
import { Icon } from '@iconify/react';

import { Handle, Position } from '@xyflow/react';

const ListNode = ({ data, id, onEditListNode,onRemoveNode }) => {

    const [showClose, setShowClose] = useState(false);
    //   const content = nodeContentMap[id];

    // Right-click handler
    const handleContextMenu = (e) => {
        e.preventDefault();  // prevent default context menu
        setShowClose(true);
    };

    // Click outside the close icon or on the node (left click) hides the close icon
    const handleClick = () => {
        if (showClose) setShowClose(false);
    };

    return (
        <div
            className={`content ${showClose ? 'node-highlighted' : ''}`}
            style={{ width: '100%', position: 'relative' }}
            onContextMenu={handleContextMenu} // show close on right click
            onClick={handleClick} // hide close on left click
        >
            {showClose && (
                <div className={`close-box ${showClose ? 'node-highlighted' : ''}`} onClick={(e) => {
                    e.stopPropagation();
                    if (onRemoveNode && id) {
                        onRemoveNode(id);
                        onClose();
                    } setShowClose(false); // hide close icon after removing
                }} style={{
                    position: 'absolute', top: -8, right: -6, cursor: 'pointer', fontSize: '8px',
                    color: 'black', zIndex: 10, userSelect: 'none', border: '1px solid black', borderRadius: '50%'
                }}
                    title="Remove node"
                >
                    <Icon icon="ic:baseline-close" width="15" height="15" />
                </div>
            )}

            <div className="p-2 d-flex flex-column align-items-center w-100">
                {/* Your existing content */}
                <div className="d-flex align-self-start align-items-center gap-1 mb-3">
                    <Icon icon={[data.type || data.label]} width="10" height="10" />
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


                <div>

                    <div className='p-1 d-flex flex-column align-items-center w-100'>
                        <div className='delay-box pt-1 w-fit-content'>
                            <p style={{ fontSize: '8px', margin: 0, color: 'blue' }}>Delay:  sec </p>
                        </div>

                    </div>



                </div>

                <div>

                    <Icon icon="mdi:cursor-pointer" width="20" height="20" color='black' style={{ cursor: 'pointer' }}
                        onClick={() => {
                            if (onEditListNode && id) {
                                onEditListNode(id);  // Trigger the editor
                            }
                        }}
                    />
                </div>

            </div>

            <div className="dotted-line mt-2" />
            <div className="px-2 footer mt-3 d-flex align-self-end">
                <p>Message</p>
            </div>
            <Handle
                type="target"
                position={Position.Bottom}
                style={{
                    right: 'auto', left: 0, bottom: 20, width: 10,
                    height: 10,
                    borderRadius: '50%',  // Circle
                    background: 'white',
                    border: '1px solid grey'
                }}
            />
            <div style={{ position: 'absolute', right: 10, bottom: 25, fontSize: '6px', cursor: 'pointer' }}
            >
                Next
                <Handle type="source" position={Position.Right} id="list" style={{
                    left: 'auto', right: -10, bottom: 5, width: 10,
                    height: 10, borderRadius: '50%', background: 'white', border: '1px solid grey'
                }} />
            </div>

            <div style={{ position: 'absolute', right: 10, bottom: 10, fontSize: '6px', cursor: 'pointer' }}
            >
                Subscribe to sequence
                <Handle type="source" position={Position.Right} id="ecommerce" style={{
                    left: 'auto', right: -10, bottom: 5, width: 10,
                    height: 10, borderRadius: '50%', background: 'white', border: '1px solid grey'
                }} />
            </div>

        </div>
    );
};

export default ListNode;
