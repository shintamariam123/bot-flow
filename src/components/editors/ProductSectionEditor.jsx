import React, { useState, useEffect } from 'react';
import { Offcanvas, Form, Button } from 'react-bootstrap';

function ProductSectionEditor({show, onClose, nodeId, content, onSave}) {
    const [label, setLabel] = useState(content?.label || '');
  
    useEffect(() => {
      setLabel(content?.label || '');
    }, [content]);
  
   
     const handleSave = () => {
       event.preventDefault();
          const contentToSave = {
              label
          };
          onSave(nodeId, contentToSave);
          console.log('productsectionSave',contentToSave);
          
          onClose();
      };
  return (
    <Offcanvas show={show} onHide={onClose} placement="end">
      <Offcanvas.Header closeButton>
        {/* <Offcanvas.Title>Edit List Node</Offcanvas.Title> */}
      </Offcanvas.Header>
      <Offcanvas.Body>
        <h4 className='text-center mt-4'>Configure Section</h4>
        <Form>
          <Form.Group controlId="buttonLabel">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
            />
          </Form.Group>
          <button type='button' onClick={handleSave} className="mt-3 btn offcanvas-save">
            Save
          </button>
        </Form>
      </Offcanvas.Body>
    </Offcanvas>
  )
}

export default ProductSectionEditor