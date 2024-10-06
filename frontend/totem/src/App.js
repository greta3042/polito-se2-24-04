import ChooseService from './ChooseService';
import QRCodePage from './QRCodePage';
import './App.css';
import { Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Routes>
    <Route path="/chooseservice" element={<ChooseService />} />
    <Route path="/qrcodepage" element={<QRCodePage />} />
    </Routes>
  );
}

export default App;