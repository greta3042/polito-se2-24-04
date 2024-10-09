import React from 'react';
import './App.css';
import io from 'socket.io-client';

function App() {
  const data = [
    { code: 'A1', counter: 'C1' },
    { code: 'A2', counter: 'C2' },
    // Add more pairs as needed
  ];

  useEffect(() => {
    // server Socket.IO connection
    const socket = io('http://localhost:3001'); // Backend server URL

    // Callback called when a notification is received
    socket.on('nextCustomer', (data) => {
        console.log(`Notify received: Next customer ${data.customerNumber} service: ${data.service} counter; ${data.counterId}`);
        
        // Update the state with information to display for counters
        // to do
    });

    // Cleanup to disconnect component at component life end
    return () => {
        socket.disconnect();
    };
}, []); // Empty array means that the socket is opened only at the starting at the component and keep listening



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
            {data.map((item, index) => (
              <tr key={index}>
                <td>{item.code}</td>
                <td>{item.counter}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </header>
    </div>
  );
}

export default App;
