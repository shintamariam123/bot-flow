import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { Icon } from '@iconify/react';

const StartBotNode = ({ data }) => {
    const handleThumbClick = (e) => {
        e.stopPropagation();
        if (typeof data?.openEditor === 'function') {
            data.openEditor();
        }
    };
    const savedData = data.savedData;
    return (
        <div style={{width:'auto'}}>
            <div className='content p-1 d-flex flex-column align-items-center'>
                <div className='d-flex'>
                    <Icon icon="fa-solid:walking" width="15" height="15" color='black' />
                    <p className='ms-2 heading'>Start Bot Flow</p>
                </div>
                <div className='d-flex bot_flow'>
                    <Icon icon="hugeicons:sent" width="8" height="8" color='blue' />
                    <p className='me-1 ms-1'>Sent <br />0</p>
                    <Icon icon="hugeicons:package-delivered" width="8" height="8" color='green' />
                    <p className='me-1 ms-1'>Delivered <br />0</p>
                    <Icon icon="mdi:users-outline" width="8" height="8" color='yellow' />
                    <p className='me-1 ms-1'>Subscribers <br />0</p>
                    <Icon icon="codicon:run-errors" width="8" height="8" color='red' />
                    <p className='me-1 ms-1'>Errors <br />0</p>
                </div>
                <div className=''>
                    {data.savedData ? (
                        <div className='saved-info text-start'>
                            <p><strong>Keywords:</strong> {savedData.keywords}</p>
                            <p><strong>Match Type:</strong> {savedData.matchType === 'exact' ? 'Exact keyword match' : 'String match'}</p>
                            <p><strong>Title:</strong> {savedData.title}</p>
                            <p><strong>Add Label:</strong> {savedData.addLabel}</p>
                            <p><strong>Remove Label:</strong> {savedData.removeLabel}</p>
                            <p><strong>Subscribe:</strong> {savedData.subscribeSequence}</p>
                            <p><strong>Unsubscribe:</strong> {savedData.unsubscribeSequence}</p>
                            {/* <p><strong>Assign To:</strong> {savedData.assignTo}</p>
                  <p><strong>Webhook:</strong> {savedData.webhookURL}</p> */}
                        </div>
                    ) :
                        (
                            <Icon icon="mingcute:hand-finger-line" width="25" height="25" color='black' onClick={handleThumbClick} style={{ cursor: 'pointer' }} />

                        )}
                </div>
            </div>
            <Handle type="source" position={Position.Right}  />
        </div>
    );
};

export default StartBotNode;
