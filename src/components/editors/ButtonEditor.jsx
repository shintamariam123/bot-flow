import React, { useState, useEffect } from 'react';
import { Offcanvas, Form, Button } from 'react-bootstrap';
import data from './js-data/optionsData.json'

const ButtonEditor = ({ show, onClose, nodeId, content, onSave }) => {
    const [label, setLabel] = useState(content?.label || '');
    const [buttonName, setButtonName] = useState(content?.buttonName || '');
    const [actionType, setActionType] = useState(content?.actionType || '');

    const [formData, setFormData] = useState({
        keywords: '',
        matchType: 'exact',
        title: '',
        addLabel: '',
        removeLabel: '',
        subscribeSequence: '',
        unsubscribeSequence: '',
        assignTo: '',
        webhookURL: ''
    });
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => {
            const newForm = { ...prev, [name]: value };
            console.log("Form Data on change:", newForm); // logs every input change
            return newForm;
        });
    };

useEffect(() => {
    setLabel(content?.label || '');
    setButtonName(content?.buttonName || '');
    setActionType(content?.actionType || '');
    setFormData(prev => ({
        ...prev,
        ...(content?.formData || {})
    }));
}, [JSON.stringify(content)]);


    const handleSave = () => {
        const contentToSave = {
            label,
            buttonName,
            actionType,
            formData
        };
        onSave(nodeId, contentToSave);
        console.log('btnsave',contentToSave);
        
        onClose();
    };


    return (
        <Offcanvas show={show} onHide={onClose} placement="end">
            <Offcanvas.Header closeButton>
                <Offcanvas.Title>Configure Button </Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>Button Name</Form.Label>
                        <Form.Control
                            type="text"
                            name="buttonName"
                            value={buttonName}
                            onChange={(e) => setButtonName(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>When user presses the button</Form.Label>
                        <Form.Select
                            value={actionType}
                            onChange={(e) => setActionType(e.target.value)}
                        >
                            <option value="" disabled hidden>Select</option>
                            <option value="send">Send Message</option>
                            <option value="flow">Start a Flow</option>
                            <option value="system">System Default Action</option>
                        </Form.Select>
                    </Form.Group>
                    {actionType === 'send' && (
                        <>
                            <label className='mt-2' htmlFor="add_label">Add label</label>
                            <br />
                            <select name="addLabel" id="add_label" className="no-arrow" value={formData.addLabel} onChange={handleInputChange}>
                                <option value="" disabled hidden >Select</option>
                                {data.group_label_list.map((label) => (
                                    <option key={label.id} value={label.label_name}>
                                        {label.label_name}
                                    </option>
                                ))}

                            </select>

                            <label className='mt-2' htmlFor="remove_label">Remove label</label>
                            <br />
                            <select name="removeLabel" value={formData.removeLabel} onChange={handleInputChange} id="remove_label" className="no-arrow">
                                <option value="" disabled hidden>Select</option>
                                {data.group_label_list.map((label) => (
                                    <option key={label.id} value={label.label_name}>
                                        {label.label_name}
                                    </option>
                                ))}
                            </select>


                            <label className='mt-2' htmlFor="subscribe">Subscribe to Sequence</label>
                            <br />
                            <select name="subscribeSequence" id="subscribe" value={formData.subscribeSequence} onChange={handleInputChange} className="no-arrow">
                                <option value="" disabled hidden>Select</option>
                                {data.sequence_list.map((sequence) => (
                                    <option key={sequence.id} value={sequence.campaign_name}>
                                        {sequence.campaign_name}
                                    </option>
                                ))}
                            </select>


                            <label className='mt-2' htmlFor="unsubscribe">Unsubscribe to Sequence</label>
                            <br />
                            <select name="unsubscribeSequence" value={formData.unsubscribeSequence} onChange={handleInputChange} className="no-arrow">
                                <option value="" disabled hidden>Select</option>
                                {data.sequence_list.map((sequence) => (
                                    <option key={sequence.id} value={sequence.campaign_name}>
                                        {sequence.campaign_name}
                                    </option>
                                ))}
                            </select>

                            <label className='mt-2' htmlFor="assign">Assign conversation to a user</label>
                            <br />
                            <select name="assignTo" value={formData.assignTo} onChange={handleInputChange} className="no-arrow">
                                <option value="" disabled hidden>Select Team Member</option>
                                {data.agent_list.map((agent) => (
                                    <option key={agent.id} value={agent.name}>
                                        {agent.name}
                                    </option>
                                ))}
                            </select>

                            <label className='mt-2' htmlFor="url">Send data to Webhook URL</label>
                            <input name='webhookURL' type="text" value={formData.webhookURL} onChange={handleInputChange} />
                        </>
                    )}

                    {actionType === 'flow' && (
                        <>
                            <Form.Label>Flow Name</Form.Label>
                            <Form.Select name="flowName" value={formData.flowName || ''} onChange={handleInputChange}>
                                <option value="" hidden disabled>Select</option>
                                <option value="Simgtextbot">Simgtextbot</option>
                                <option value="vidBot">vidBot</option>
                            </Form.Select>
                        </>
                    )}

                    {actionType === 'system' && (
                        <>
                            <Form.Label>Action Type</Form.Label>
                            <Form.Select name="systemAction" value={formData.systemAction || ''} onChange={handleInputChange}>
                                <option value="" hidden disabled>Select</option>
                                <option value="unsubscribe">Unsubscribe</option>
                                <option value="resubscribe">Re-subscribe</option>
                                <option value="chat_human">Chat with Human</option>
                                <option value="chat_bot">Chat with Robot</option>
                            </Form.Select>
                        </>
                    )}


                    <button onClick={handleSave} className="mt-3 btn offcanvas-save">
                        Save
                    </button>
                </Form>
            </Offcanvas.Body>
        </Offcanvas>
    );
};

export default ButtonEditor;
