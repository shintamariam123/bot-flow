import React from 'react';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: 20 }}>
      <h2>Dashboard</h2>

      <button className='btn save-flow' onClick={() => navigate('/')}>Back to Builder</button>
    </div>
  );
}

export default Dashboard;
