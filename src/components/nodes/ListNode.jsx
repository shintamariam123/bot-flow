import React, { useState, useCallback } from 'react';
import { Icon } from '@iconify/react';

import { Handle, Position } from '@xyflow/react';

const ListNode = React.memo(({ data, id }) => {
    const { onEditListNode, onRemoveNode, onSubscribeToSection } = data
    const [showClose, setShowClose] = useState(false);
    const content = data.content;

    // Right-click handler
    const handleContextMenu = (e) => {
        e.preventDefault();  // prevent default context menu
        setShowClose(true);
    };

    // Click outside the close icon or on the node (left click) hides the close icon
    const handleClick = () => {
        if (showClose) setShowClose(false);
    };
    const handleRemoveClick = useCallback((e) => {
        e.stopPropagation();

        if (onRemoveNode && id) {
            onRemoveNode(id);
        } 
        setShowClose(false);
    }, [onRemoveNode, id]);

        const handleSectionClick = useCallback((e) => {
             e.stopPropagation();
              console.log('Triggering handleSubscribeToSection for list node:', id);
             onSubscribeToSection?.(id);
         }, [onSubscribeToSection, id]);
     

    return (
        <div
            className={`content ${showClose ? 'node-highlighted' : ''}`}
            style={{ width: '100%', position: 'relative' }}
            onContextMenu={handleContextMenu} // show close on right click
            onClick={handleClick} >
            {showClose && (
                <div className={`close-box ${showClose ? 'node-highlighted' : ''}`}
                    onClick={handleRemoveClick}
                    style={{
                        position: 'absolute', top: -8, right: -6, cursor: 'pointer', fontSize: '8px',
                        color: 'black', zIndex: 10, userSelect: 'none', border: '1px solid black', borderRadius: '50%'
                    }}
                    title="Remove node"
                >
                    <Icon icon="ic:baseline-close" width="15" height="15" />
                </div>
            )}

            <div className="p-2 d-flex flex-column align-items-center w-100">
                <div className="d-flex align-self-start align-items-center gap-1 mb-3">
                    <Icon icon='majesticons:chat-text' width="10" height="10" />
                    <p className="default-heading mb-0">Quick Reply</p>
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

                {content.label ? (
                    <div className='p-1 d-flex flex-column align-items-center w-100'>
                        <div className='delay-box pt-1 w-fit-content'>
                            <p style={{ fontSize: '8px', margin: 0, color: 'blue' }}>{content.label} </p>
                        </div>

                    </div>
                ) : (
                    <div className="d-flex justify-content-center align-items-center" style={{ height: '50px' }}>
                        <Icon icon="mdi:thumb-up" width="20" height="20" color='black' style={{ cursor: 'pointer' }} />
                    </div>
                )}
            </div>

            <div className="dotted-line mt-2" />
            <div className="px-2 footer mt-3 d-flex align-self-end">
                <p>Message</p>
            </div>
            <Handle
                type="target" id="list-target"
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
                Sections
                <Handle onClick={handleSectionClick}  type="source" position={Position.Right} id="section" style={{
                    left: 'auto', right: -10, bottom: 5, width: 10,
                    height: 10, borderRadius: '50%', background: 'white', border: '1px solid grey'
                }} />
            </div>



        </div>
    );
});

export default ListNode;
