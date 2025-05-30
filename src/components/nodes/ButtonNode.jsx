// ButtonNode.jsx
import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import { Handle, Position } from '@xyflow/react';

const ButtonNode = ({ data, id, onEditButtonNode, onRemoveNode, nodeContentMap, onSubscribeToSequence}) => {

    const content = nodeContentMap[id] || {};
    // console.log('ButtonNode content:', content);

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
                    position: 'absolute', top: -8, right: -6, cursor: 'pointer', fontSize: '6px',
                    color: 'black', zIndex: 10, userSelect: 'none', border: '1px solid black', borderRadius: '50%'
                }}
                    title="Remove node"
                >
                    <Icon icon="ic:baseline-close" width="10" height="10" />
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



                {content.buttonName ? (
                    <div className='p-1 d-flex flex-column align-items-center w-100'>
                        <div className='reply-box pt-1 w-fit-content'>
                            <p style={{ fontSize: '8px', margin: 0, color: 'grey' }}>
                                Button: <span style={{ color: 'black' }}> {content.buttonName} </span>
                            </p>
                        </div>
                        <div className='reply-box mt-1 w-fit-content'>
                            <p style={{ fontSize: '8px', margin: 0, color: "grey" }}>Action Type : <span style={{ color: 'black' }}>{content.actionType}</span>  </p>
                        </div>

                        {/* Display additional info based on actionType  */}
                        {content.actionType === 'send' && (

                            <>
                                {content.formData?.addLabel &&
                                    <div className='reply-box mt-1 w-fit-content'>
                                        <p style={{ fontSize: '8px', margin: 0, color: "grey" }}>Add Label: <span style={{ color: 'black' }}>{content.formData.addLabel}</span>  </p>
                                    </div>}
                                {content.formData?.removeLabel &&
                                    <div className='reply-box mt-1 w-fit-content'>
                                        <p style={{ fontSize: '8px', margin: 0, color: "grey" }}>Remove Label: <span style={{ color: 'black' }}>{content.formData.removeLabel}</span>  </p>
                                    </div>}
                                {content.formData?.subscribeSequence &&
                                    <div className='reply-box mt-1 w-fit-content'>
                                        <p style={{ fontSize: '8px', margin: 0, color: "grey" }}>Subscribe: <span style={{ color: 'black' }}>{content.formData.subscribeSequence}</span>  </p>
                                    </div>}
                                {content.formData?.unsubscribeSequence &&
                                    <div className='reply-box mt-1 w-fit-content'>
                                        <p style={{ fontSize: '8px', margin: 0, color: "grey" }}>Unsubscribe: <span style={{ color: 'black' }}>{content.formData.unsubscribeSequence}</span>  </p>
                                    </div>}
                                {content.formData?.assignTo &&
                                    <div className='reply-box mt-1 w-fit-content'>
                                        <p style={{ fontSize: '8px', margin: 0, color: "grey" }}>Assign To: <span style={{ color: 'black' }}>{content.formData.assignTo}</span>  </p>
                                    </div>}
                                {content.formData?.webhookURL &&
                                    <div className='reply-box mt-1 w-fit-content'>
                                        <p style={{ fontSize: '8px', margin: 0, color: "grey" }}>Webhook: <span style={{ color: 'black' }}>{content.formData.webhookURL}</span>  </p>
                                    </div>}

                            </>
                        )}
                        {content.actionType === 'flow' && content.formData?.flowName && (
                            <div className='reply-box mt-1 w-fit-content'>
                                <p style={{ fontSize: '8px', margin: 0, color: "grey" }}>Start Flow: <span style={{ color: 'black' }}>{content.formData.flowName}</span>  </p>
                            </div>
                        )}

                        {content.actionType === 'system' && content.formData?.systemAction && (
                            <div className='reply-box mt-1 w-fit-content'>
                                <p style={{ fontSize: '8px', margin: 0, color: "grey" }}>System Action: <span style={{ color: 'black' }}>{content.formData.systemAction}</span>  </p>
                            </div>
                        )}


                    </div>



                ) : (
                    <div>
                        <Icon icon="mdi:cursor-pointer" width="20" height="20" color='black' style={{ cursor: 'pointer' }}
                            onClick={() => {
                                if (onEditButtonNode && id) {
                                    onEditButtonNode(id);  // Trigger the editor
                                }
                            }}
                        />
                    </div>
                )
                }
            </div>

            <div className="dotted-line mt-2" />
            <div className="px-2 footer mt-3 d-flex align-self-end">
                <p>Message</p>
            </div>
            <Handle type="target" position={Position.Bottom} style={{
                right: 'auto', left: 0, bottom: 20, width: 10,
                height: 10,
                borderRadius: '50%',  // Circle
                background: 'white',
                border: '1px solid grey'
            }} />
            <div style={{ position: 'absolute', right: 10, bottom: 25, fontSize: '6px', cursor: 'pointer' }}>
                Next
                <Handle id='next' type="source" position={Position.Right}  style={{
                    left: 'auto', right: -10, bottom: 5, width: 10,
                    height: 10, borderRadius: '50%', background: 'white', border: '1px solid grey'
                }} />
            </div>

            <div style={{ position: 'absolute', right: 10, bottom: 10, fontSize: '6px', cursor: 'pointer' }}
              onClick={(e) => {
                    e.stopPropagation();
                    if (onSubscribeToSequence && id) {
                        onSubscribeToSequence(id); // Just pass the node ID
                    }
                 }}>
                Subscribe to sequence
                <Handle id='subscribe' type="source" position={Position.Right} style={{
                    left: 'auto', right: -10, bottom: 5, width: 10,
                    height: 10, borderRadius: '50%', background: 'white', border: '1px solid grey'
                }} />
            </div>

        </div>
    );
};

export default React.memo(ButtonNode);
