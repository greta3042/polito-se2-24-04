import React from 'react';
import './Homepage.css';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Homepage({counterId}) {
  const navigate = useNavigate();
  const [customerNumber, setCustomerNumber] = useState('');
  const [serviceName, setServiceName] = useState('');

  useEffect(() => {
    if (!counterId){
      navigate('/login');
    }
  }, []);

  const handleButtonClick = (buttonName) => {
    alert(`You clicked ${buttonName}`);
  };

  const handleButtonClick2 = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/callNextCustomer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({counterId}), // Use counterId from props
      });

      const result = await response.json();
      if (response.ok) {
        setCustomerNumber(result.nextCustomerNumber);
        setServiceName(result.serviceName);
      } else {
        console.error('Error calling next customer:', result.error);
        alert(`${result.error}`);
      }
    } catch (error) {
      console.error('Error calling next customer:', error);
    }
  };

  return (
    <div className="homepage-container">
      <h1> Counter {counterId}</h1>

        {/* Add customer and service information here */}
        <div className="info-group">
          {customerNumber ? 
            <div>
              <p>Currently serving: <strong>Customer {customerNumber}</strong></p>
              <p>Service: <strong>{serviceName}</strong></p>
            </div>
            : <p> No customer being served! Call a new one </p>
            }
        </div>
      
      <div className="button-group">
        <button onClick={() => handleButtonClick('Button 1')}>Set service code as done</button>
        <button onClick={() => handleButtonClick2()}>Call next customer</button>
      </div>
    </div>
  );
}

export default Homepage;