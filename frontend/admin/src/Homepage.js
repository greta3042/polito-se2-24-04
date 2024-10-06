import React from 'react';

const HomePage = () => {
  return (
    <div className="home-container">
      <h2>Home Page</h2>
      <button onClick={() => alert('Button 1 clicked!')}>Button 1</button>
      <button onClick={() => alert('Button 2 clicked!')}>Button 2</button>
    </div>
  );
}; 

export default HomePage;