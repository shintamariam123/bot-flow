import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { Icon } from '@iconify/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHandPointer } from '@fortawesome/free-solid-svg-icons';

const StartBotNode = React.memo(({ data }) => {
    const isConnectable = !data.connected;

    const handleCursorIconClick = (e) => {
        e.stopPropagation();
        console.log("Cursor icon clicked in StartBotNode!");
        if (typeof data?.openEditor === 'function') {
            console.log("Calling data.openEditor()");
            data.openEditor();
        } else {
            console.log("data.openEditor is not a function or is null/undefined.", data);
        }
    };

    const savedData = data.savedData; // This will be null OR the actual saved object

    // **CRUCIAL CHANGE HERE:**
    // Define a variable to explicitly check if there's *meaningful* custom data.
    // This checks if `savedData` exists AND if any of the key properties like `keywords` or `title` are non-empty.
    const hasMeaningfulSavedData = savedData && (
        (savedData.keywords && savedData.keywords.trim() !== '') ||
        (savedData.title && savedData.title.trim() !== '') ||
        (savedData.matchType && savedData.matchType.trim() !== '') || // Add other fields you deem "meaningful"
        (savedData.addLabel && savedData.addLabel.trim() !== '') ||
        (savedData.removeLabel && savedData.removeLabel.trim() !== '') ||
        (savedData.subscribeSequence && savedData.subscribeSequence.trim() !== '') ||
        (savedData.unsubscribeSequence && savedData.unsubscribeSequence.trim() !== '') ||
        (savedData.assignTo && savedData.assignTo.trim() !== '') ||
        (savedData.webhookURL && savedData.webhookURL.trim() !== '')
    );

    return (
        <div className='content'>
            <div className='p-2 d-flex flex-column align-items-center w-100'>
                <div className='d-flex align-self-start'>
                    <Icon icon="fa-solid:walking" width="15" height="15" color='black' />
                    <p className='ms-2 heading'>Start Bot Flow</p>
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

                {/* **Use hasMeaningfulSavedData here instead of just savedData** */}
                {hasMeaningfulSavedData ? (
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
                ) : (
                    <div>
                        <FontAwesomeIcon
                            icon={faHandPointer}
                            width="20"
                            height="20"
                            color='black'
                            onClick={handleCursorIconClick}
                            style={{ cursor: 'pointer' }}
                        />
                    </div>
                )}
            </div>
            <div className="dotted-line mt-1" />
            <div className='px-2 footer mt-2 d-flex align-self-end'>
                <p className='ms-auto'>Compose Next Message</p>
            </div>
            <Handle id="a" isConnectable={isConnectable} type="source" position={Position.Bottom} style={{
                left: 'auto', right: -10, bottom: 20,
                width: 10,
                height: 10,
                borderRadius: '50%',
                background: 'white',
                border: '1px solid grey'
            }} />
        </div>
    );
});

export default StartBotNode;