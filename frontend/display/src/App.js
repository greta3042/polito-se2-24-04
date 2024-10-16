import React, { useState, useEffect } from 'react';
import './App.css';
import io from 'socket.io-client';

function App() {
  const [notifications, setNotifications] = useState([]);

  // Fetch counters, used only at first rendering
  const fetchCounters = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/counters');
      const data = await response.json();
      setNotifications(data.map(counterId => ({
        counterId: String(counterId.id),
        service: '',
        customerNumber: 'No customer being served'
      })));
    } catch (error) {
      console.error('Error fetching counters:', error);
    }
  };

  // Update notifications
  const handleUpdate = (data) => {
    setNotifications(notifications => 
      notifications.map(notification => 
        notification.counterId === data.counterId
          ? data            // Update the counter with the new customer served
          : notification    // Keep unchanged notifications
      )
    );
  };

  useEffect(() => {
    fetchCounters();

    // Connect to the WebSocket
    const socket = io('http://localhost:4001'); // Backend URL

    // Handle incoming notification from WebSocket
    socket.on('nextCustomer', (data) => {
      handleUpdate(data); // Update notifications 
    });

    // Clean up on component unmount (disconnect socket)
    return () => {
      socket.disconnect();
    };
  }, []); // Empty dependency array makes this running only at the first rendering

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
