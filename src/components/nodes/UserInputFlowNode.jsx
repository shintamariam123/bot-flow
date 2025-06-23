import React, { useState, useEffect } from 'react';
import { Handle, Position, useUpdateNodeInternals } from '@xyflow/react';
import { Icon } from '@iconify/react';

const UserInputFlowNode = React.memo(({ id, data }) => {
    const { onRemoveNode, onEditUserInputFlowNode, onCloseUserInputFlowEditor } = data;
    const content = data.content || {}; // Ensure content is an object, default to empty if null/undefined

    const [showClose, setShowClose] = useState(false);
    const updateNodeInternals = useUpdateNodeInternals();
    useEffect(() => {
        updateNodeInternals(id); // <--- Call this with the node's ID
    }, [data.content, data.label, updateNodeInternals, id]);

    // Right-click handler
    const handleContextMenu = (e) => {
        e.preventDefault(); // prevent default context menu
        setShowClose(true);
    };

    // Click handler for the whole node
    const handleNodeClick = (e) => {
        // Only trigger edit if not clicking the close button
        if (!e.target.closest('.close-box')) {
            onEditUserInputFlowNode(id);
        }
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
                                onCloseUserInputFlowEditor();
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
                        <Icon icon='devicon:stackoverflow' width="10" height="10" />
                        <p className="default-heading mb-0">User Input Flow</p>
                    </div>

                    <div className="d-flex bot_flow p-1" >
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

                    {content.userOption ?
                        (
                            <div className='p-1 d-flex flex-column align-items-center w-100'>
                                {content.userInput && (
                                    <div className='reply-box mt-1 w-fit-content'>
                                        <p style={{ fontSize: '8px', margin: 0, color: "grey" }}>Campaign Name : <span style={{ color: 'black' }}>{content.userInput}</span>  </p>
                                    </div>
                                )}
                                {content.webName && (
                                    <div className='reply-box mt-1 w-fit-content'>
                                        <p style={{ fontSize: '8px', margin: 0, color: "grey" }}>Webhook URL : <span style={{ color: 'black' }}>{content.webName}</span>  </p>
                                    </div>
                                )}
                                {/* {displayedContent.timeZone && (
                                    <div className='reply-box mt-1 w-fit-content'>
                                        <p style={{ fontSize: '8px', margin: 0, color: "grey" }}>Time Zone : <span style={{ color: 'black' }}>{displayedContent.timeZone}</span>  </p>
                                    </div>
                                )} */}
                            </div>
                        ) :
                        (
                            <div className="d-flex justify-content-center align-items-center">
                                <Icon onClick={handleNodeClick} icon="mdi:cursor-pointer" width="20" height="20" color='black' style={{ cursor: 'pointer' }} />
                            </div>
                        )}

                </div>

                <div className="dotted-line mt-2" />

                <div className='container' style={{
                    position: 'relative',
                    height: 'auto',
                    minHeight: '40px',
                    padding: '10px 0',
                    width: '100%',
                }}>
                    {/* Target Handle (Reply) */}
                    <div style={{ position: 'absolute', left: 0, bottom: 15, fontSize: '6px', cursor: 'pointer', paddingLeft: '13px' }}>
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
                    <div style={{ position: 'absolute', right: 10, bottom: 15, fontSize: '6px', cursor: 'pointer' }}
                    >
                        First Question
                        <Handle type="source" position={Position.Right} id="first" style={{ // Changed id from "ecommerce" to "false"
                            left: 'auto', right: -10, bottom: 5, width: 10,
                            height: 10, borderRadius: '50%', background: 'white', border: '1px solid grey'
                        }} />
                    </div>
                </div>
            </div >
        </>
    );
});

export default UserInputFlowNode;