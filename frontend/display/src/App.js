import React, {useState} from 'react';
import './App.css';
import io from 'socket.io-client';
import { useEffect } from 'react';


function App() {
  const [notifications, setNotifications] = useState([]);  

  useEffect(() => {

    // Fill notifications at the start with all the counters
    

    const socket = io('http://localhost:4001'); // Backend server URL

    // Callback called when a notification is received
    socket.on('nextCustomer', (data) => {

      // Update the state with information to display for counters
      setNotifications(notifications.map(notification =>
        notification.counterId === data.counterId
          ? data  // Replace the entry with the same counterId
          : notification) // Keep the other entries unchanged
        );

    });

    // Cleanup to disconnect component at component life end
    return () => {
        socket.disconnect();
    };
}); // Empty array means that the socket is opened only at the starting at the component and keep listening



  return (
    <div className="App">
      <header className="App-header">
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
      </header>
    </div>
  );
}

export default App;
