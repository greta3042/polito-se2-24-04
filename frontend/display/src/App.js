import React, {useState} from 'react';
import './App.css';
import io from 'socket.io-client';
import { useEffect } from 'react';


function App() {
  const [notifications, setNotifications] = useState([]);  

  // Fill notifications at the start with all the counters
  const fetchCounters = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/counters');
      const data = await response.json();
      setNotifications(data.map(counterId => {
        return { counterId: String(counterId.id), service: '', customerNumber: 'No customer being served' };
      }));
    } catch (error) {
      console.error('Error fetching counters:', error);
    }
  };

  useEffect(() => {

    // Call fetchCounters to load initial data
    fetchCounters();

    const socket = io('http://localhost:4001'); // Backend server URL

    // Callback called when a notification is received
    socket.on('nextCustomer', (data) => {
      console.log(notifications);
      console.log(data);
      // Update the state with information to display for counters
      setNotifications(notifications.map(notification =>
        notification.counterId === data.counterId
          ? data            // Replace the entry with the same counterId
          : notification)   // Keep the other entries unchanged
        );
    });

    // Cleanup to disconnect component at component life end
    return () => {
        socket.disconnect();
    };
}, []); // Empty array means that the socket is opened only at the starting at the component and keep listening

  return (
    <div className="App">
        <table className="display_table" border="1">
          <thead>
            <tr className="first_row">
              <th>Counter</th>
              <th>Service</th>
              <th>Customer</th>
            </tr>
          </thead>
          <tbody>
            {notifications.map((notification, index) => (
              <tr key={index}>
                <td>{notification.counterId}</td>
                <td>{notification.service}</td>
                <td>{notification.customerNumber}</td>
              </tr>
          ))}
          </tbody>
        </table>
    </div>
  );
}

export default App;
