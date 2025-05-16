import React, { useState, useEffect } from 'react';
import data from './js-data/optionsData.json'

const StartBotEditor = ({ isOpen, onClose, savedData, setSavedData }) => {
  if (!isOpen) return null;
  // form data
  const [formData, setFormData] = useState({
    keywords: '',
    matchType: 'exact',
    title: '',
    addLabel: '',
    removeLabel: '',
    subscribeSequence: '',
    unsubscribeSequence: '',
    assignTo: '',
    webhookURL: ''
  });



  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newForm = { ...prev, [name]: value };
      console.log("Form Data on change:", newForm); // logs every input change
      return newForm;
    });
  };

  const handleMatchTypeSelect = (type) => {
    setFormData(prev => ({ ...prev, matchType: type }));
  };
  const handleSave = () => {
    console.log("Save button clicked, formData:", formData); // logs on save
    setSavedData(formData);
    onClose();
  };
  useEffect(() => {
    console.log("Saved Data changed:", savedData);
  }, [savedData]);



  return (
    <div style={{
      position: 'fixed', right: 0, top: 0, height: '100%', width: 400,
      background: '#fff', borderLeft: '1px solid #ccc', padding: 20, zIndex: 9999
    }}>
      <div className="offcanvas-header">
        <h5 id="offcanvasRightLabel">Configure Reference</h5>
        <button onClick={onClose} type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
      </div>
      <div className="offcanvas-body"
        style={{
          height: 'calc(100% - 60px)',
          overflowY: 'scroll',
          overflowX: 'hidden',
          scrollbarWidth: 'none',       // Firefox
          msOverflowStyle: 'none',      // IE
          WebkitOverflowScrolling: 'touch',
        }}>
        <p>Write down the keywords for which the bot will be triggered</p>
        <input type="text" placeholder='Hello, Hi, Start' name='keywords' value={formData.keywords} onChange={handleInputChange} />
        <p>Send reply based on your matching type</p>
        <div className='d-flex'>
          <button
            type="button"
            className={`btn ${formData.matchType === 'exact' ? 'btn-success' : 'btn-outline-secondary'}`}
            onClick={() => handleMatchTypeSelect('exact')}
          >
            Exact keyword match
          </button>
          <button
            type="button"
            className={`btn ${formData.matchType === 'string' ? 'btn-success' : 'btn-outline-secondary'}`}
            onClick={() => handleMatchTypeSelect('string')}
          >
            String match
          </button>
        </div>
        <label className='mt-4' htmlFor="title">Title</label>
        <input id='title' name='title' type="text" value={formData.title} onChange={handleInputChange} />

        <label className='mt-2' htmlFor="add_label">Add label</label>
        <br />
        <select name="addLabel" id="add_label" className="no-arrow" value={formData.addLabel} onChange={handleInputChange}>
          <option value="" disabled hidden >Select</option>
          {data.group_label_list.map((label) => (
            <option key={label.id} value={label.label_name}>
              {label.label_name}
            </option>
          ))}

        </select>

        <label className='mt-2' htmlFor="remove_label">Remove label</label>
        <br />
        <select name="removeLabel" value={formData.removeLabel} onChange={handleInputChange} id="remove_label" className="no-arrow">
          <option value="" disabled hidden>Select</option>
          {data.group_label_list.map((label) => (
            <option key={label.id} value={label.label_name}>
              {label.label_name}
            </option>
          ))}
        </select>


        <label className='mt-2' htmlFor="subscribe">Subscribe to Sequence</label>
        <br />
        <select name="subscribeSequence" id="subscribe" value={formData.subscribeSequence} onChange={handleInputChange} className="no-arrow">
          <option value="" disabled hidden>Select</option>
          {data.sequence_list.map((sequence) => (
            <option key={sequence.id} value={sequence.campaign_name}>
              {sequence.campaign_name}
            </option>
          ))}
        </select>


        <label className='mt-2' htmlFor="unsubscribe">Unsubscribe to Sequence</label>
        <br />
        <select name="unsubscribeSequence" value={formData.unsubscribeSequence} onChange={handleInputChange} className="no-arrow">
          <option value="" disabled hidden>Select</option>
          {data.sequence_list.map((sequence) => (
            <option key={sequence.id} value={sequence.campaign_name}>
              {sequence.campaign_name}
            </option>
          ))}
        </select>


        <label className='mt-2' htmlFor="assign">Assign conversation to a user</label>
        <br />
        <select name="assignTo" value={formData.assignTo} onChange={handleInputChange} className="no-arrow">
          <option value="" disabled hidden>Select Team Member</option>
          {data.agent_list.map((agent) => (
            <option key={agent.id} value={agent.name}>
              {agent.name}
            </option>
          ))}
        </select>

        <label className='mt-2' htmlFor="url">Send data to Webhook URL</label>
        <input name='webhookURL' type="text" value={formData.webhookURL} onChange={handleInputChange} />

        <button className='btn offcanvas-save mt-3' onClick={handleSave} >Save</button>
      </div>
    </div>
  );
};

export default StartBotEditor;
