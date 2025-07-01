import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import FlowBuilder from './components/nodes/FlowBuilder';
import Dashboard from './components/nodes/Dashboard';
import './App.css'
import { ReactFlowProvider } from '@xyflow/react';

function App() {
  return (
    <BrowserRouter>
      <ReactFlowProvider>

        <Routes>
          <Route path="/" element={<FlowBuilder />} />
           {/* NEW: Route for editing a bot, passing the botId as a URL parameter */}
          <Route path="/edit/:botId" element={<FlowBuilder />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </ReactFlowProvider>

    </BrowserRouter>
  );
}

export default App;
