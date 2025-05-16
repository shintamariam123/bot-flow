
import React, { useState, useEffect } from 'react';

const OffCanvasEditor = ({ isOpen, nodeData, onClose, onSave }) => {
  const [label, setLabel] = useState('');

  useEffect(() => {
    if (nodeData) {
      setLabel(nodeData.label || '');
    }
  }, [nodeData]);

  const handleSave = () => {
    onSave({ ...nodeData, label });
  };

  if (!isOpen) return null;

  return (
    <div className='canvas-div' style={{
  position: 'fixed',
  top: 0,
  right: 0,
  height: '100%',
  width: 300,
  background: '#f8f9fa',
  boxShadow: '-2px 0 5px rgba(0,0,0,0.3)',
  padding: 20,
  zIndex: 1000,
  overflowY: 'scroll',
  overflowX: 'hidden',
  scrollbarWidth: 'none',
  msOverflowStyle: 'none',
  WebkitOverflowScrolling: 'touch'}}>
      <h3>Edit Node</h3>
      <label>Label:</label>
      <input
        type="text"
        value={label}
        onChange={(e) => setLabel(e.target.value)}
        style={{ width: '100%', padding: 8, marginBottom: 10 }}
      />
      <button onClick={handleSave} style={{ marginRight: 10 }}>Save</button>
      <button onClick={onClose}>Cancel</button>
    </div>
  );
};

export default OffCanvasEditor;