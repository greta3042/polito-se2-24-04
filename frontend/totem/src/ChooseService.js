import React from 'react';
import './ChooseService.css';

function ChooseService() {
  const services = ['Service 1', 'Service 2', 'Service 3', 'Service 4'];

  const handleServiceClick = (service) => {
    alert(`You selected ${service}`);
  };

  return (
    <div className="choose-service-container">
      <h1 className="choose-service-title">Choose a Service</h1>
      <div className="services-list">
        {services.map((service, index) => (
          <button className="button_service" key={index} onClick={() => handleServiceClick(service)}>
            {service}
          </button>
        ))}
      </div>
    </div>
  );
}

export default ChooseService;