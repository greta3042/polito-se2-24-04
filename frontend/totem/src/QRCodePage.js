import './QRCodePage.css';
import React, { useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react'; // QRCodeCanvas to generate QR code
import Button from 'react-bootstrap/Button'; // Button import

function QRCodePage() {
  const [ticket, setTicket] = useState(null); // State for the ticket number
  const [loading, setLoading] = useState(false); // State for loading status
  const [error, setError] = useState(null); // State for error message

  // Function to fetch a new ticket from the API
  const fetchNewTicket = async () => {
    setLoading(true); // Set loading state to true while fetching
    setError(null); // Clear any previous error

    try {
      
      const response = await fetch('http://localhost:5000/api/newTicket?serviceName=ServiceNameHere', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to generate ticket. Please try again.');
      }

      const data = await response.json();
      setTicket(data.ticketNumber); // Update the ticket with the received number
    } catch (err) {
      setError(err.message); // Set error message if the API request fails
    } finally {
      setLoading(false); // Set loading state back to false after fetching
    }
  };

  // Function to remove the current ticket
  const removeTicket = () => {
    setTicket(null);
  }

  return (
    <div className="centered-container">
      {ticket === null ? (
        <h1 className='choose_service_h1'>Select a service</h1>
      ) : (
        <h1 className='choose_service_h1'>Here is your ticket</h1>
      )}

      {/* Shows the QR code if the ticket is received from the back-end */}
      {ticket && (
        <div>
          <QRCodeCanvas className='qr_code' value={ticket} size={200} />
          <br/>
          <Button className='new_ticket' variant="primary" onClick={removeTicket}>
            Get a new ticket
          </Button>
        </div>
      )}

      {/* Display loading message */}
      {loading && <p>Generating your ticket...</p>}

      {/* Display error message */}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Button to fetch a new ticket */}
      {!ticket && !loading && (
        <Button className='new_ticket' variant="primary" onClick={fetchNewTicket}>
          Get a new ticket
        </Button>
      )}
    </div>
  );
}

export default QRCodePage; // Export the component
