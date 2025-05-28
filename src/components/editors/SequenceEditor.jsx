// SequenceEditor.jsx
import React, { useEffect, useState } from 'react';
import Offcanvas from 'react-bootstrap/Offcanvas';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import data from './js-data/optionsData.json'
// --- Dummy Data for Dropdowns (Replace with your actual data) ---


const preferredDeliveryTimes = [
 '01:00 AM','02:00 AM','03:00 AM','04:00 AM','05:00 AM','06:00 AM', '07:00 AM','08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
  '13:00 PM', '14:00 PM', '15:00 PM', '16:00 PM', '17:00 PM',
  '18:00 PM', '19:00 PM', '20:00 PM','21:00 PM','22:00 PM','23:00 PM','24:00 PM'
];

// A selection of common time zones, you'll likely need a more comprehensive list
const timeZones = [
  { value: 'Asia/Kolkata', label: 'India Standard Time (IST)' }, // Current location's timezone
  { value: 'America/New_York', label: 'Eastern Time (ET)' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
  { value: 'Europe/London', label: 'Greenwich Mean Time (GMT)' },
  { value: 'Asia/Tokyo', label: 'Japan Standard Time (JST)' },
  { value: 'Australia/Sydney', label: 'Australian Eastern Standard Time (AEST)' },
];
// --- End Dummy Data ---

function SequenceEditor({ node, content, onSave, onClose }) {

   const { sequence_list } = data;
  const [editorContent, setEditorContent] = useState(content?.message || '');
  const [selectedCampaign, setSelectedCampaign] = useState(content?.campaignId || '');
  const [selectedDeliveryTime, setSelectedDeliveryTime] = useState(content?.deliveryTime || '');
  const [selectedTimeZone, setSelectedTimeZone] = useState(content?.timeZone || '');

  useEffect(() => {
    if (node) {
      setEditorContent(content?.message || '');
      setSelectedCampaign(content?.campaignId || '');
      setSelectedDeliveryTime(content?.deliveryTime || '');
      setSelectedTimeZone(content?.timeZone || '');
    }
  }, [node, content]);

   const handleSave = () => {
    // Create an object with all the data to be saved
    const dataToSave = {
      
      campaignName: selectedCampaign,
      deliveryTime: selectedDeliveryTime,
      timeZone: selectedTimeZone,
    };

    // Log the data to the console to verify
    console.log("Saving Sequence Editor Data:", dataToSave);

    // Call the onSave function passed from FlowBuilder with the data
    onSave(dataToSave);
  };

  if (!node) {
    return null;
  }

  return (
    <Offcanvas show={!!node} onHide={onClose} placement="end">
      <Offcanvas.Header closeButton>
        {/* The close button is handled by React-Bootstrap */}
      </Offcanvas.Header>
      <Offcanvas.Body className='mt-3'>
        <h4 className='text-center'>Configure New Sequence</h4>

        {/* Dotted Border Section */}
        <div style={{
          border: '2px dotted #ffad60', // Light orange border
          backgroundColor: 'rgb(252, 244, 237)', // Lighter orange background
          padding: '15px',
          borderRadius: '5px',
          marginBottom: '20px',
          marginTop: '20px'
        }}>
          <p>Effortlessly engage your audience with a Sequence Message Campaign. Set up a series of messages to be delivered at specific time intervals, ensuring timely and relevant communication. Whether it's delivering valuable content, nurturing lrads, or guiding users through a process, this campaign type lets you create a seamless and automated journey that keeps your audience informed and engaged.</p>
        </div>

        <Form>
          {/* Sequence Campaign Name Dropdown */}
         <Form.Group className="mb-3" controlId="sequenceCampaignName">
            <Form.Label>Sequence Campaign Name</Form.Label>
            <Form.Select
              value={selectedCampaign}
              onChange={(e) => setSelectedCampaign(e.target.value)}
            >
              <option value="">Select a campaign</option>
              {sequence_list.map((campaign) => (
                <option key={campaign.id}>
                  {campaign.campaign_name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          {/* Preferred Delivery Time Dropdown */}
          <Form.Group className="mb-3" controlId="preferredDeliveryTime">
            <Form.Label>Preferred Delivery Time for messages scheduled outside the 24-hour window</Form.Label>
            <Form.Select
              value={selectedDeliveryTime}
              onChange={(e) => setSelectedDeliveryTime(e.target.value)}
            >
              <option value="">Select a time</option>
              {preferredDeliveryTimes.map((time, index) => (
                <option key={index} value={time}>
                  {time}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          {/* Time Zone Dropdown */}
          <Form.Group className="mb-3" controlId="timeZone">
            <Form.Label>Time Zone</Form.Label>
            <Form.Select
              value={selectedTimeZone}
              onChange={(e) => setSelectedTimeZone(e.target.value)}
            >
              <option value="">Select a time zone</option>
              {timeZones.map((tz) => (
                <option key={tz.value} value={tz.value}>
                  {tz.label}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

        

          <Button className='btn offcanvas-save' onClick={handleSave}>
            Save 
          </Button>
        </Form>
      </Offcanvas.Body>
    </Offcanvas>
  );
}

export default SequenceEditor;