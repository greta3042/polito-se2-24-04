import React from 'react';
import './Homepage.css';

function Homepage() {
  const handleButtonClick = (buttonName) => {
    alert(`You clicked ${buttonName}`);
  };

  return (
    <div className="homepage-container">
      <h1>Welcome to the Homepage</h1>
      <div className="button-group">
        <button onClick={() => handleButtonClick('Button 1')}>Button 1</button>
        <button onClick={() => handleButtonClick('Button 2')}>Button 2</button>
      </div>
    </div>
  );
}

export default Homepage;