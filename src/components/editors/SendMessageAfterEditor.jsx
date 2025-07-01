import React, { useEffect, useState } from 'react';
import Offcanvas from 'react-bootstrap/Offcanvas';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Icon } from '@iconify/react';
import data from './js-data/optionsData.json';

function SendMessageAfterEditor({ node, content, onSave, onClose }) {
  const [is24HourWindowEnabled, setIs24HourWindowEnabled] = useState(false);
  const [isDailySequenceEnabled, setIsDailySequenceEnabled] = useState(false);
  const [scheduleAfterTime, setScheduleAfterTime] = useState(content?.scheduleAfterTime || '');
  const [selectedTemplate, setSelectedTemplate] = useState(content?.selectedTemplate || '');
  const [scheduleForDay, setScheduleForDay] = useState(content?.scheduleForDay || '');

  useEffect(() => {
    if (node) {
      setIs24HourWindowEnabled(content?.is24HourWindowEnabled || false);
      setIsDailySequenceEnabled(content?.isDailySequenceEnabled || false);
      setScheduleAfterTime(content?.scheduleAfterTime || '');
      setSelectedTemplate(content?.selectedTemplate || '');
      setScheduleForDay(content?.scheduleForDay || '');
    }
  }, [node, content]);

  const handleToggle24HourWindow = () => {
    setIs24HourWindowEnabled(true);
    setIsDailySequenceEnabled(false);
  };

  const handleToggleDailySequence = () => {
    setIsDailySequenceEnabled(true);
    setIs24HourWindowEnabled(false);
  };

  const handleSave = () => {
    const savedData = {
      is24HourWindowEnabled,
      isDailySequenceEnabled,
      scheduleAfterTime: is24HourWindowEnabled ? scheduleAfterTime : null,
      selectedTemplate: isDailySequenceEnabled ? selectedTemplate : null,
      scheduleForDay: isDailySequenceEnabled ? scheduleForDay : null,
    };
    console.log("Saved Sequence Editor Data:", savedData);
    onSave(node.id, savedData);
  };

  const timeOptions = [
    '5 minutes', '10 minutes', '15 minutes', '30 minutes', '1 hour', '2 hours',
    '4 hours', '6 hours', '12 hours', '23 hours'
  ];

  const dayOptions = Array.from({ length: 31 }, (_, i) => `Day ${i + 1}`);

  if (!node) {
    return null;
  }

  return (
    <Offcanvas show={!!node} onHide={onClose} placement="end">
      <Offcanvas.Header closeButton></Offcanvas.Header>
      <Offcanvas.Body className='mt-3'>
        <h4 className='text-center'>Configure New Sequence</h4>

        {/* Dotted Border Sections */}
        <div style={{
          border: '2px dotted #ffad60',
          backgroundColor: 'rgb(252, 244, 237)',
          padding: '10px',
          borderRadius: '5px',
          marginBottom: '20px',
          marginTop: '20px'
        }}>
          <p>Optimize engagement through personalized messaging. Craft content, timing, and audience per message for effectiveness. Customize sequences for campaign goals and choose preferred scheduling</p>
        </div>
        <div style={{
          border: '2px dotted rgb(96, 255, 101)',
          backgroundColor: 'rgb(244, 255, 243)',
          padding: '10px',
          borderRadius: '5px',
          marginBottom: '20px',
          marginTop: '20px'
        }}>
          <p>Option 1 Immediate Impact (Inside 24-Hour Window) : Send messages within 24 hours for higher visibility. </p>
        </div>
        <div style={{
          border: '2px dotted rgb(96, 255, 101)',
          backgroundColor: 'rgb(244, 255, 243)',
          padding: '10px',
          borderRadius: '5px',
          marginBottom: '20px',
          marginTop: '20px'
        }}>
          <p>Option 2 - Consistent Outreach (Daily Sequence) Plan messages outside 24 hours for ongoing communication.</p>
        </div>

        <Form>
          {/* Toggle for Schedule Message within 24-Hour Window */}
          <div
            className=" text-dark " // Always light background
            style={{ cursor: 'pointer', transition: 'background-color 0.3s ease' }}
            onClick={handleToggle24HourWindow}
          ><p className='m-0'>
              <Icon
                icon="mdi:toggle-switch"
                width="50"
                height="50"
                className="me-1"
                color={is24HourWindowEnabled ? 'green' : 'grey'} // Conditional color for the icon
              />
              Schedule Message within 24 - Hour Window</p>
          </div>



          {/* Toggle for Schedule Message for Daily Sequence (Outside 24-Hour Window) */}
          <div
            className=" mb-3 text-dark " // Always light background
            style={{ cursor: 'pointer', transition: 'background-color 0.3s ease' }}
            onClick={handleToggleDailySequence}
          > <p className='m-0'>
              <Icon
                icon="mdi:toggle-switch"
                width="50" // Adjusted width to match the other one
                height="50" // Adjusted height to match the other one
                className="me-1"
                color={isDailySequenceEnabled ? 'green' : 'grey'} // Conditional color for the icon
              />
              Schedule Message for Daily Sequence  (Outside 24 - Hour Window)</p>
          </div>


          {/* Conditional Dropdown for 24-Hour Window */}
          {is24HourWindowEnabled && (
            <Form.Group className="mb-3" controlId="scheduleMessageAfter">
              <Form.Label>Schedule Message After</Form.Label>
              <Form.Select
                value={scheduleAfterTime}
                onChange={(e) => setScheduleAfterTime(e.target.value)}
              >
                <option value="">Select Time</option>
                {timeOptions.map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          )}


          {/* Conditional Dropdowns for Daily Sequence */}
          {isDailySequenceEnabled && (
            <>
              <Form.Group className="mb-3" controlId="selectTemplate">
                <Form.Label>Select Template</Form.Label>
                <Form.Select
                  value={selectedTemplate}
                  onChange={(e) => setSelectedTemplate(e.target.value)}
                >
                  <option value="">Select Template</option>
                  {data.template_canvas_message && data.template_canvas_message.map((template) => (
                    <option key={template.id} >
                      {template.template_name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3" controlId="scheduleMessageFor">
                <Form.Label>Schedule Message For</Form.Label>
                <Form.Select
                  value={scheduleForDay}
                  onChange={(e) => setScheduleForDay(e.target.value)}
                >
                  <option value="">Select Day</option>
                  {dayOptions.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </>
          )}

          <button className='btn offcanvas-save' onClick={handleSave}>
            Save
          </button>
        </Form>
      </Offcanvas.Body>
    </Offcanvas>
  );
}

export default SendMessageAfterEditor;