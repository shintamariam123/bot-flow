import React, { useState, useEffect } from 'react';
import { Offcanvas, Form, Button, ButtonGroup, Row, Col } from 'react-bootstrap';
import data from '../editors/js-data/optionsData.json';
import { FaFont, FaImage, FaCog, FaUser } from 'react-icons/fa';
import { Icon } from '@iconify/react';
import { IoCloseCircleOutline } from "react-icons/io5"; // Import close icon

const QuestionEditor = ({ node, onClose, onSave, content }) => {

    const { custom_fields_list, system_fields_list } = data;
    const [selectedQuestionType, setSelectedQuestionType] = useState(content?.questionType || null);
    const [isKeyboardInput, setisKeyboardInput] = useState(false);
    const [isMultipleChoice, setisMultipleChoice] = useState(false);
    const [messageType, setMessageType] = useState('Custom'); // Custom or Name
    const [dropdownValue, setDropdownValue] = useState('');
    const [dropText, setDropText] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedReplyType, setSelectedReplyType] = useState(content?.userOption || '');
    const [selectedCustomField, setSelectedCustomField] = useState('');
    const [selectedSystemField, setSelectedSystemField] = useState('');

    // New states for adding custom field (for Keyboard Input type)
    const [showNewCustomField, setShowNewCustomField] = useState(false);
    const [newCustomFieldName, setNewCustomFieldName] = useState('');
    const [newCustomFieldReplyType, setNewCustomFieldReplyType] = useState('text'); // Default to 'text'

    // NEW STATE for Multiple Choice Options
    const [multipleChoiceOptions, setMultipleChoiceOptions] = useState([
        { id: 1, value: '' },
        { id: 2, value: '' },
    ]);
    const [nextOptionId, setNextOptionId] = useState(3); // To generate unique IDs for new options

    useEffect(() => {
        // Initialize based on content or default when component mounts
        if (content?.questionType === 'Keyboard') {
            setisKeyboardInput(true);
            setisMultipleChoice(false);
            setDropText(content?.customMessage || '');
            setSelectedReplyType(content?.replyType || '');
            setSelectedCustomField(content?.customField || '');
            setSelectedSystemField(content?.systemField || '');
        } else if (content?.questionType === 'Multiple-choice') {
            setisMultipleChoice(true);
            setisKeyboardInput(false);
            // If content has options, load them, otherwise default to 2
            if (content?.options && content.options.length > 0) {
                // Ensure loaded options also have unique IDs if they don't from content
                const loadedOptions = content.options.map((opt, index) => ({
                    id: opt.id || (index + 1), // Use existing ID or generate
                    value: opt.value || opt // Handle case where opt might just be a string
                }));
                setMultipleChoiceOptions(loadedOptions);
                setNextOptionId(loadedOptions.length > 0 ? Math.max(...loadedOptions.map(o => o.id)) + 1 : 3);
            }
        }
    }, [content]);


    const handleKeyboardInput = () => {
        setisKeyboardInput(true);
        setisMultipleChoice(false);
        setSelectedQuestionType('Keyboard'); // Set the selected question type
    };

    const handleMultipleChoice = () => {
        setisMultipleChoice(true);
        setisKeyboardInput(false);
        setSelectedQuestionType('Multiple-choice'); // Set the selected question type
    };

    const handleDropdownSelect = (item) => {
        const value = item.name || item.full_name;
        setDropdownValue(value);

        if (messageType === 'Name') {
            setDropText(`{{${value}}}`);
        } else {
            setDropText(value);
        }

        setShowDropdown(false);
    };

    const handleAddNewCustomField = () => {
        setShowNewCustomField(true);
        setNewCustomFieldName(''); // Clear previous input
        setNewCustomFieldReplyType('text'); // Reset reply type
    };

    const handleSaveNewCustomField = () => {
        console.log("New Custom Field Name:", newCustomFieldName);
        console.log("New Custom Field Reply Type:", newCustomFieldReplyType);
        // Here you would typically add the new custom field to your data
        // and possibly update custom_fields_list. For this example, we'll just close.
        setShowNewCustomField(false);
    };

    // NEW HANDLERS for Multiple Choice Options
    const handleAddOption = () => {
        setMultipleChoiceOptions([...multipleChoiceOptions, { id: nextOptionId, value: '' }]);
        setNextOptionId(nextOptionId + 1);
    };

    const handleOptionChange = (id, newValue) => {
        setMultipleChoiceOptions(multipleChoiceOptions.map(option =>
            option.id === id ? { ...option, value: newValue } : option
        ));
    };

    const handleRemoveOption = (id) => {
        setMultipleChoiceOptions(multipleChoiceOptions.filter(option => option.id !== id));
    };


    const handleSave = () => {
        const dataToSave = {
            questionType: selectedQuestionType,
            customMessage: dropText, // This 'dropText' refers to the main question text
        };

        if (isKeyboardInput) {
            dataToSave.replyType = selectedReplyType;
            dataToSave.customField = selectedCustomField;
            dataToSave.systemField = selectedSystemField;
        } else if (isMultipleChoice) {
            // Ensure you are saving the actual options here
            dataToSave.options = multipleChoiceOptions.map(option => ({ id: option.id, value: option.value }));
            dataToSave.replyType = selectedReplyType; // Assuming reply type applies to multiple choice too
            dataToSave.customField = selectedCustomField; // Assuming these also apply
            dataToSave.systemField = selectedSystemField; // Assuming these also apply
        }

        if (node?.id) {
            console.log(`Saving data for Node ID: ${node.id}`, dataToSave);
            onSave(node.id, dataToSave);
        }
        onClose();
    };

    if (!node) {
        return null;
    }
    const options = messageType === 'Name' ? system_fields_list : custom_fields_list;

    return (
        <Offcanvas show={true} onHide={onClose} placement="end" >
            <Offcanvas.Header closeButton>
            </Offcanvas.Header>
            <Offcanvas.Body className='mt-1'>
                <h4 className='text-center mb-3'>Configure New Question</h4>

                <Form>
                    <Form.Group className="mb-3" controlId="userInputFlowSelection">
                        <p>Choose question type</p>
                        <Form>
                            <div
                                className=" text-dark "
                                style={{ cursor: 'pointer', transition: 'background-color 0.3s ease' }}
                                onClick={handleKeyboardInput}
                            ><p className='m-0'>
                                    <Icon
                                        icon="mdi:toggle-switch"
                                        width="50"
                                        height="50"
                                        className="me-1"
                                        color={isKeyboardInput ? 'green' : 'grey'}
                                    />
                                    Free keyboard input</p>
                            </div>

                            <div
                                className=" mb-3 text-dark "
                                style={{ cursor: 'pointer', transition: 'background-color 0.3s ease' }}
                                onClick={handleMultipleChoice}
                            > <p className='m-0'>
                                    <Icon
                                        icon="mdi:toggle-switch"
                                        width="50"
                                        height="50"
                                        className="me-1"
                                        color={isMultipleChoice ? 'green' : 'grey'}
                                    />
                                    Multiple choice</p>
                            </div>

                            {isKeyboardInput && (
                                <>
                                    <Form.Group className="mb-3" controlId="scheduleMessageAfter">
                                        <p>Question</p>
                                        <ButtonGroup className="mb-3">
                                            <Button className='rounded-1' style={{ width: '120px', height: '50px', color: 'black' }}
                                                variant={messageType === 'Custom' ? 'secondary' : 'outline-secondary'}
                                                onClick={() => {
                                                    setMessageType('Custom');
                                                    setDropdownValue('');
                                                    setDropText('');
                                                    setShowDropdown(true);
                                                }}
                                            >
                                                <FaCog style={{ marginRight: 5 }} />Custom
                                            </Button>
                                            <Button className='ms-3 rounded-1' style={{ width: '120px', height: '50px', color: 'black' }}
                                                variant={messageType === 'Name' ? 'secondary' : 'outline-secondary'}
                                                onClick={() => {
                                                    setMessageType('Name');
                                                    setDropdownValue('');
                                                    setDropText('');
                                                    setShowDropdown(true);
                                                }}
                                            >
                                                <FaUser style={{ marginRight: 5 }} />
                                                Name
                                            </Button>
                                        </ButtonGroup>

                                        <div className="mb-3 position-relative">
                                            {showDropdown && (
                                                <ul
                                                    className="position-absolute bg-white border list-unstyled p-0 w-100"
                                                    style={{ zIndex: 10 }}
                                                >
                                                    {options.map((item) => (
                                                        <li
                                                            key={item.id}
                                                            onClick={() => handleDropdownSelect(item)}
                                                            className="p-2 border-bottom"
                                                            style={{ cursor: 'pointer' }}
                                                        >
                                                            {item.name || item.full_name}
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}

                                            <input
                                                type="text"
                                                className="form-control mb-3 mt-2"
                                                value={dropText}
                                                onChange={(e) => {
                                                    if (messageType === 'Custom') setDropText(e.target.value);
                                                }}
                                                placeholder={
                                                    messageType === 'Name'
                                                        ? 'Field will be shown here'
                                                        : 'Type your custom message'
                                                }
                                                readOnly={messageType === 'Name'}
                                            />
                                        </div>
                                    </Form.Group>
                                    <p>Reply type</p>
                                    <Form.Select className="mb-3"
                                        value={selectedReplyType}
                                        onChange={(e) => {
                                            setSelectedReplyType(e.target.value);
                                        }}
                                    >
                                        <option value="" hidden></option>
                                        <option value="text">Text</option>
                                        <option value="email">Email</option>
                                        <option value="phone">Phone</option>
                                        <option value="number">Number</option>
                                        <option value="url">URL</option>
                                        <option value="file">File</option>
                                        <option value="image">Image</option>
                                        <option value="video">Video</option>
                                        <option value="date">Date</option>
                                        <option value="time">Time</option>
                                        <option value="datetime">Datetime</option>
                                    </Form.Select>
                                    <Form.Group className="mb-3" controlId="selectExistingInputFlow">
                                        <div className="d-flex justify-content-between align-items-center mb-2">
                                            <p className="mb-0">Save to Custom Fields</p>
                                            <Button style={{ color: 'green', borderColor: 'white' }} variant="link" className="p-0 text-decoration-none" onClick={handleAddNewCustomField}>
                                                <Icon icon="flat-color-icons:plus" width="20" height="20" color='green' /> Add New
                                            </Button>
                                        </div>
                                        <Form.Select
                                            value={selectedCustomField}
                                            onChange={(e) => setSelectedCustomField(e.target.value)}
                                        >
                                            <option value="" hidden></option>
                                            {custom_fields_list.map((user) => (
                                                <option key={user.id} value={user.name}>
                                                    {user.name}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>

                                    {showNewCustomField && (
                                        <div style={{ backgroundColor: '#edfff7' }} className="border p-3 mb-3 rounded position-relative ">
                                            <IoCloseCircleOutline
                                                className="position-absolute top-0 end-0 m-2"
                                                style={{ cursor: 'pointer', fontSize: '1.5rem' }}
                                                onClick={() => setShowNewCustomField(false)}
                                            />
                                            <Form.Group className="mb-3">
                                                <Form.Label>Custom field name</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder=""
                                                    value={newCustomFieldName}
                                                    onChange={(e) => setNewCustomFieldName(e.target.value)}
                                                />
                                            </Form.Group>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Reply type</Form.Label>
                                                <Form.Select
                                                    value={newCustomFieldReplyType}
                                                    onChange={(e) => setNewCustomFieldReplyType(e.target.value)}
                                                >
                                                    <option value="text">Text</option>
                                                    <option value="email">Email</option>
                                                    <option value="phone">Phone</option>
                                                    <option value="number">Number</option>
                                                    <option value="url">URL</option>
                                                    <option value="file">File</option>
                                                    <option value="image">Image</option>
                                                    <option value="video">Video</option>
                                                    <option value="date">Date</option>
                                                    <option value="time">Time</option>
                                                    <option value="datetime">Datetime</option>
                                                </Form.Select>
                                            </Form.Group>
                                            <div className='d-flex  justify-content-center'>
                                                <button className='btn offcanvas-save ' onClick={handleSaveNewCustomField}>
                                                    Save
                                                </button>
                                            </div>

                                        </div>
                                    )}

                                    <Form.Group controlId="selectExistingInputFlow">
                                        <p>Save to System Fields</p>
                                        <Form.Select
                                            value={selectedSystemField}
                                            onChange={(e) => setSelectedSystemField(e.target.value)}
                                        >
                                            <option value="" hidden></option>
                                            {system_fields_list.map((user) => (
                                                <option key={user.id} value={user.full_name}>
                                                    {user.full_name}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                </>
                            )}

                            {isMultipleChoice && (
                                <>
                                    <Form.Group className="mb-3" controlId="multipleChoiceQuestion">
                                        <p>Question</p>
                                        <ButtonGroup className="mb-3">
                                            <Button className='rounded-1' style={{ width: '120px', height: '50px', color: 'black' }}
                                                variant={messageType === 'Custom' ? 'secondary' : 'outline-secondary'}
                                                onClick={() => {
                                                    setMessageType('Custom');
                                                    setDropdownValue('');
                                                    setDropText('');
                                                    setShowDropdown(true);
                                                }}
                                            >
                                                <FaCog style={{ marginRight: 5 }} />Custom
                                            </Button>
                                            <Button className='ms-3 rounded-1' style={{ width: '120px', height: '50px', color: 'black' }}
                                                variant={messageType === 'Name' ? 'secondary' : 'outline-secondary'}
                                                onClick={() => {
                                                    setMessageType('Name');
                                                    setDropdownValue('');
                                                    setDropText('');
                                                    setShowDropdown(true);
                                                }}
                                            >
                                                <FaUser style={{ marginRight: 5 }} />
                                                Name
                                            </Button>
                                        </ButtonGroup>

                                        <div className="mb-3 position-relative">
                                            {showDropdown && (
                                                <ul
                                                    className="position-absolute bg-white border list-unstyled p-0 w-100"
                                                    style={{ zIndex: 10 }}
                                                >
                                                    {options.map((item) => (
                                                        <li
                                                            key={item.id}
                                                            onClick={() => handleDropdownSelect(item)}
                                                            className="p-2 border-bottom"
                                                            style={{ cursor: 'pointer' }}
                                                        >
                                                            {item.name || item.full_name}
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}

                                            <input
                                                type="text"
                                                className="form-control mb-3 mt-2"
                                                value={dropText}
                                                onChange={(e) => {
                                                    if (messageType === 'Custom') setDropText(e.target.value);
                                                }}
                                                placeholder={
                                                    messageType === 'Name'
                                                        ? 'Field will be shown here'
                                                        : 'Type your custom message'
                                                }
                                                readOnly={messageType === 'Name'}
                                            />
                                        </div>
                                    </Form.Group>

                                    {/* Multiple Choice Options Section - MODIFIED */}
                                    {multipleChoiceOptions.map((option, index) => (
                                        <div key={option.id} className="mb-2" style={{ position: 'relative' }}>
                                            <Form.Control
                                                type="text"
                                                placeholder={`Option ${index + 1}`}
                                                value={option.value}
                                                onChange={(e) => handleOptionChange(option.id, e.target.value)}
                                              
                                                style={{ paddingRight: index >= 2 ? '3.5rem' : '0.75rem' }}
                                            />
                                            {index >= 2 && ( // Show close button only for options beyond the initial two
                                                <IoCloseCircleOutline
                                                    className="position-absolute"
                                                    style={{
                                                        cursor: 'pointer',
                                                        fontSize: '1.5rem',
                                                        color: 'red',
                                                        top: '50%',right:'5%',
                                                        transform: 'translateY(-50%)'
                                                    }}
                                                    onClick={() => handleRemoveOption(option.id)}
                                                />
                                            )}
                                        </div>
                                    ))}

                                    <div className='d-flex justify-content-center mb-3'>
                                        <Button className='btn offcanvas-save' onClick={handleAddOption}>
                                            Add more
                                        </Button>
                                    </div>

                                    {/* Existing Reply Type and Save to Fields remain */}
                                    <p>Reply type</p>
                                    <Form.Select className="mb-3"
                                        value={selectedReplyType}
                                        onChange={(e) => {
                                            setSelectedReplyType(e.target.value);
                                        }}
                                    >
                                        <option value="" hidden></option>
                                        <option value="text">Text</option>
                                        <option value="email">Email</option>
                                        <option value="phone">Phone</option>
                                        <option value="number">Number</option>
                                        <option value="url">URL</option>
                                        <option value="file">File</option>
                                        <option value="image">Image</option>
                                        <option value="video">Video</option>
                                        <option value="date">Date</option>
                                        <option value="time">Time</option>
                                        <option value="datetime">Datetime</option>
                                    </Form.Select>
                                    <Form.Group className="mb-3" controlId="selectExistingInputFlow">
                                        <p className="mb-0">Save to Custom Fields</p>
                                        <Form.Select
                                            value={selectedCustomField}
                                            onChange={(e) => setSelectedCustomField(e.target.value)}
                                        >
                                            <option value="" hidden></option>
                                            {custom_fields_list.map((user) => (
                                                <option key={user.id} value={user.name}>
                                                    {user.name}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                    <Form.Group controlId="selectExistingInputFlow">
                                        <p>Save to System Fields</p>
                                        <Form.Select
                                            value={selectedSystemField}
                                            onChange={(e) => setSelectedSystemField(e.target.value)}
                                        >
                                            <option value="" hidden></option>
                                            {system_fields_list.map((user) => (
                                                <option key={user.id} value={user.full_name}>
                                                    {user.full_name}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                </>
                            )}
                            <Button type="button" onClick={handleSave} className="mt-3 btn offcanvas-save w-100">
                                Save
                            </Button>
                        </Form>
                    </Form.Group>
                </Form>
            </Offcanvas.Body>
        </Offcanvas>
    );
};

export default QuestionEditor;