import React, { useState, useCallback } from 'react';
import { Icon } from '@iconify/react';
import { Handle, Position } from '@xyflow/react';

const ButtonNode = React.memo(({ data, id, }) => {
    const { onEditButtonNode, onRemoveNode, onSubscribeToSequence } = data
    const content = data.content;
    const [showClose, setShowClose] = useState(false);

    // Right-click handler to show the close button
    const handleContextMenu = useCallback((e) => {
        e.preventDefault();
        setShowClose(true);
        console.log(`ButtonNode ${id}: Right-clicked to show close icon.`);
    }, [id]);

    const handleNodeClick = useCallback((e) => {
        if (e.target.closest('.react-flow__handle') || e.target.closest('.close-box')) {
            return;
        }
        if (showClose) {
            setShowClose(false);
        } else {
            onEditButtonNode?.(id);
        }
    }, [showClose, onEditButtonNode, id]);


    const handleRemoveClick = useCallback((e) => {
        e.stopPropagation();

        if (onRemoveNode && id) {
            onRemoveNode(id);
        }
        setShowClose(false);
    }, [onRemoveNode, id]);

    const handleSubscribeClick = useCallback((e) => {
        e.stopPropagation();
        onSubscribeToSequence?.(id);
    }, [onSubscribeToSequence, id]);

    const iconMap = {
        Button: "mdi:button-cursor",
    };


    return (
        <div
            className={`content ${showClose ? 'node-highlighted' : ''}`}
            style={{ width: '100%', position: 'relative' }}
            onContextMenu={handleContextMenu} // show close on right click
            // Unified click handler for the node body
        >
            {showClose && (
                <div className={`close-box ${showClose ? 'node-highlighted' : ''}`}
                    onClick={handleRemoveClick}

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
                    <Icon icon={iconMap.Button} width="10" height="10" /> {/* Use the actual icon for button */}
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

                {/* Display content or the "click to add content" icon */}
                {content.buttonName ? (
                    <div className='p-1 d-flex flex-column align-items-center w-100'>
                        <div className='reply-box pt-1 w-fit-content'>
                            <p style={{ fontSize: '8px', margin: 0, color: 'grey' }}>
                                Button: <span style={{ color: 'black' }}> {content.buttonName} </span>
                            </p>
                        </div>
                        <div className='reply-box mt-1 w-fit-content'>
                            <p style={{ fontSize: '8px', margin: 0, color: "grey" }}>Action Type : <span style={{ color: 'black' }}>{content.actionType}</span></p>
                        </div>

                        {content.actionType === 'send' && (
                            <>
                                {content.formData?.addLabel &&
                                    <div className='reply-box mt-1 w-fit-content'>
                                        <p style={{ fontSize: '8px', margin: 0, color: "grey" }}>Add Label: <span style={{ color: 'black' }}>{content.formData.addLabel}</span></p>
                                    </div>}
                                {content.formData?.removeLabel &&
                                    <div className='reply-box mt-1 w-fit-content'>
                                        <p style={{ fontSize: '8px', margin: 0, color: "grey" }}>Remove Label: <span style={{ color: 'black' }}>{content.formData.removeLabel}</span></p>
                                    </div>}
                                {content.formData?.subscribeSequence &&
                                    <div className='reply-box mt-1 w-fit-content'>
                                        <p style={{ fontSize: '8px', margin: 0, color: "grey" }}>Subscribe: <span style={{ color: 'black' }}>{content.formData.subscribeSequence}</span></p>
                                    </div>}
                                {content.formData?.unsubscribeSequence &&
                                    <div className='reply-box mt-1 w-fit-content'>
                                        <p style={{ fontSize: '8px', margin: 0, color: "grey" }}>Unsubscribe: <span style={{ color: 'black' }}>{content.formData.unsubscribeSequence}</span></p>
                                    </div>}
                                {content.formData?.assignTo &&
                                    <div className='reply-box mt-1 w-fit-content'>
                                        <p style={{ fontSize: '8px', margin: 0, color: "grey" }}>Assign To: <span style={{ color: 'black' }}>{content.formData.assignTo}</span></p>
                                    </div>}
                                {content.formData?.webhookURL &&
                                    <div className='reply-box mt-1 w-fit-content'>
                                        <p style={{ fontSize: '8px', margin: 0, color: "grey" }}>Webhook: <span style={{ color: 'black' }}>{content.formData.webhookURL}</span></p>
                                    </div>}
                            </>
                        )}
                        {content.actionType === 'flow' && content.formData?.flowName && (
                            <div className='reply-box mt-1 w-fit-content'>
                                <p style={{ fontSize: '8px', margin: 0, color: "grey" }}>Start Flow: <span style={{ color: 'black' }}>{content.formData.flowName}</span></p>
                            </div>
                        )}
                        {content.actionType === 'system' && content.formData?.systemAction && (
                            <div className='reply-box mt-1 w-fit-content'>
                                <p style={{ fontSize: '8px', margin: 0, color: "grey" }}>System Action: <span style={{ color: 'black' }}>{content.formData.systemAction}</span></p>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="d-flex justify-content-center align-items-center" style={{ height: '50px' }}>
                        <Icon icon="mdi:cursor-pointer" width="20" height="20" color='black' style={{ cursor: 'pointer' }}  onClick={handleNodeClick}/>
                    </div>
                )}
            </div>

            <div className="dotted-line mt-2" />
          
            <div className='container mt-5'>
             <div style={{ position: 'absolute', left: 0, bottom: 20, fontSize: '6px', cursor: 'pointer',paddingLeft: '13px' }}>
                                     Message
                                    <Handle
                                        type="target"
                                        position={Position.Left}
                                    id="button-target" 
                                        style={{
                                            left: 0, bottom: 0, width: 10,
                                            height: 10, borderRadius: '50%', background: 'white', border: '1px solid grey'
                                        }}
                                    />
                                </div>
            <div style={{ position: 'absolute', right: 10, bottom: 25, fontSize: '6px', cursor: 'pointer' }}>
                Next
                <Handle id='next-step' type="source" position={Position.Right} style={{
                    left: 'auto', right: -10, bottom: 5, width: 10,
                    height: 10, borderRadius: '50%', background: 'white', border: '1px solid grey'
                }} />
            </div>

            <div style={{ position: 'absolute', right: 10, bottom: 10, fontSize: '6px', cursor: 'pointer' }}
                onClick={handleSubscribeClick}>
                Subscribe to sequence
                <Handle id='subscribe' type="source" position={Position.Right} style={{
                    left: 'auto', right: -10, bottom: 5, width: 10,
                    height: 10, borderRadius: '50%', background: 'white', border: '1px solid grey'
                }} />
            </div>
            </div>

        </div>
    );
});

export default ButtonNode;