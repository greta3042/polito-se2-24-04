import './App.css';
import React, { useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react'; // QRCodeCanvas to generate QR code
import Button from 'react-bootstrap/Button'; // Button import

function App() {
  const [ticket, setTicket] = useState('10 servizio'); // State for the ticket number

  const removeTicket = () => {
    setTicket('0');
  }

  return (
    <div>
      {ticket === 0 ? <h1>Select a service</h1> : <h1>Here is your ticket</h1>}
      {/* Shows the QR code if the ticket is received from the back-end */}
      {ticket !== 0 && 
        <div>
          <QRCodeCanvas value={ticket} size={200}/>
          <br/>
          <Button variant="primary" onClick={removeTicket}>Get a new ticket</Button> 
        </div>
      }
    </div>
  );
}

export default App;

