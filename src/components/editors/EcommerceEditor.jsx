import React, { useState, useEffect } from 'react';
import { Offcanvas, Form, Button } from 'react-bootstrap';

const EcommerceEditor = ({ show, onClose, nodeId, content = {}, onSave }) => {
  const [selectedCatalogId, setSelectedCatalogId] = useState(content?.catalogId || ''); // Changed state name to reflect purpose

  // Define your static catalog options
  const catalogOptions = [
    { value: '', label: 'Select a Catalog ID' }, // Optional: default placeholder
    { value: 'catalog_123', label: 'My Product Catalog A' },
    { value: 'catalog_456', label: 'Summer Collection' },
    { value: 'catalog_789', label: 'Electronics Catalog' },
    { value: 'catalog_abc', label: 'Winter Wear' },
  ];

 useEffect(() => {
    // Set the selectedCatalogId when the content prop changes (e.g., when a different node is selected)
    setSelectedCatalogId(content?.catalogId || '');
  }, [content]);

  const handleSave = () => {
  // When saving, send the selectedCatalogId back
    onSave(nodeId, { catalogId: selectedCatalogId }); // Changed 'label' to 'catalogId'
    onClose();
  };

  return (
    <Offcanvas show={show} onHide={onClose} placement="end">
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>Configure Catalog</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        <Form>
          <Form.Group controlId="catalogIdSelect"> {/* Changed controlId */}
            <Form.Label>Catalog ID</Form.Label>
            <Form.Select
              value={selectedCatalogId}
              onChange={(e) => setSelectedCatalogId(e.target.value)}
            >
              {catalogOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          <button type='button' onClick={handleSave} className="mt-3 btn offcanvas-save">
            Save
          </button>
        </Form>
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default EcommerceEditor;
