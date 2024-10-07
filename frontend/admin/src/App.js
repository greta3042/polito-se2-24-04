import Login from './Login';
import Homepage from './Homepage';
import QueueDashboard from './QueueDashboard';
import './App.css';
import { Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Routes>
    <Route path="/login" element={<Login />} />
    <Route path="/homepage" element={<Homepage />} />
    <Route path="/queue-dashboard" element={<QueueDashboard />} />
    </Routes>
  );
}

export default App;
