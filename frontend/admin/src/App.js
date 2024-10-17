import Homepage from './Homepage';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import React, { useState } from 'react';

function App() {
  const [data, setData] = useState([]);

  return (
    <Routes>
    <Route path="/homepage" element={<Homepage setData={setData} data={data}/>} />
    </Routes>
  );
}

export default App;
