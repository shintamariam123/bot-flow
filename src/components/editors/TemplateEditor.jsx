import React, { useState, useEffect, useRef } from 'react';
import { Offcanvas, Form, Button } from 'react-bootstrap';
import data from './js-data/optionsData.json'; // Adjust path if needed

const TemplateEditor = ({ node, onClose, onSave, content }) => {
    const {
        custom_fields_list,
        whatsapp_flow_list,
        template_canvas_message
    } = data;

    const [selectedTemplateName, setSelectedTemplateName] = useState('');
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [selectedButtonFlows, setSelectedButtonFlows] = useState({});
    const [selectedCustomFields, setSelectedCustomFields] = useState({});
    // Store the actual File object for preview in editor, and then convert to base64 for saving
    const [imageFile, setImageFile] = useState(null);
    // Store the base64 URL for saving and initial loading
    const [imageSrc, setImageSrc] = useState(null);

    const fileInputRef = useRef(null);

    useEffect(() => {
        if (content?.selectedTemplateName) {
            setSelectedTemplateName(content.selectedTemplateName);
            const initialTemplate = template_canvas_message.find(
                (template) => template.template_name === content.selectedTemplateName
            );
            setSelectedTemplate(initialTemplate);
            
            // If there's an image saved, load its Base64 string into state for preview
            if (content.selectedTemplateDetails?.header_type === 'IMAGE' && content.uploadedImageSrc) {
                setImageSrc(content.uploadedImageSrc);
            } else {
                setImageSrc(null); // Clear image src if not an image template or no image
            }
            // Re-initialize other fields if needed for editing
            setSelectedButtonFlows(content.selectedButtonFlows || {});
            setSelectedCustomFields(content.selectedCustomFields || {});

        }
    }, [content, template_canvas_message]);

    useEffect(() => {
        const foundTemplate = template_canvas_message.find(
            (template) => template.template_name === selectedTemplateName
        );
        setSelectedTemplate(foundTemplate);
        // Reset dynamic fields when template changes
        setSelectedButtonFlows({});
        setSelectedCustomFields({});
        setImageFile(null); // Clear temporary file
        setImageSrc(null); // Clear saved image src
    }, [selectedTemplateName, template_canvas_message]);

    const handleTemplateChange = (e) => {
        setSelectedTemplateName(e.target.value);
    };

    const handleButtonFlowChange = (buttonName, value) => {
        setSelectedButtonFlows(prev => ({
            ...prev,
            [buttonName]: value
        }));
    };

    const handleCustomFieldChange = (index, value) => {
        setSelectedCustomFields(prev => ({
            ...prev,
            [index]: value
        }));
    };

    const handleFileSelect = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImageFile(file); // For temporary preview in editor
            const reader = new FileReader();
            reader.onloadend = () => {
                setImageSrc(reader.result); // This is the Base64 string
            };
            reader.readAsDataURL(file); // Read the file as a data URL
        }
    };

    const handleDivClick = () => {
        fileInputRef.current.click();
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
        e.currentTarget.classList.add('drag-over');
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        e.currentTarget.classList.remove('drag-over');
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        e.currentTarget.classList.remove('drag-over');

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const droppedFile = e.dataTransfer.files[0];
            if (droppedFile.type.startsWith('image/')) {
                setImageFile(droppedFile); // For temporary preview in editor
                const reader = new FileReader();
                reader.onloadend = () => {
                    setImageSrc(reader.result); // This is the Base64 string
                };
                reader.readAsDataURL(droppedFile);
            } else {
                alert('Please drop an image file.');
            }
            e.dataTransfer.clearData();
        }
    };

    const handleSave = () => {
        const dataToSave = {
            selectedTemplateName: selectedTemplateName,
            selectedTemplateDetails: selectedTemplate,
        };

        if (selectedTemplate) {
            if (selectedTemplate.header_type === 'TEXT' && selectedTemplate.button_count > 0) {
                dataToSave.selectedButtonFlows = selectedButtonFlows;
            } else if (selectedTemplate.header_type === 'IMAGE') {
                // Save the Base64 string and original file name
                dataToSave.uploadedImageSrc = imageSrc;
                dataToSave.uploadedImageName = imageFile ? imageFile.name : null; // Keep name for display if needed
                dataToSave.selectedCustomFields = selectedCustomFields;
            } else if (selectedTemplate.header_type === 'DOCUMENT') {
                dataToSave.selectedDocumentCustomField = selectedCustomFields[0];
            }
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

    return (
        <Offcanvas show={true} onHide={onClose} placement="end" >
            <Offcanvas.Header closeButton>
                <Offcanvas.Title>Configure Template Message</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body className='mt-1'>
                <Form>
                    <Form.Group className="mb-3" controlId="selectTemplateMessage">
                        <Form.Label>Select Template</Form.Label>
                        <Form.Select
                            value={selectedTemplateName}
                            onChange={handleTemplateChange}
                        >
                            <option value="" hidden>Select</option>
                            {template_canvas_message.map((template) => (
                                <option key={template.id} value={template.template_name}>
                                    {template.template_name} ({template.header_type})
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>

                    {selectedTemplate && (
                        <>
                            {/* TEXT Header Type */}
                            {selectedTemplate.header_type === 'TEXT' && selectedTemplate.button_count > 0 && (
                                <>
                                    {selectedTemplate.buttons.map((buttonName, index) => (
                                        <Form.Group className="mb-3" key={index} controlId={`buttonSelect-${index}`}>
                                            <Form.Label>{buttonName}</Form.Label>
                                            <Form.Select
                                                value={selectedButtonFlows[buttonName] || ''}
                                                onChange={(e) => handleButtonFlowChange(buttonName, e.target.value)}
                                            >
                                                <option value="" hidden>Select WhatsApp Flow</option>
                                                {whatsapp_flow_list.map(flow => (
                                                    <option key={flow.id} value={flow.name}>
                                                        {flow.name}
                                                    </option>
                                                ))}
                                            </Form.Select>
                                        </Form.Group>
                                    ))}
                                </>
                            )}

                            {/* IMAGE Header Type */}
                            {selectedTemplate.header_type === 'IMAGE' && (
                                <>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Upload Image</Form.Label>
                                        <div
                                            className="file-upload-area"
                                            onClick={handleDivClick}
                                            onDragOver={handleDragOver}
                                            onDragLeave={handleDragLeave}
                                            onDrop={handleDrop}
                                        >
                                            {imageFile ? (
                                                <p>File selected: <strong>{imageFile.name}</strong></p>
                                            ) : (
                                                <p>Drag and drop image here or <strong>click to upload</strong></p>
                                            )}
                                            <input
                                                type="file"
                                                ref={fileInputRef}
                                                onChange={handleFileSelect}
                                                accept="image/*"
                                                style={{ display: 'none' }}
                                            />
                                        </div>
                                        {/* Display image preview using imageSrc */}
                                        {imageSrc && (
                                            <div className="mt-2 text-center">
                                                <img src={imageSrc} alt="Preview" style={{ maxWidth: '100%', maxHeight: '150px', border: '1px solid #ddd', borderRadius: '5px' }} />
                                            </div>
                                        )}
                                    </Form.Group>

                                    {Array.from({ length: selectedTemplate.custom_count }).map((_, index) => (
                                        <Form.Group className="mb-3" key={`imageCustom-${index}`} controlId={`imageCustomSelect-${index}`}>
                                            <Form.Label>Custom Name</Form.Label>
                                            <Form.Select
                                                value={selectedCustomFields[index] || ''}
                                                onChange={(e) => handleCustomFieldChange(index, e.target.value)}
                                            >
                                                <option value="" hidden>Select Custom Field</option>
                                                {custom_fields_list.map(field => (
                                                    <option key={field.id} value={field.name}>
                                                        {field.name}
                                                    </option>
                                                ))}
                                            </Form.Select>
                                        </Form.Group>
                                    ))}
                                </>
                            )}

                            {/* DOCUMENT Header Type */}
                            {selectedTemplate.header_type === 'DOCUMENT' && (
                                <Form.Group className="mb-3" controlId="documentCustomField">
                                    <Form.Label>Text Button</Form.Label>
                                    <Form.Select
                                        value={selectedCustomFields[0] || ''}
                                        onChange={(e) => handleCustomFieldChange(0, e.target.value)}
                                    >
                                        <option value="" hidden>Select Custom Field</option>
                                        {custom_fields_list.map(field => (
                                            <option key={field.id} value={field.name}>
                                                {field.name}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            )}
                        </>
                    )}

                    <Button type="button" onClick={handleSave} className="mt-3 btn offcanvas-save w-100">
                        Save
                    </Button>
                </Form>
            </Offcanvas.Body>
        </Offcanvas>
    );
};

export default TemplateEditor;