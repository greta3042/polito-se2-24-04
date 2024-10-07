import React from 'react';
import './App.css';

function App() {
  const data = [
    { code: 'A1', counter: 'C1' },
    { code: 'A2', counter: 'C2' },
    // Add more pairs as needed
  ];

  return (
    <div className="App">
      <header className="App-header">
        <table className="display_table" border="1">
          <thead>
            <tr className="first_row">
              <th>Code</th>
              <th>Counter</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index}>
                <td>{item.code}</td>
                <td>{item.counter}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </header>
    </div>
  );
}

export default App;
