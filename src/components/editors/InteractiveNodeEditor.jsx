import React, { useState, useEffect } from 'react';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { Button, ButtonGroup, Form } from 'react-bootstrap';
import { FaFont, FaImage, FaCog ,FaUser} from 'react-icons/fa';
import data from './js-data/optionsData.json';


const InteractiveNodeEditor = ({ show, onClose, nodeId, content, onSave }) => {
    const [selectedTab, setSelectedTab] = useState('text'); // 'text' or 'media'
   
    const [messageType, setMessageType] = useState('Custom'); // Custom or Name
    const [dropdownValue, setDropdownValue] = useState('');
    const [dropText, setDropText] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);

    const [text, setText] = useState('');

    const [mediaUrl, setMediaUrl] = useState('');
    const [footer, setFooter] = useState('');
    const [delay, setDelay] = useState(0);

    useEffect(() => {

        if (!content || !nodeId) return; // guard clause
        // const content = interactiveContent[nodeId] || {};
        if (content) {
            setSelectedTab(content.type || 'text');
            setMessageType(content.messageType || 'Custom');
            setDropdownValue(content.dropdownValue || '');
            setText(content.body || '');
            setMediaUrl(content.mediaUrl || '');
            setFooter(content.footer || '');
            setDelay(content.delay || 0);
            setDropText(content.body || '');
        }
    }, [nodeId, content]);

    const handleDropdownSelect = (item) => {
        const value = item.name || item.full_name;
        setDropdownValue(value);

        if (messageType === 'Name') {
            setDropText(`{{${value}}}`); // Show in bottom input
        } else {
            setDropText(value); // Show custom value as-is
        }

        setShowDropdown(false);
    };



    const handleImageUpload = async (file) => {
        if (!file) return;
        const isImage = file.type === 'image/png' || file.type === 'image/jpeg';
        if (!isImage) return alert('Only PNG and JPG files allowed.');
        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch('http://localhost:3000/api/upload-media', { method: 'POST', body: formData });
            const data = await res.json();
            if (data.fileUrl) {
                const fullUrl = `http://localhost:3000${data.fileUrl}`;
                setMediaUrl(fullUrl);
            }
        } catch (err) {
            console.error('Upload failed', err);
        }
    };
    const handleSave = () => {
        const content = {
            type: selectedTab,
            messageType,
            dropdownValue,
            footer,
            delay,
            body: selectedTab === 'text' ? text : dropText,
            mediaUrl: selectedTab === 'media' ? mediaUrl : ''  // ✅ Ensure mediaUrl is included
        };
        console.log('Saved node content:', content);
        onSave?.(nodeId, content);
        onClose();
    };




    const options = messageType === 'Name' ? data.system_fields_list : data.custom_fields_list;

    return (
        <Offcanvas show={show} onHide={onClose} placement="end">
            <Offcanvas.Header closeButton>
                <Offcanvas.Title>Edit Interactive Node</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
                {/* Tab Buttons */}
                <p>Message Header (optional)</p>
                <ButtonGroup className="mb-3">
                    <Button variant={selectedTab === 'text' ? 'primary' : 'outline-primary'} onClick={() => setSelectedTab('text')}>
                        <FaFont className="me-2" />Text
                    </Button>
                    <Button variant={selectedTab === 'media' ? 'primary' : 'outline-primary'} onClick={() => setSelectedTab('media')}>
                        <FaImage className="me-2" />Media
                    </Button>
                </ButtonGroup>

                {/* Text Input */}
                {selectedTab === 'text' && (
                    <>
                        <Form.Label>Text </Form.Label>
                        <input
                            type='text'
                            rows={4}
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            className="mb-3" placeholder='Provide text for header'
                        />
                    </>
                )}

                {/* Media Upload */}
                {selectedTab === 'media' && (
                    <>
                        <Form.Label>Upload Media</Form.Label>
                        <Form.Control type="file" accept="image/png, image/jpeg" onChange={(e) => handleImageUpload(e.target.files[0])} className="mb-2" />
                        {mediaUrl && <img src={mediaUrl} alt="Preview" style={{ width: '100%', borderRadius: '8px', height: '250px' }} />}
                    </>
                )}

                {/* MessageType Selector */}
                {/* Message Type Tabs */}
                <p className="mt-4 mb-2">Message Body Type</p>
                <ButtonGroup className="mb-3">
                    <Button className='rounded-1' style={{width:'120px',height:'50px',color:'black'}}
                        variant={messageType === 'Custom' ? 'secondary' : 'outline-secondary'}
                        onClick={() => {
                            setMessageType('Custom');
                            setDropdownValue('');
                            setDropText('');
                            setShowDropdown(true);
                        }}
                    >
                         <FaCog style={{ marginRight: 5 }} />Custom
                    </Button>
                    <Button className='ms-3 rounded-1' style={{width:'120px',height:'50px',color:'black'}}
                        variant={messageType === 'Name' ? 'secondary' : 'outline-secondary'}
                        onClick={() => {
                            setMessageType('Name');
                            setDropdownValue('');
                            setDropText('');
                            setShowDropdown(true);
                        }}
                    >
                        <FaUser style={{ marginRight: 5 }} />
                        Name                    </Button>
                </ButtonGroup>

                <div className="mb-3 position-relative">
                  
                    {showDropdown && (
                        <ul
                            className="position-absolute bg-white border list-unstyled p-0  w-100"
                            style={{ zIndex: 10 }}
                        >
                            {options.map((item) => (
                                <li
                                    key={item.id}
                                    onClick={() => handleDropdownSelect(item)}
                                    className="p-2 border-bottom"
                                    style={{ cursor: 'pointer' }}
                                >
                                    {item.name || item.full_name}
                                </li>
                            ))}
                        </ul>
                    )}

                    {/* Input Field Below Dropdown */}
                    <input
                        type="text"
                        className="form-control mb-3 mt-2"
                        value={dropText}
                        onChange={(e) => {
                            if (messageType === 'Custom') setDropText(e.target.value);
                        }}
                        placeholder={
                            messageType === 'Name'
                                ? 'Field will be shown here'
                                : 'Type your custom message'
                        }
                        readOnly={messageType === 'Name'}
                    />
                </div>




                {/* Footer & Delay */}
                <Form.Label className="mt-3">Message Footer (Optional)</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="Provide footer text"
                    value={footer}
                    onChange={(e) => setFooter(e.target.value)}
                    className="mb-3"
                />
                <p className="mt-2 mb-1">🕒 Delay in Reply: <strong>{delay} seconds</strong></p>
                <input type="range" min={0} max={30} step={1} value={delay} onChange={(e) => setDelay(parseInt(e.target.value))}
                    style={{ width: '100%' }} />
                {/* Save Button */}
                <button className="btn offcanvas-save" onClick={handleSave}>Save</button>
            </Offcanvas.Body>
        </Offcanvas>
    );
};

export default InteractiveNodeEditor;
