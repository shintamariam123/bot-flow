import React, { useState, useEffect } from 'react';
import { Handle, Position, useUpdateNodeInternals } from '@xyflow/react';
import { Icon } from '@iconify/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHandPointer } from '@fortawesome/free-solid-svg-icons';

// Wrap the component with React.memo
const SequenceNode = React.memo(({ data, id, onRemoveNode, onEditSequenceNode }) => {
    // console.log(`Rendering SequenceNode with ID: ${id}`);
    const [showClose, setShowClose] = useState(false);
    const [displayedContent, setDisplayedContent] = useState({});
    const updateNodeInternals = useUpdateNodeInternals();


  // SequenceNode.jsx
useEffect(() => {
    if (data.content) {
        updateNodeInternals(id); // Good for ensuring handles re-render if needed
        setDisplayedContent(data.content);
    } else {
        // Optional: Reset if content becomes null/undefined, though typically
        // data.content would retain its last saved state or be an empty object.
        setDisplayedContent({});
    }
}, [data.content, id, updateNodeInternals]); // Added id and updateNodeInternals to deps



    // Right-click handler
    const handleContextMenu = (e) => {
        e.preventDefault();  // prevent default context menu
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
            if (onEditSequenceNode) {
                onEditSequenceNode(id); // Call the passed function
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
                    <Icon icon='ri:message-2-line' width="10" height="10" />
                    <p className="default-heading mb-0">New Sequence Campaign</p>
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
                {displayedContent.campaignName ?
                    (
                        <div className='p-1 d-flex flex-column align-items-center w-100'>
                            {displayedContent.campaignName && (
                                <div className='reply-box mt-1 w-fit-content'>
                                    <p style={{ fontSize: '8px', margin: 0, color: "grey" }}>Campaign Name : <span style={{ color: 'black' }}>{displayedContent.campaignName}</span>  </p>
                                </div>
                            )}
                            {displayedContent.deliveryTime && (
                                <div className='reply-box mt-1 w-fit-content'>
                                    <p style={{ fontSize: '8px', margin: 0, color: "grey" }}>Delivery Time : <span style={{ color: 'black' }}>{displayedContent.deliveryTime}</span>  </p>
                                </div>
                            )}
                            {displayedContent.timeZone && (
                                <div className='reply-box mt-1 w-fit-content'>
                                    <p style={{ fontSize: '8px', margin: 0, color: "grey" }}>Time Zone : <span style={{ color: 'black' }}>{displayedContent.timeZone}</span>  </p>
                                </div>
                            )}
                        </div>
                    ) :
                    (
                        <div>
                            <FontAwesomeIcon onClick={handleThumbIconClick} icon={faHandPointer} width="25" height="25" color='black' style={{ cursor: 'pointer' }} />
                        </div>
                    )
                }
            </div>

            <div className="dotted-line mt-3 " />



            <div className='container mt-5'>
                <div style={{ position: 'absolute', left: 0, bottom: 20, fontSize: '6px', cursor: 'pointer', paddingLeft: '13px' }}>
                    Schedule Sequence <br /> Message
                    <Handle
                        type="target"
                        position={Position.Left}
                        id="subscribe-target"
                        style={{
                            left: 0, bottom: 0, width: 10,
                            height: 10, borderRadius: '50%', background: 'white', border: '1px solid grey'
                        }}
                    />
                </div>

                {/* Source Handle: Schedule Sequence Message */}
                <div style={{ position: 'absolute', right: 0, bottom: 20, fontSize: '6px', cursor: 'pointer', paddingRight: '15px' }}>
                    Schedule Sequence <br /> Message
                    <Handle
                        type="source"
                        position={Position.Right}
                        id="schedule-sequence-msg"
                        style={{
                            right: 0, bottom: 0, width: 10,
                            height: 10, borderRadius: '50%', background: 'white', border: '1px solid grey'
                        }}
                    />
                </div>
            </div>
        </div>
    );
});

export default SequenceNode;