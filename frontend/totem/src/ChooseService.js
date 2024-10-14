import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ChooseService.css';

function ChooseService(props) {
  const [services, setServices] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:3001/api/services')
      .then(response => response.json())
      .then(data => setServices(data))
      .catch(error => console.error('Error fetching services:', error));
  }, []);

  const handleServiceClick = (service) => {
    fetch('http://localhost:3001/api/newTicket', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ serviceName: service.name }),
    })
      .then(response => response.json())
      .then(data => {
       // Assumi che data.ticket sia una stringa contenente sia il codice del biglietto che il nome del servizio separati da uno spazio
      
      props.setCode(data.ticket.split(' ')[0]);
      props.setServiceName(data.ticket.split(' ')[1]);

      navigate('/qrcodepage');
      })
      .catch(error => console.error('Error selecting service:', error));
  };

  return (
    <div className="choose-service-container">
      <h1 className="choose-service-title">Choose a Service</h1>
      <div className="services-list">
        {services.map((service, index) => (
          <button className="button_service" key={index} onClick={() => handleServiceClick(service)}>
            {service.name}
          </button>
        ))}
      </div>
    </div>
  );
}

export default ChooseService;
