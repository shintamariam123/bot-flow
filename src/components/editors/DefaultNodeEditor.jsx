import React, { useState, useEffect } from 'react';
import { FaCog, FaUser } from 'react-icons/fa';

const DefaultNodeEditor = ({ node, onClose, nodeContentMap, setNodeContentMap }) => {
  if (!node) return null;

  const { type } = node.data;

  // Common state: holds the saved data per node ID
  // const [nodeContentMap, setNodeContentMap] = useState({});

  // Text node states
  const [messageType, setMessageType] = useState('Custom');
  const [text, setText] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  // Image node state
  const [imagePreview, setImagePreview] = useState(null);

  // Shared delay
  const [delay, setDelay] = useState(0);

  // Load existing data when editing again
  useEffect(() => {
    if (!node?.id) return;

    const content = nodeContentMap[node.id];
    if (!content) {
      // Reset to defaults if no content
      setMessageType((prev) => prev || 'Custom'); // Only reset if not set
      setText('');
      setImagePreview(null);
      setDelay(0);
      return;
    }

    if (content.type === 'Text') {
      setMessageType(content.messageType || 'Custom');
      setText(content.text || '');
      setDelay(content.delay || 0);
    } else if (content.type === 'Image') {
      setImagePreview(content.image || null);
      setDelay(content.delay || 0);
    }
  }, [node?.id]);



  // Handle inserting variables into text
  const handleInsertVariable = (variable) => {
    setText((prev) => `${prev} {{${variable}}}`);
  };

  const handleDropdownSelect = (type) => {
    console.log('Dropdown selected:', type);
    setMessageType(type);
    setShowDropdown(false);
  };

  const handleImageUpload = (file) => {
    if (!file) return;

    const isImage = file.type === 'image/png' || file.type === 'image/jpeg';
    if (!isImage) {
      alert('Only PNG and JPG images are supported.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveContent = (content) => {
    if (!node?.id) return;

    const updatedMap = {
      ...nodeContentMap,
      [node.id]: content,
    };

    setNodeContentMap(updatedMap);
    // updateMap(node.id)
    console.log('Saved Node Content Map:', updatedMap);
    onClose();
  };

  return (
    <div style={{
      position: 'fixed', right: 0, top: 0, height: '100%', width: 400,
      background: '#fff', borderLeft: '1px solid #ccc', padding: 20, zIndex: 9999
    }}>
      <h4>{type} Node Editor</h4>

      {/* Text Node */}
      {type === 'Text' && (
        <div>
          <p>Configure Text Message</p>
          <p>Please provide your reply message</p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: 10 }}>
            <div style={{ position: 'relative' }}>
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                <FaCog style={{ marginRight: 5 }} />
                {messageType}
              </button>
              {showDropdown && (
                <ul style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  backgroundColor: '#fff',
                  border: '1px solid #ccc',
                  listStyle: 'none',
                  padding: 0,
                  margin: 0,
                  width: '150px',
                  zIndex: 1000
                }}>
                  {['Custom', 'Plain Text', 'Template', 'Dynamic Field'].map((option) => (
                    <li
                      key={option}
                      onClick={() => handleDropdownSelect(option)}
                      style={{
                        padding: '8px 12px',
                        cursor: 'pointer',
                        borderBottom: '1px solid #eee'
                      }}
                    >
                      {option}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <button
              type="button"
              className="btn btn-outline-secondary"
              title="Insert name variable"
              onClick={() => {
                handleInsertVariable('name');
                setMessageType('Name');
              }}

            >
              <FaUser style={{ marginRight: 5 }} />
              Name
            </button>
          </div>

          <textarea
            rows={4}
            style={{ width: '100%', marginBottom: '10px' }}
            placeholder="Type your reply..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />

          <p className="mt-2 mb-1">🕒 Delay in Reply: <strong>{delay} seconds</strong></p>
          <input
            type="range"
            min={0}
            max={30}
            step={1}
            value={delay}
            onChange={(e) => setDelay(parseInt(e.target.value))}
            style={{ width: '100%' }}
          />

          <div className='mt-4 d-flex justify-content-end'>
            <button className='btn offcanvas-close me-2' onClick={onClose}>Close</button>
            <button className='btn text-save' onClick={() => handleSaveContent({
              type: 'Text',
              messageType,
              text,
              delay
            })}>Save</button>
          </div>
        </div>
      )}

      {/* Image Node */}
      {type === 'Image' && (
        <div>
          <p>Configure Image</p>

          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const file = e.dataTransfer.files[0];
              handleImageUpload(file);
            }}
            onClick={() => document.getElementById('fileInput').click()}
            style={{
              border: '2px dashed #ccc',
              borderRadius: '8px',
              padding: '20px',
              textAlign: 'center',
              cursor: 'pointer',
              marginBottom: '15px'
            }}
          >
            <p>📤 Drop image here or click to upload</p>
            <p><small>Only .jpg or .png files supported</small></p>
            <input
              id="fileInput"
              type="file"
              accept=".jpg,.png"
              style={{ display: 'none' }}
              onChange={(e) => handleImageUpload(e.target.files[0])}
            />
            {imagePreview && (
              <div style={{ marginTop: '10px' }}>
                <img
                  src={imagePreview}
                  alt="Preview"
                  style={{ maxWidth: '100%', maxHeight: '200px' }}
                />
              </div>
            )}
          </div>

          <p className="mt-2 mb-1">🕒 Delay in Reply: <strong>{delay} seconds</strong></p>
          <input
            type="range"
            min={0}
            max={30}
            step={1}
            value={delay}
            onChange={(e) => setDelay(parseInt(e.target.value))}
            style={{ width: '100%' }}
          />

          <div className='mt-4 d-flex justify-content-end'>
            <button className='btn offcanvas-close me-2' onClick={onClose}>Close</button>
            <button className='btn text-save' onClick={() => handleSaveContent({
              type: 'Image',
              image: imagePreview,
              delay
            })}>Save</button>
          </div>
        </div>
      )}

      {/* YouTube Node Placeholder */}
      {type === 'YouTube' && (
        <div>
          <p>This is the YouTube Node Editor</p>
        </div>
      )}
    </div>
  );
};

export default DefaultNodeEditor;
