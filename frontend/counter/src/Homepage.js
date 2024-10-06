import React from 'react';
import './Homepage.css';

function Homepage() {
  const handleButtonClick = (buttonName) => {
    alert(`You clicked ${buttonName}`);
  };

  return (
    <div className="homepage-container">
      <h1>Counter #n</h1>
      <h1>Serving #n</h1>
      <div className="button-group">
        <button onClick={() => handleButtonClick('Button 1')}>Set service code as done</button>
        <button onClick={() => handleButtonClick('Button 2')}>Call next customer</button>
      </div>
    </div>
  );
}

export default Homepage;