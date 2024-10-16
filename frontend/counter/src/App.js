import Login from './Login';
import Homepage from './Homepage';
import './App.css';
import { Routes, Route, useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';

function App() {
  const [counters, setCounters] = useState([]);
  const [counterId, setCounterId] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // If counterId is not set, redirect to login page
    if (!counterId) {
      navigate('/login');
    }
  }, [counterId]);

  return (
    <Routes>
    <Route path="/login" element={<Login counterId={counterId} setCounterId={setCounterId} counters={counters} setCounters={setCounters}/>} />
    <Route path="/homepage" element={<Homepage counterId={counterId} />} />
    </Routes>
  );
}

export default App;