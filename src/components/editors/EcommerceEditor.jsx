import React, { useState, useEffect } from 'react';
import { Offcanvas, Form, Button } from 'react-bootstrap';

const EcommerceEditor = ({ show, onClose, nodeId, content = {}, onSave }) => {
  // State to store the *label* of the selected catalog
  const [selectedCatalogLabel, setSelectedCatalogLabel] = useState('');

  // Define your static catalog options
  const catalogOptions = [
    { value: '', label: 'Select' }, // Default placeholder
    { value: 'catalog_123', label: 'My Product Catalog A' },
    { value: 'catalog_456', label: 'Summer Collection' },
    { value: 'catalog_789', label: 'Electronics Catalog' },
    { value: 'catalog_abc', label: 'Winter Wear' },
  ];

  // Effect to set the initial label when the component loads or content changes
  useEffect(() => {
    // Check if content.label exists, otherwise find the label based on content.catalogId
    const initialLabel = content?.label || catalogOptions.find(
      (option) => option.value === content?.catalogId
    )?.label || '';
    setSelectedCatalogLabel(initialLabel);
  }, [content]);

  // Handle change in the select dropdown
  const handleCatalogChange = (e) => {
    const selectedValue = e.target.value;
    const selectedOption = catalogOptions.find(
      (option) => option.value === selectedValue
    );
    if (selectedOption) {
      setSelectedCatalogLabel(selectedOption.label);
    } else {
      setSelectedCatalogLabel(''); // Reset if "Select" or no matching option
    }
  };

  const handleSave = () => {
    // Construct the data object exactly as you specified
    const dataToSave = {
      label: selectedCatalogLabel, // The label you want to save
     
    };

    console.log('Saving data:', dataToSave); // Console verification with the full object
    onSave(nodeId, dataToSave);
    onClose();
  };

  return (
    <Offcanvas show={show} onHide={onClose} placement="end">
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>Configure Catalog</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        <Form>
          <Form.Group controlId="catalogLabelSelect">
            <Form.Label>Catalog Name</Form.Label>
            <Form.Select
              value={catalogOptions.find(
                (option) => option.label === selectedCatalogLabel
              )?.value || ''}
              onChange={handleCatalogChange}
            >
              {catalogOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          <button type="button" onClick={handleSave} className="mt-3 btn offcanvas-save">
            Save
          </button>
        </Form>
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default EcommerceEditor;