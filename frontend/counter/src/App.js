import Login from './Login';
import Homepage from './Homepage';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import React, { useState } from 'react';

function App() {
  const [counters, setCounters] = useState([]);
  const [counterId, setCounterId] = useState('');

  return (
    <Routes>
    <Route path="/login" element={<Login counterId={counterId} setCounterId={setCounterId} counters={counters} setCounters={setCounters}/>} />
    <Route path="/homepage" element={<Homepage counterId={counterId} />} />
    </Routes>
  );
}

export default App;