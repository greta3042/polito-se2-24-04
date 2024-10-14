import React, {useState} from 'react';
import './App.css';
import io from 'socket.io-client';
import { useEffect } from 'react';


function App() {
  const [notifications, setNotifications] = useState([]);
  
  // Use the correct backend URL
  

  useEffect(() => {
    const socket = io('http://localhost:4001'); // Backend server URL

    // Callback called when a notification is received
    socket.on('nextCustomer', (data) => {
        console.log(`Notify received: Next customer ${data.customerNumber} service: ${data.service} counter: ${data.counterId}`);
        const { customerNumber, service, counterId } = data;
        setNotifications((prevNotifications) => [...prevNotifications, {customerNumber, service, counterId}]);
        // Update the state with information to display for counters
        // to do
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
              <th>Code</th>
              <th>Counter</th>
            </tr>
          </thead>
          <tbody>
          {notifications.map((notification, index) => (
             <tr key={index}>
             <td>{notification.customerNumber}</td>
              <td>{notification.counterId}</td>
           </tr>
          ))}
          </tbody>
        </table>
      </header>
    </div>
  );
}

export default App;