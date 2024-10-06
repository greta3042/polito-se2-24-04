import Login from './Login';
import Homepage from './Homepage';
import './App.css';
import { Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Routes>
    <Route path="/login" element={<Login />} />
    <Route path="/homepage" element={<Homepage />} />
    </Routes>
  );
}

export default App;