import React, { useState, useEffect } from 'react';
import { Offcanvas, Form, Button } from 'react-bootstrap';

const ProductEditor = ({ show, onClose, nodeId, content = {}, onSave }) => {
  // Define your static catalog options
  const catalogOptions = [
    { value: '', label: 'Select' }, // Default placeholder
    { value: 'My Product Catalog A', label: 'My Product Catalog A' },
    { value: 'Summer Collection', label: 'Summer Collection' },
    { value: 'Electronics Catalog', label: 'Electronics Catalog' },
    { value: 'Winter Wear', label: 'Winter Wear' },
  ];

  // State to store the *value* (ID) of the selected catalog for the <Form.Select>
  // This will directly control the dropdown.
  const [selectedCatalogId, setSelectedCatalogId] = useState('');

  // Effect to set the initial selected catalog ID when the component loads or content changes
  useEffect(() => {
    // When the content changes, find the corresponding value from content.label
    // or set to empty string if not found.
    const initialCatalog = catalogOptions.find(
      (option) => option.label === content?.label
    );
    setSelectedCatalogId(initialCatalog ? initialCatalog.value : '');
  }, [content]); // Rerun when `content` prop changes

  // Handle change in the select dropdown
  const handleCatalogChange = (e) => {
    setSelectedCatalogId(e.target.value); // Update the ID when selection changes
  };

  const handleSave = () => {
    // Find the label corresponding to the selectedCatalogId
    const currentSelectedOption = catalogOptions.find(
      (option) => option.value === selectedCatalogId
    );

    // Construct the data object exactly as you specified
    const dataToSave = {
      label: currentSelectedOption ? currentSelectedOption.label : '', // Save the label
      catalogId: selectedCatalogId, // Optionally save the ID as well if needed in future
    };

    console.log(`Saving data for Node ID: ${nodeId}`, dataToSave);
    onSave(nodeId, dataToSave);
    onClose();
  };

  return (
    <Offcanvas show={show} onHide={onClose} placement="end">
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>Configure Product</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        <Form>
          <Form.Group controlId="catalogSelect"> {/* Changed ID to be more generic */}
            <Form.Label>Product ID </Form.Label>
            <Form.Select
              value={selectedCatalogId} // Control the select with selectedCatalogId state
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

export default ProductEditor;