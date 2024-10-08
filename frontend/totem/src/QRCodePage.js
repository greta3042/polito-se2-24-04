import './QRCodePage.css';
import { useLocation } from 'react-router-dom';
import React, { useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react'; // QRCodeCanvas to generate QR code
import Button from 'react-bootstrap/Button'; // Button import

function QRCodePage() {
  const location = useLocation();
  const { code, serviceName } = location.state;
  const [ticket, setTicket] = useState('10 servizio'); // State for the ticket number
  
    const removeTicket = () => {
      setTicket('0');
    }
  
    return (
        <div className="centered-container">
           <p>Service Name: {serviceName}</p>
           <p>Ticket Code: {code}</p>
          {ticket === 0 ? <h1 className='choose_service_h1'>Select a service</h1> : <h1 className='choose_service_h1'>Here is your ticket</h1>}
          {/* Shows the QR code if the ticket is received from the back-end */}
          {ticket !== 0 && 
            <div>
              <QRCodeCanvas className='qr_code' value={ticket} size={200}/>
              <br/>
              <Button className='new_ticket' variant="primary" onClick={removeTicket}>Get a new ticket</Button> 
            </div>
          }
        </div>
      );
  }

export default QRCodePage; // Export the component