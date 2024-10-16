import './QRCodePage.css';
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react'; // QRCodeCanvas to generate QR code
import Button from 'react-bootstrap/Button'; // Button import

function QRCodePage(props) {
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(props.code + " " + props.serviceName);

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/');
    }, 60000); // 60000 milliseconds = 1 minute
    

    return () => clearTimeout(timer); // Cleanup the timer on component unmount
  }, [navigate]);

  const handleBackClick = () => {
    navigate('/');
  };

  
    return (
        <div className="centered-container">
           <p>Service Name: {props.serviceName}</p>
           <p>Ticket Code: {props.code}</p>
          {ticket === 0 ? <h1 className='choose_service_h1'>Select a service</h1> : <h1 className='choose_service_h1'>Here is your ticket</h1>}
          {/* Shows the QR code if the ticket is received from the back-end */}
          {ticket !== 0 && 
            <div>
              <QRCodeCanvas className='qr_code' value={`${props.code} ${props.serviceName}`} size={200}/>
              <br/>
              <Button className='new_ticket' variant="primary" onClick={handleBackClick}>Go back to services</Button> 
            </div>
          }
        </div>
      );
  }

export default QRCodePage; // Export the component