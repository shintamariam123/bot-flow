import React, { useState, useEffect } from 'react';
import { FaCog, FaUser } from 'react-icons/fa';
import optionsData from './js-data/optionsData.json';

// Destructure 'onSave' from props, along with existing 'node' and 'onClose'
const DefaultNodeEditor = ({ node, onClose, onSave }) => { // Removed nodeContentMap and setNodeContentMap from here
  if (!node) return null;

  const { type } = node.data; // Access type from node.data directly

  // Text node states
  const [messageType, setMessageType] = useState('Custom');
  const [text, setText] = useState('');
  const [showCustomDropdown, setShowCustomDropdown] = useState(false); // State for custom fields dropdown
  const [isTextReadOnly, setIsTextReadOnly] = useState(false); // New state for readOnly input

  // Image node state
  const [imagePreview, setImagePreview] = useState(null);

  // Audio node state
  const [audioPreview, setAudioPreview] = useState(null);

  // Video
  const [videoPreview, setVideoPreview] = useState(null);

  // File
  const [filePreview, setFilePreview] = useState(null);

  // location
  const [locationText, setLocationText] = useState('');

  // WhatsApp Flow
  const [flowType, setFlowType] = useState('');
  const [field1, setField1] = useState('');
  const [field2, setField2] = useState('');
  const [field3, setField3] = useState('');
  const [field4, setField4] = useState('');

  // Shared delay
  const [delay, setDelay] = useState(0);

  useEffect(() => {
    if (!node?.id) return;

    // Access content directly from node.data.content
    const content = node.data.content;
    if (!content) {
      // Reset states if no content is found for the node
      setMessageType('Custom');
      setText('');
      setImagePreview(null);
      setAudioPreview(null);
      setVideoPreview(null);
      setFilePreview(null);
      setLocationText('');
      setFlowType('');
      setField1('');
      setField2('');
      setField3('');
      setField4('');
      setDelay(0);
      setIsTextReadOnly(false);
      return;
    }

    // Populate states based on the loaded content
    if (content.type === 'Text') {
      setMessageType(content.messageType || 'Custom');
      setText(content.text || '');
      setDelay(content.delay || 0);
      const systemFullName = optionsData.system_fields_list[0]?.full_name || '';
      setIsTextReadOnly(content.text === systemFullName);
    } else if (content.type === 'Image') {
      setImagePreview(content.image || null);
      setDelay(content.delay || 0);
    } else if (content.type === 'Audio') {
      setAudioPreview(content.audio || null);
      setDelay(content.delay || 0);
    } else if (content.type === 'Video') {
      setVideoPreview(content.video || null);
      setDelay(content.delay || 0);
    } else if (content.type === 'File') {
      setFilePreview(content.file || null);
      setDelay(content.delay || 0);
    } else if (content.type === 'Location') {
      setLocationText(content.text || '');
      setDelay(content.delay || 0);
    } else if (content.type === 'WhatsappFlow') { // Make sure this matches your save type
      setFlowType(content.flowType || '');
      setField1(content.field1 || '');
      setField2(content.field2 || '');
      setField3(content.field3 || '');
      setField4(content.field4 || '');
      setDelay(content.delay || 0);
    }
  }, [node]); // Dependency only on 'node'

   const handleCustomDropdownSelect = (selectedOption) => {
    const systemFullName = optionsData.system_fields_list[0]?.full_name || '';
    if (text === systemFullName) {
      setText(selectedOption);
    } else {
      setText((prev) => `${prev}${prev ? ' ' : ''}${selectedOption}`); // Add space if text already exists
    }
    setMessageType('Custom'); // Keep messageType as 'Custom' or relevant
    setShowCustomDropdown(false);
    setIsTextReadOnly(false); // Make editable after selecting a custom field
  };

  const handleNameButtonClick = () => {
    const systemFullName = optionsData.system_fields_list[0]?.full_name || ''; // Assuming first system field for name
    setText(systemFullName);
    setMessageType('Name');
    setShowCustomDropdown(false); // Close custom dropdown if open
    setIsTextReadOnly(true); // Name field is read-only
  };

  const handleImageUpload = async (file) => {
    if (!file) return;
    const isImage = file.type === 'image/png' || file.type === 'image/jpeg';
    if (!isImage) {
      alert('Only PNG and JPG images are supported.');
      return;
    }
    const formData = new FormData();
    formData.append('file', file);
    try {
      const response = await fetch('http://localhost:3000/api/upload-media', { method: 'POST', body: formData, });
      const data = await response.json();
      if (data.fileUrl) {
        const fullUrl = `http://localhost:3000${data.fileUrl}`;
        console.log("Image uploaded:", fullUrl);
        setImagePreview(fullUrl);
      } else { console.error("Upload response error", data); }
    } catch (error) { console.error('Upload failed', error); }
  };

  const handleAudioUpload = async (file) => {
    if (!file) return;
    const isAudio = ['audio/mpeg', 'audio/wav', 'audio/mp3'].includes(file.type);
    if (!isAudio) {
      alert('Only MP3 and WAV audio files are supported.');
      return;
    }
    const formData = new FormData();
    formData.append('file', file);
    try {
      const response = await fetch('http://localhost:3000/api/upload-media', { method: 'POST', body: formData, });
      const data = await response.json();
      if (data.fileUrl) {
        const fullUrl = `http://localhost:3000${data.fileUrl}`;
        console.log("Audio uploaded:", fullUrl);
        setAudioPreview(fullUrl);
      } else { console.error("Upload response error", data); }
    } catch (error) { console.error('Audio upload failed', error); }
  };

  const handleVideoUpload = async (file) => {
    if (!file) return;
    const isVideo = ['video/mp4', 'video/x-flv', 'video/x-ms-wmv'].includes(file.type);
    if (!isVideo) {
      alert('Only MP4, FLV, and WMV video files are supported.');
      return;
    }
    const formData = new FormData();
    formData.append('file', file);
    try {
      const response = await fetch('http://localhost:3000/api/upload-media', { method: 'POST', body: formData, });
      const data = await response.json();
      if (data.fileUrl) {
        const fullUrl = `http://localhost:3000${data.fileUrl}`;
        console.log("Video uploaded:", fullUrl);
        setVideoPreview(fullUrl);
      } else { console.error("Upload response error", data); }
    } catch (error) { console.error('Video upload failed', error); }
  };

  const handleFileUpload = async (file) => {
    if (!file) return;
    const supportedTypes = [
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/pdf',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];
    if (!supportedTypes.includes(file.type)) {
      alert('Only DOC, DOCX, PDF, PPT, PPTX, XLS, and XLSX files are supported.');
      return;
    }
    const formData = new FormData();
    formData.append('file', file);
    try {
      const response = await fetch('http://localhost:3000/api/upload-media', { method: 'POST', body: formData, });
      const data = await response.json();
      if (data.fileUrl) {
        const fullUrl = `http://localhost:3000${data.fileUrl}`;
        console.log("File uploaded:", fullUrl);
        setFilePreview({
          name: file.name,
          url: fullUrl,
          type: file.type,
        });
      } else { console.error("Upload response error", data); }
    } catch (error) { console.error('File upload failed', error); }
  };


  // This function now calls the 'onSave' prop passed from FlowBuilder
  const handleSaveAndClose = (contentToSave) => {
    if (onSave) {
      onSave(node.id, contentToSave);
      console.log('Saved data:', contentToSave); // Confirm data in console
    }
    onClose(); // Close the editor after saving
  };

  return (
    <div className='editor p-3' >
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
                onClick={() => setShowCustomDropdown(!showCustomDropdown)}
              >
                <FaCog style={{ marginRight: 5 }} />
               Custom
              </button>
              {showCustomDropdown && (
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
                  {optionsData.custom_fields_list.map((option) => ( // Assuming this path
                    <li
                      key={option.id}
                      onClick={() => handleCustomDropdownSelect(option.name)}
                      style={{
                        padding: '8px 12px',
                        cursor: 'pointer',
                        borderBottom: '1px solid #eee'
                      }}
                    >
                      {option.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <button
              type="button"
              className="btn btn-outline-secondary"
              title="Insert name variable"
             onClick={handleNameButtonClick}   >
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
             readOnly={isTextReadOnly}
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
            <button
              className='btn offcanvas-close me-2'
              onClick={onClose}
            >
              Close
            </button>
            <button className='btn text-save' onClick={() => handleSaveAndClose({
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
            <button
              className='btn offcanvas-close me-2'
              onClick={onClose}
            >
              Close
            </button>
            <button className='btn text-save' onClick={() => handleSaveAndClose({ type: 'Image', image: imagePreview, delay })}>Save</button>
          </div>
        </div>
      )}
      {/* Video Node Placeholder */}
      {type === 'Video' && (
        <div>
          <p>Configure Video</p>

          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const file = e.dataTransfer.files[0];
              handleVideoUpload(file);
            }}
            onClick={() => document.getElementById('videoInput').click()}
            style={{
              border: '2px dashed #ccc',
              borderRadius: '8px',
              padding: '20px',
              textAlign: 'center',
              cursor: 'pointer',
              marginBottom: '15px'
            }}
          >
            <p>🎥 Drop video file here or click to upload</p>
            <p><small>Only .mp4, .flv, and .wmv files supported</small></p>
            <input
              id="videoInput"
              type="file"
              accept=".mp4,.flv,.wmv,video/*"
              style={{ display: 'none' }}
              onChange={(e) => handleVideoUpload(e.target.files[0])}
            />
            {videoPreview && (
              <div style={{ marginTop: '10px' }}>
                <video controls style={{ maxWidth: '100%', maxHeight: '200px' }}>
                  <source src={videoPreview} />
                  Your browser does not support the video tag.
                </video>
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
            <button
              className='btn offcanvas-close me-2'
              onClick={onClose}
            >
              Close
            </button>
            <button className='btn text-save' onClick={() => handleSaveAndClose({ type: 'Video', video: videoPreview, delay })}>Save</button>
          </div>
        </div>
      )}
      {/* audio */}
      {type === 'Audio' && (
        <div>
          <p>Configure Audio</p>

          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const file = e.dataTransfer.files[0];
              handleAudioUpload(file);
            }}
            onClick={() => document.getElementById('audioInput').click()}
            style={{
              border: '2px dashed #ccc',
              borderRadius: '8px',
              padding: '20px',
              textAlign: 'center',
              cursor: 'pointer',
              marginBottom: '15px'
            }}
          >
            <p>🎙️ Drop audio file here or click to upload</p>
            <p><small>Only .mp3 or .wav files supported</small></p>
            <input
              id="audioInput"
              type="file"
              accept=".mp3,.wav,audio/*"
              style={{ display: 'none' }}
              onChange={(e) => handleAudioUpload(e.target.files[0])}
            />
            {audioPreview && (
              <div style={{ marginTop: '10px' }}>
                <audio controls src={audioPreview} style={{ width: '100%' }} />
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
            <button
              className='btn offcanvas-close me-2'
              onClick={onClose}
            >
              Close
            </button>
            <button className='btn text-save' onClick={() => handleSaveAndClose({ type: 'Audio', audio: audioPreview, delay })}>Save</button>
          </div>
        </div>
      )}
      {/* file */}
      {type === 'File' && (
        <div>
          <p>Configure File</p>

          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const file = e.dataTransfer.files[0];
              handleFileUpload(file);
            }}
            onClick={() => document.getElementById('fileUploadInput').click()}
            style={{
              border: '2px dashed #ccc',
              borderRadius: '8px',
              padding: '20px',
              textAlign: 'center',
              cursor: 'pointer',
              marginBottom: '15px'
            }}
          >
            <p>📤 Drop file here or click to upload</p>
            <p><small>Only .doc, .docx, .pdf, .ppt, .pptx, .xls, .xlsx files supported</small></p>

            <input
              id="fileUploadInput"
              type="file"
              accept=".doc,.docx,.pdf,.ppt,.pptx,.xls,.xlsx,application/*"
              style={{ display: 'none' }}
              onChange={(e) => handleFileUpload(e.target.files[0])}
            />

            {filePreview && (
              <div style={{ marginTop: '10px' }}>
                <p><strong>{filePreview.name}</strong></p>
                <a href={filePreview.url} download target="_blank" rel="noreferrer">Download</a>
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
            <button
              className='btn offcanvas-close me-2'
              onClick={onClose}
            >
              Close
            </button>
            <button className='btn text-save' onClick={() => handleSaveAndClose({ type: 'File', file: filePreview, delay })}>Save</button>
          </div>
        </div>
      )}
      {/* location */}
      {type === 'Location' && (
        <div>
          <p>Please provide body text*</p>

          <textarea
            rows={4}
            type='text'
            style={{ width: '100%', marginBottom: '10px' }}
            placeholder="Type your reply..."
            value={locationText}
            onChange={(e) => setLocationText(e.target.value)}
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
            <button
              className='btn offcanvas-close me-2'
              onClick={onClose}
            >
              Close
            </button>
            <button className='btn text-save' onClick={() => handleSaveAndClose({
              type: 'Location',
              text: locationText,
              delay
            })}>Save</button>
          </div>
        </div>
      )}
      {/* Whatsapp */}
      {type === 'Whatsapp' && (
        <div>
          <p>Configure WhatsApp Flow</p>

          {/* Dropdown */}
          <div className="mb-2">
            <label htmlFor="flowType" className="form-label">Flow Type</label>
            <select
              id="flowType"
              className="form-select"
              value={flowType}
              onChange={(e) => setFlowType(e.target.value)}
            >
              <option value="" disabled hidden>Select Flow Type</option>
              {optionsData.whatsapp_flow_list.map((label) => (
                <option key={label.id} value={label.name}>{label.name}</option>

              ))}

            </select>
          </div>

          {/* Input Fields */}
          <div className="mb-2 d-flex flex-column">
            <label htmlFor="field1" className="form-label">Message Header*</label>
            <input
              type="text"

              id="field1"
              value={field1}
              onChange={(e) => setField1(e.target.value)}
            />
          </div>

          <div className="mb-2 d-flex flex-column">
            <label htmlFor="field2" className="form-label">Message Body*</label>
            <textarea
              type="text"
              rows={4}

              id="field2"
              value={field2}
              onChange={(e) => setField2(e.target.value)}

            />
          </div>

          <div className="mb-2 d-flex flex-column">
            <label htmlFor="field3" className="form-label">Message Footer</label>
            <input
              type="text"

              id="field3"
              value={field3}
              onChange={(e) => setField3(e.target.value)}

            />
          </div>

          <div className="mb-2 d-flex flex-column">
            <label htmlFor="field4" className="form-label">Footer Button Text*</label>
            <input
              type="text"

              id="field4"
              value={field4}
              onChange={(e) => setField4(e.target.value)}

            />
          </div>

          <p className="mt-2 mb-1">🕒 Delay in Reply: <strong>{delay} seconds</strong></p>
          <input type="range" min={0}
            max={30}
            step={1}
            value={delay}
            onChange={(e) => setDelay(parseInt(e.target.value))}
            style={{ width: '100%' }}
          />

          <div className='mt-4 d-flex justify-content-end'>
            <button className='btn offcanvas-close me-2' onClick={onClose}>Close</button>
            <button className='btn text-save' onClick={() => handleSaveAndClose({
              type: 'Whatsapp', // Changed from 'WhatsappFlow' to 'Whatsapp' for consistency with node.data.type
              flowType,
              field1,
              field2,
              field3,
              field4,
              delay
            })}>
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DefaultNodeEditor;