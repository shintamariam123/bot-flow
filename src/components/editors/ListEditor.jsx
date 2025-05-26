import React, { useState, useEffect } from 'react';
import { Offcanvas, Form, Button } from 'react-bootstrap';

const ListEditor = ({ show, onClose, nodeId, content = {}, onSave }) => {
  const [label, setLabel] = useState(content?.label || '');

  useEffect(() => {
    setLabel(content?.label || '');
  }, [content]);

  const handleSave = () => {
    onSave(nodeId, { label });
    onClose();
  };

  return (
    <Offcanvas show={show} onHide={onClose} placement="end">
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>Edit List Node</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        <Form>
          <Form.Group controlId="buttonLabel">
            <Form.Label>Label</Form.Label>
            <Form.Control
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
            />
          </Form.Group>
          <Button variant="primary" onClick={handleSave} className="mt-3">
            Save
          </Button>
        </Form>
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default ListEditor;
