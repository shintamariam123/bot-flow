import React, { useState, useEffect } from 'react';
import { Offcanvas, Form, Button } from 'react-bootstrap'; // Removed Row, Col, Dropdown as they are not directly used here
import data from '../editors/js-data/optionsData.json';

const UserInputFlowEditor = ({ node, onClose, onSave, content }) => {
    const { input_flow_list } = data;
    const [selectedInputFlowOption, setSelectedInputFlowOption] = useState(content?.userOption || ''); // Renamed for clarity
    const [selectedWebName, setSelectedWebName] = useState(content?.selectedWebName || '');
    const [userInputCampaignName, setUserInputCampaignName] = useState(content?.userInput || ''); // Renamed for clarity

    // State to hold the selected input flow from the list when "Select" is chosen
    const [selectedExistingInputFlow, setSelectedExistingInputFlow] = useState('');

    useEffect(() => {
        // If an existing input flow was previously selected, set it in the state
        if (content?.userOption === 'Select' && content?.userInput) {
            setSelectedExistingInputFlow(content.userInput);
        }
    }, [content]);

    const handleSave = () => {
        const dataToSave = {
            userOption: selectedInputFlowOption,
            webName: selectedWebName,
            userInput: selectedInputFlowOption === 'Add new input flow' ? userInputCampaignName : selectedExistingInputFlow
        };

        if (node?.id) {
            console.log(`Saving data for Node ID: ${node.id}`, dataToSave);
            onSave(node.id, dataToSave);
        }
        onClose();
    };

    if (!node) {
        return null;
    }

    return (
        <Offcanvas show={true} onHide={onClose} placement="end" >
            <Offcanvas.Header closeButton>
            </Offcanvas.Header>
            <Offcanvas.Body className='mt-1'>
                <h4 className='text-center'>Configure User - Input - Flow</h4>
                {/* Dotted Border Section */}
                <div style={{
                    border: '2px dotted #ffad60',
                    backgroundColor: 'rgb(252, 244, 237)',
                    padding: '15px',
                    borderRadius: '5px',
                    marginBottom: '20px',
                    marginTop: '20px'
                }}>
                    <p>Name your User Input Campaign to reflect its purpose, whether it's for surveys, order collection, reservations, appointments, or other interactive processes. This campaign type enables you to create a sequence of questions, with the collected data saved as a consolidated set. You can easily export this combined data to a CSV file for analysis and management. Choose a name that defines the essence of your campaign and aids in efficient organization of the gathered insights.</p>
                </div>
                <Form>
                    <Form.Group className="mb-3" controlId="userInputFlowSelection">
                        <Form.Label>User Input Flow</Form.Label>
                        <Form.Select
                            value={selectedInputFlowOption}
                            onChange={(e) => {
                                setSelectedInputFlowOption(e.target.value);
                                // Reset campaign name or selected existing flow when the option changes
                                setUserInputCampaignName('');
                                setSelectedExistingInputFlow('');
                            }}
                        >
                            <option value="" hidden>Select</option>
                            <option value="Add new input flow">Add new input flow</option>
                            <option value="Select">Select existing input flow</option> {/* Changed text for clarity */}
                        </Form.Select>
                    </Form.Group>

                    {selectedInputFlowOption === 'Add new input flow' && (
                        <Form.Group className="mb-3" controlId="userInputCampaignName">
                            <Form.Label>User Input Campaign Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="userInputCampaignName"
                                value={userInputCampaignName}
                                onChange={(e) => setUserInputCampaignName(e.target.value)}
                            />
                        </Form.Group>
                    )}

                    {selectedInputFlowOption === 'Select' && (
                        <Form.Group className="mb-3" controlId="selectExistingInputFlow">
                            <Form.Label>Choose Input Flow</Form.Label>
                            <Form.Select
                                value={selectedExistingInputFlow}
                                onChange={(e) => setSelectedExistingInputFlow(e.target.value)}
                            >
                                <option value="" hidden>Select a flow</option>
                                {input_flow_list.map((user) => (
                                    <option key={user.id} value={user.name}>
                                        {user.name}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    )}

                    <Form.Group className="mb-3" controlId="sendDataToWebhookURL">
                        <Form.Label>Send data to Webhook URL</Form.Label>
                        <Form.Control
                            type="text"
                            name="webName"
                            value={selectedWebName}
                            onChange={(e) => setSelectedWebName(e.target.value)}
                        />
                    </Form.Group>

                    <Button type="button" onClick={handleSave} className="mt-3 btn offcanvas-save w-100">
                        Save
                    </Button>
                </Form>
            </Offcanvas.Body>
        </Offcanvas>
    );
};

export default UserInputFlowEditor;