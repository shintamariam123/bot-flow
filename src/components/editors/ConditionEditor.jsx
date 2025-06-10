import React, { useState, useEffect } from 'react';
import { Offcanvas, Form, Button, Row, Col, Dropdown } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle, faMinusCircle } from '@fortawesome/free-solid-svg-icons';

import optionsData from '../editors/js-data/optionsData.json';

const operators = [
    { label: '=', value: '=' },
    { label: '>', value: '>' },
    { label: '<', value: '<' },
    { label: '>=', value: '>=' },
    { label: '<=', value: '<=' },
    { label: '!=', value: '!=' },
    { label: 'Contains', value: 'Contains' },
    { label: 'Starts With', value: 'Starts With' },
    { label: 'Ends With', value: 'Ends With' },
    { label: 'Is Empty', value: 'Is Empty' },
    { label: 'Is Not Empty', value: 'Is Not Empty' },
];

const ConditionEditor = ({ node, onClose, onSave }) => {
    const [matchType, setMatchType] = useState('All Match');
    const [systemFields, setSystemFields] = useState([{ id: 1, variable: '', operator: '', value: '' }]);
    const [customFields, setCustomFields] = useState([{ id: 1, variable: '', operator: '', value: '' }]);

    useEffect(() => {
        if (node?.data?.content) {
            const { matchType, systemFields, customFields } = node.data.content;
            if (matchType) setMatchType(matchType);
            // Ensure systemFields and customFields are arrays and have at least one initial item
            if (systemFields && systemFields.length > 0) {
                setSystemFields(systemFields);
            } else {
                setSystemFields([{ id: 1, variable: '', operator: '', value: '' }]);
            }
            if (customFields && customFields.length > 0) {
                setCustomFields(customFields);
            } else {
                setCustomFields([{ id: 1, variable: '', operator: '', value: '' }]);
            }
        } else {
            // Reset to initial state if no content is present or node changes
            setMatchType('All Match');
            setSystemFields([{ id: 1, variable: '', operator: '', value: '' }]);
            setCustomFields([{ id: 1, variable: '', operator: '', value: '' }]);
        }
    }, [node]);

    const handleMatchTypeChange = (type) => {
        setMatchType(type);
    };

    const handleFieldChange = (type, index, field, value) => {
        if (type === 'system') {
            const newSystemFields = [...systemFields];
            newSystemFields[index][field] = value;
            setSystemFields(newSystemFields);
        } else {
            const newCustomFields = [...customFields];
            newCustomFields[index][field] = value;
            setCustomFields(newCustomFields);
        }
    };

    const addField = (type) => {
        if (type === 'system') {
            setSystemFields([...systemFields, { id: Date.now(), variable: '', operator: '', value: '' }]);
        } else {
            setCustomFields([...customFields, { id: Date.now(), variable: '', operator: '', value: '' }]);
        }
    };

    const removeField = (type, index) => {
        if (type === 'system' && index !== 0) {
            const newSystemFields = systemFields.filter((_, i) => i !== index);
            setSystemFields(newSystemFields);
        } else if (type === 'custom' && index !== 0) {
            const newCustomFields = customFields.filter((_, i) => i !== index);
            setCustomFields(newCustomFields);
        }
    };

    const handleSave = () => {
        const dataToSave = {
            matchType,
            systemFields,
            customFields,
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
        <Offcanvas show={true} onHide={onClose} placement="end" className="condition-editor-offcanvas">
            <Offcanvas.Header closeButton>
                <Offcanvas.Title className="w-100 text-center">Configure Condition</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
                <Form>
                    <div className="d-flex mb-4">
                        <Form.Check
                            type="checkbox"
                            id="all-match-checkbox"
                            label="All Match"
                            checked={matchType === 'All Match'}
                            onChange={() => handleMatchTypeChange('All Match')}
                            className="me-4 custom-checkbox-sm"
                        />
                        <Form.Check
                            type="checkbox"
                            id="any-match-checkbox"
                            label="Any Match"
                            checked={matchType === 'Any Match'}
                            onChange={() => handleMatchTypeChange('Any Match')}
                            className="custom-checkbox-sm"
                        />
                    </div>

                    {/* System Field Section */}
                    <div className="field-section mb-4">
                        <p style={{color:'green'}} className="mb-3 d-flex align-items-center ">
                            <FontAwesomeIcon icon={faPlusCircle} className="add-icon me-2" onClick={() => addField('system')} />
                            System Field
                        </p>
                        <Row className="mb-2 gx-2 header-labels">
                            <Col xs={4}><Form.Label>Variable</Form.Label></Col>
                            <Col xs={3}><Form.Label>Operator</Form.Label></Col>
                            <Col xs={4}><Form.Label>Value</Form.Label></Col>
                            <Col xs={1}></Col>
                        </Row>
                        {systemFields.map((field, index) => (
                            <Row key={field.id} className="mb-2 gx-2 align-items-center">
                                <Col xs={4}>
                                    <Dropdown onSelect={(value) => handleFieldChange('system', index, 'variable', value)}>
                                        <Dropdown.Toggle variant="outline-secondary" className="w-100 text-start custom-dropdown-toggle-sm">
                                            {field.variable }
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu>
                                            {optionsData.system_fields_list.map((sysField) => (
                                                <Dropdown.Item key={sysField.id} eventKey={sysField.full_name}>
                                                    {sysField.full_name}
                                                </Dropdown.Item>
                                            ))}
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </Col>
                                <Col xs={3}>
                                    <Dropdown onSelect={(value) => handleFieldChange('system', index, 'operator', value)}>
                                        <Dropdown.Toggle variant="outline-secondary" className="w-100 text-start custom-dropdown-toggle-sm">
                                            {field.operator}
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu>
                                            {operators.map((op) => (
                                                <Dropdown.Item key={op.value} eventKey={op.value}>
                                                    {op.label}
                                                </Dropdown.Item>
                                            ))}
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </Col>
                                <Col xs={4}>
                                    <Form.Control
                                        type="text"
                                        value={field.value}
                                        onChange={(e) => handleFieldChange('system', index, 'value', e.target.value)}
                                        className="form-control-sm-custom"
                                    />
                                </Col>
                                <Col xs={1} className="d-flex justify-content-center">
                                    {index !== 0 && (
                                        <FontAwesomeIcon icon={faMinusCircle} className="remove-icon" onClick={() => removeField('system', index)} />
                                    )}
                                </Col>
                            </Row>
                        ))}
                    </div>

                    {/* Custom Field Section */}
                    <div className="field-section mb-4 ">
                        <p style={{color:'green'}} className="mb-3 d-flex align-items-center ">
                            <FontAwesomeIcon icon={faPlusCircle} className="add-icon me-2" onClick={() => addField('custom')} />
                            Custom Field
                        </p>
                        <Row className="mb-2 gx-2 header-labels">
                            <Col xs={4}><Form.Label>Variable</Form.Label></Col>
                            <Col xs={3}><Form.Label>Operator</Form.Label></Col>
                            <Col xs={4}><Form.Label>Value</Form.Label></Col>
                            <Col xs={1}></Col>
                        </Row>
                        {customFields.map((field, index) => (
                            <Row key={field.id} className="mb-2 gx-2 align-items-center">
                                <Col xs={4}>
                                    <Dropdown onSelect={(value) => handleFieldChange('custom', index, 'variable', value)}>
                                        <Dropdown.Toggle variant="outline-secondary" className="w-100 text-start custom-dropdown-toggle-sm">
                                            {field.variable }
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu>
                                            {optionsData.custom_fields_list.map((custField) => (
                                                <Dropdown.Item key={custField.id} eventKey={custField.name}>
                                                    {custField.name}
                                                </Dropdown.Item>
                                            ))}
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </Col>
                                <Col xs={3}>
                                    <Dropdown onSelect={(value) => handleFieldChange('custom', index, 'operator', value)}>
                                        <Dropdown.Toggle variant="outline-secondary" className="w-100 text-start custom-dropdown-toggle-sm">
                                            {field.operator }
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu>
                                            {operators.map((op) => (
                                                <Dropdown.Item key={op.value} eventKey={op.value}>
                                                    {op.label}
                                                </Dropdown.Item>
                                            ))}
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </Col>
                                <Col xs={4}>
                                    <Form.Control
                                        type="text"
                                        value={field.value}
                                        onChange={(e) => handleFieldChange('custom', index, 'value', e.target.value)}
                                        className="form-control-sm-custom"
                                    />
                                </Col>
                                <Col xs={1} className="d-flex justify-content-center">
                                    {index !== 0 && (
                                        <FontAwesomeIcon icon={faMinusCircle} className="remove-icon" onClick={() => removeField('custom', index)} />
                                    )}
                                </Col>
                            </Row>
                        ))}
                    </div>

                    <Button type="button" onClick={handleSave} className="mt-3 btn offcanvas-save w-100">
                        Save
                    </Button>
                </Form>
            </Offcanvas.Body>
        </Offcanvas>
    );
};

export default ConditionEditor;