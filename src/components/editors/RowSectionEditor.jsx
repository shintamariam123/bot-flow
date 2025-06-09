import React, { useState, useEffect } from 'react';
import { Offcanvas, Form, Button } from 'react-bootstrap';

function RowSectionEditor({ show, onClose, nodeId, content, onSave }) {
  const [label, setLabel] = useState(content?.label || '');
  const [description, setDescription] = useState(content?.description || '');

  useEffect(() => {
    setLabel(content?.label || '');
    setDescription(content?.description || '')
  }, [content]);


  const handleSave = () => {
    event.preventDefault();
    const contentToSave = {
      label, description
    };
    onSave(nodeId, contentToSave);
    console.log('rowSave', contentToSave);

    onClose();
  };

  return (
    <Offcanvas show={show} onHide={onClose} placement="end">
      <Offcanvas.Header closeButton>
        {/* <Offcanvas.Title>Edit List Node</Offcanvas.Title> */}
      </Offcanvas.Header>
      <Offcanvas.Body>
        <h4 className='text-center mt-4'>Configure Row</h4>
        <Form>
          <Form.Group controlId="buttonLabel">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
            />
            <Form.Label className='mt-3'>Description</Form.Label>
            <Form.Control type='textarea' value={description}
              onChange={(e) => setDescription(e.target.value)}></Form.Control>
          </Form.Group>
          <button type='button' onClick={handleSave} className="mt-3 btn offcanvas-save">
            Save
          </button>
        </Form>
      </Offcanvas.Body>
    </Offcanvas>)
}

export default RowSectionEditor