import React, { useState, useCallback } from 'react';
import { Icon } from '@iconify/react';
import { Handle, Position } from '@xyflow/react';

const QuestionNode = React.memo(({ data, id, }) => {
    const { onEditQuestionNode, onRemoveNode, spawnConnectedNode } = data
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
            onEditQuestionNode?.(id);
        }
    }, [showClose, onEditQuestionNode, id]);


    const handleRemoveClick = useCallback((e) => {
        e.stopPropagation();

        if (onRemoveNode && id) {
            onRemoveNode(id);
        }
        setShowClose(false);
    }, [onRemoveNode, id]);

    const handleNextQuestionHandleClick = useCallback((e) => {
        e.stopPropagation(); // Prevent onNodeClick from firing
        if (spawnConnectedNode) {
            // sourceId, sourceHandleId, type of node to spawn
            spawnConnectedNode(id, 'next-question', 'questionNode');
        }
    }, [id, spawnConnectedNode]);



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
                    <Icon icon='mingcute:question-fill' width="12" height="12" /> {/* Use the actual icon for button */}
                    <p className="default-heading mb-0">New Question</p>
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




                {content.questionType ?
                    (
                        <>
                            <div className='p-1 d-flex flex-column align-items-center w-100'>
                                <div className='reply-box  pt-1 w-fit-content'>
                                    <p style={{ fontSize: '8px', margin: 0, color: 'blue', textAlign: 'center' }}>{content.questionType}  </p>
                                </div>
                                <div className='reply-box pt-1 w-fit-content'>
                                    <p style={{ fontSize: '8px', margin: 0, color: 'grey' }}>
                                         Options: {content.options && content.options.length > 0
                                            ? content.options
                                                .map(option => option.value) 
                                                .filter(value => value.trim() !== '') // Remove empty options
                                                .join(', ') 
                                            : 'No options set'}
                                    </p>
                                </div>
                                <div className='reply-box pt-1 w-fit-content'>
                                    <p style={{ fontSize: '8px', margin: 0, color: 'grey' }}>Reply type: {content.replyType}  </p>
                                </div>
                                <div className='reply-box pt-1 w-fit-content'>
                                    <p style={{ fontSize: '8px', margin: 0, color: 'grey' }}>Custom Message : {content.customMessage}  </p>
                                </div>
                                <div className='reply-box pt-1 w-fit-content'>
                                    <p style={{ fontSize: '8px', margin: 0, color: 'grey' }}>Custom field: {content.customField}  </p>
                                </div>
                                <div className='reply-box pt-1 w-fit-content'>
                                    <p style={{ fontSize: '8px', margin: 0, color: 'grey' }}>System field: {content.systemField}  </p>
                                </div>
                            </div>

                        </>
                    ) : (
                        <div className="d-flex justify-content-center align-items-center" style={{ height: '50px' }}>
                            <Icon icon="mdi:cursor-pointer" width="20" height="20" color='black' style={{ cursor: 'pointer' }} onClick={handleNodeClick} />
                        </div>
                    )}



            </div>

            <div className="dotted-line mt-2" />

            <div className='container mt-5'>
                <div style={{ position: 'absolute', left: 0, bottom: 20, fontSize: '6px', cursor: 'pointer', paddingLeft: '13px' }}>
                    Question
                    <Handle
                        type="target"
                        position={Position.Left}
                        id="question-target"
                        style={{
                            left: 0, bottom: 0, width: 10,
                            height: 10, borderRadius: '50%', background: 'white', border: '1px solid grey'
                        }}
                    />
                </div>
                <div id='next-question' style={{ position: 'absolute', right: 10, bottom: 25, fontSize: '6px', cursor: 'pointer' }}>
                    Next Question
                    <Handle type="source" id="next-question"
                        onClick={handleNextQuestionHandleClick}
                        position={Position.Right} style={{
                            left: 'auto', right: -10, bottom: 5, width: 10,
                            height: 10, borderRadius: '50%', background: 'white', border: '1px solid grey'
                        }} />
                </div>

                <div style={{ position: 'absolute', right: 10, bottom: 10, fontSize: '6px', cursor: 'pointer' }}
                // onClick={handleSubscribeClick}
                >
                    Thank you Message
                    <Handle id='thankyou' type="source" position={Position.Right} style={{
                        left: 'auto', right: -10, bottom: 5, width: 10,
                        height: 10, borderRadius: '50%', background: 'white', border: '1px solid grey'
                    }} />
                </div>
            </div>

        </div >
    );
});

export default QuestionNode;