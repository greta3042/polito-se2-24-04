import ChooseService from './ChooseService';
import QRCodePage from './QRCodePage';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import { useState } from 'react';

function App() {
  const [code, setCode] = useState('');
  const [serviceName, setServiceName] = useState('');

  return (
    <Routes>
    <Route path="/chooseservice" element={<ChooseService setCode = {setCode} setServiceName = {setServiceName}/>} />
    <Route path="/qrcodepage"  element={<QRCodePage code = {code} serviceName = {serviceName} />} />
    </Routes>
  );
}

export default App;

