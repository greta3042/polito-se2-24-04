import React, { useState } from 'react';
import './ChooseService.css';

function ChooseService() {
  const services = ['Service 1', 'Service 2', 'Service 3', 'Service 4'];

  const [selectedService, setSelectedService] = useState(null);
  const [ticketNumber, setTicketNumber] = useState(null);
  const [error, setError] = useState(null); 
  const [loading, setLoading] = useState(false); 


  // Function to handle the click event and make API request
  const handleServiceClick = async (service) => {
    setSelectedService(service);
    setError(null);
    setLoading(true); 

    try {
      const response = await fetch(`/api/newTicket?serviceName=${service}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include' 
      });

      if (!response.ok) {
        throw new Error('Failed to generate ticket. Please try again.');
      }

      const data = await response.json();
      setTicketNumber(data.ticketNumber); 
    } catch (err) {
      setError(err.message); 
    } finally {
      setLoading(false); 
    }
  };

  return (
    <div className="choose-service-container">
      <h1 className="choose-service-title">Choose a Service</h1>
      <div className="services-list">
        {services.map((service, index) => (
          <button
            className="button_service"
            key={index}
            onClick={() => handleServiceClick(service)}
            disabled={loading} 
          >
            {service}
          </button>
        ))}
      </div>

      
      {loading && <p>Generating your ticket...</p>}

      
      {selectedService && ticketNumber && (
        <div className="ticket-info">
          <h2>You selected: {selectedService}</h2>
          <p>Your ticket number is: <strong>{ticketNumber}</strong></p>
        </div>
      )}

      
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default ChooseService;
