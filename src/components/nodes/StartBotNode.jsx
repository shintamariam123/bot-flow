import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { Icon } from '@iconify/react';

const StartBotNode = React.memo(({ data }) => {
    const handleThumbClick = (e) => {
        e.stopPropagation();
        if (typeof data?.openEditor === 'function') {
            data.openEditor();
        }
    };
    const savedData = data.savedData;
    return (
        <div className='content' >
            <div className=' p-2 d-flex flex-column align-items-center w-100'>
                <div className='d-flex align-self-start'>
                    <Icon icon="fa-solid:walking" width="15" height="15" color='black' />
                    <p className='ms-2 heading '>Start Bot Flow</p>
                </div>
                <div style={{ marginBottom: '0px' }} className='d-flex bot_flow px-1'>
                    <Icon icon="hugeicons:sent" width="8" height="8" color='blue' />
                    <p className='me-1 ms-1'>Sent <br />0</p>
                    <Icon icon="hugeicons:package-delivered" width="8" height="8" color='green' />
                    <p className='me-1 ms-1'>Delivered <br />0</p>
                    <Icon icon="mdi:users-outline" width="8" height="8" color='yellow' />
                    <p className='me-1 ms-1'>Subscribers <br />0</p>
                    <Icon icon="codicon:run-errors" width="8" height="8" color='red' />
                    <p className='me-1 ms-1'>Errors <br />0</p>
                </div>

                {data.savedData ? (
                    <div style={{ marginTop: '0px' }} className='saved-info text-start w-100'>
                        <p><strong>Keywords:</strong> {savedData.keywords}</p>
                        <p><strong>Match Type:</strong> {savedData.matchType === 'exact' ? 'Exact keyword match' : 'String match'}</p>
                        <p><strong>Title:</strong> {savedData.title}</p>
                        <p><strong>Add Label:</strong> {savedData.addLabel}</p>
                        <p><strong>Remove Label:</strong> {savedData.removeLabel}</p>
                        <p><strong>Subscribe:</strong> {savedData.subscribeSequence}</p>
                        <p><strong>Unsubscribe:</strong> {savedData.unsubscribeSequence}</p>
                        <p><strong>Assign To:</strong> {savedData.assignTo}</p>
                        <p><strong>Webhook:</strong> {savedData.webhookURL}</p>
                    </div>
                ) :
                    (
                        <div>
                            <Icon icon="mdi:thumb-up" width="20" height="20" color='black' onClick={handleThumbClick} style={{ cursor: 'pointer' }} />
                        </div>
                    )}
            </div>
            <div className="dotted-line mt-1" />
            <div className='px-2 footer mt-2 d-flex align-self-end'>
                {/* <p>Message</p> */}
                <p className='ms-auto'>Compose Next Message</p>
            </div>
            <Handle type="source" position={Position.Bottom} style={{
                left: 'auto', right: -10, bottom: 20,
                width: 10,
                height: 10,
                borderRadius: '50%',  // Circle
                background: 'white',
                border: '1px solid grey'
            }} />
        </div>
    );
});

export default StartBotNode;
