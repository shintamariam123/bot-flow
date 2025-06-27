import React, { useState, useEffect, useCallback } from 'react';
import { Handle, Position, useUpdateNodeInternals } from '@xyflow/react';
import { Icon } from '@iconify/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHandPointer } from '@fortawesome/free-solid-svg-icons';

const TemplateNode = React.memo(({ id, data }) => {
    const { onRemoveNode, onEditTemplateNode, onCloseTemplateEditor, spawnConnectedNode } = data;
    const content = data.content || {};

    const [showClose, setShowClose] = useState(false);
    const updateNodeInternals = useUpdateNodeInternals();

    useEffect(() => {
        updateNodeInternals(id);
    }, [data.content, data.label, updateNodeInternals, id]);

    const handleContextMenu = (e) => {
        e.preventDefault();
        setShowClose(true);
    };

    const handleNodeClick = (e) => {
        if (!e.target.closest('.close-box')) {
            onEditTemplateNode(id);
        }
    };

    useEffect(() => {
        let timer;
        if (showClose) {
            timer = setTimeout(() => {
                setShowClose(false);
            }, 3000);
        }
        return () => clearTimeout(timer);
    }, [showClose]);

    const renderContentDetails = () => {
        if (!content.selectedTemplateDetails) {
            return null;
        }

        const { header_type, button_count, buttons } = content.selectedTemplateDetails;
        const { selectedButtonFlows, uploadedImageSrc, uploadedImageName, selectedCustomFields, selectedDocumentCustomField } = content;

        switch (header_type) {
            case 'TEXT':
                if (button_count > 0 && selectedButtonFlows) {
                    return (
                        <>
                            {buttons.map((buttonName, index) => (
                               
                                <div className='reply-box mt-1 w-fit-content'>
                                    <p key={index} style={{ fontSize: '8px', margin: 0, color: "grey" }}>
                                        {buttonName}: <span style={{ color: 'black' }}>{selectedButtonFlows[buttonName] || 'Not selected'}</span>
                                    </p>
                                </div>
                            ))}
                        </>
                    );
                }
                return null;
            case 'IMAGE':
                return (
                    <>
                        {/* Display the image directly using the Base64 source */}
                        {uploadedImageSrc ? (
                            <div className="reply-box mt-1 w-fit-content" >
                                <img
                                    src={uploadedImageSrc}
                                    alt={uploadedImageName || "Uploaded Image"}

                                />
                              
                            </div >
                        ) : (
                            <p style={{ fontSize: '8px', margin: '2px 0', color: 'grey' }}>
                                No Image Selected
                            </p>
                        )}
                        {
                            selectedCustomFields && Object.keys(selectedCustomFields).length > 0 && (
                                <>
                                    {Object.entries(selectedCustomFields).map(([index, value]) => (
                                    
                                         <div className='reply-box mt-1 w-fit-content'>
                                    <p key={index} style={{ fontSize: '8px', margin: 0, color: "grey" }}>
                                          Custom Field {parseInt(index) + 1}:<span style={{ color: 'black' }}>{value}</span>
                                    </p>
                                </div>

                                    ))}
                                </>
                            )
                        }
                    </>
                );
            case 'DOCUMENT':
                return (
                    <>
                        {selectedDocumentCustomField && (

                            <div className='reply-box mt-1 w-fit-content'>
                                <p style={{ fontSize: '8px', margin: 0, color: "grey" }}>
                                    Text Button:<span style={{ color: 'black' }}>{selectedDocumentCustomField}</span>
                                </p>
                            </div>
                        )}
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <>
            <div
                className={`content ${showClose ? 'node-highlighted' : ''}`}
                style={{ width: '100%', position: 'relative' }}
                onContextMenu={handleContextMenu}
                onClick={handleNodeClick}
            >
                {showClose && (
                    <div className={`close-box ${showClose ? 'node-highlighted' : ''}`}
                        onClick={(e) => {
                            e.stopPropagation();
                            if (onRemoveNode && id) {
                                onRemoveNode(id);
                                onCloseTemplateEditor();
                            }
                            setShowClose(false);
                        }}
                        style={{
                            position: 'absolute', top: -8,
                            right: -6, cursor: 'pointer', fontSize: '6px', color: 'black', zIndex: 10, userSelect: 'none', border: '1px solid black', borderRadius: '50%', backgroundColor: 'white'
                        }}
                        title="Remove node"
                    >
                        <Icon icon="ic:baseline-close" width="10" height="10" />
                    </div>
                )}
                <div className="d-flex flex-column align-items-center w-100">
                    <div className="d-flex align-self-start align-items-center gap-1 mb-2 p-2">
                        <Icon icon='vscode-icons:folder-type-template-opened' width="10" height="10" />
                        <p className="default-heading mb-0">Template Message</p>
                    </div>

                    <div className="d-flex bot_flow p-1" >
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

                    {content.selectedTemplateName ? (
                        <div className='p-1 d-flex flex-column align-items-center w-100'>
                            <div className='reply-box mt-1 w-fit-content'>
                                <p style={{ fontSize: '8px', margin: 0, color: "grey" }}>
                                    Selected Template: <span style={{ color: 'blue' }}>{content.selectedTemplateName}
                                        {content.selectedTemplateDetails?.header_type ? `(${content.selectedTemplateDetails.header_type})` : ''}
                                    </span>
                                </p>
                            </div>

                            {renderContentDetails()}

                        </div>
                    ) : (
                        <div className="d-flex justify-content-center align-items-center">
                            <FontAwesomeIcon onClick={handleNodeClick} icon={faHandPointer} width="20" height="20" color='black' style={{ cursor: 'pointer' }} />
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
                        Compose Next Message
                        <Handle type="source" position={Position.Right} id="question"
                            style={{
                                left: 'auto', right: -10, bottom: 5, width: 10,
                                height: 10, borderRadius: '50%', background: 'white', border: '1px solid grey'
                            }} />
                    </div>
                </div>
            </div >
        </>
    );
});

export default TemplateNode;