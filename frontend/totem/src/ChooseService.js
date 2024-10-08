import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ChooseService.css';

function ChooseService() {
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState('');
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:3000/api/services')
      .then(response => response.json())
      .then(data => setServices(data))
      .catch(error => console.error('Error fetching services:', error));
  }, []);

  const handleServiceClick = (service) => {
    alert(`You selected ${service}`);
    navigate('/qrcodepage');
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