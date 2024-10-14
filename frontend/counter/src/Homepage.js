import React from 'react';
import './Homepage.css';

function Homepage({counterId}) {

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
        body: JSON.stringify({counterId}), // Usa il counterId dalle props
      });

      const result = await response.json();
      if (response.ok) {
        console.log('Next customer called:', result.message);
      } else {
        console.error('Error calling next customer:', result.error);
      }
    } catch (error) {
      console.error('Error calling next customer:', error);
    }
  };

  return (
    <div className="homepage-container">
      <h1>Counter {counterId}</h1>
      <div className="button-group">
        <button onClick={() => handleButtonClick('Button 1')}>Set service code as done</button>
        <button onClick={() => handleButtonClick2()}>Call next customer</button>
      </div>
    </div>
  );
}

export default Homepage;