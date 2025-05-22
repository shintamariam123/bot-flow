import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import FlowBuilder from './components/nodes/FlowBuilder';
import Dashboard from './components/nodes/Dashboard';
import './App.css'
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<FlowBuilder />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
