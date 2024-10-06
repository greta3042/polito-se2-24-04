import logo from './logo.svg';
import './App.css';

function App() {
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
            <tr>
              <td>A1</td>
              <td>C1</td>
            </tr>
            <tr>
              <td>A2</td>
              <td>C2</td>
            </tr>
            <tr>
              <td>A3</td>
              <td>C3</td>
            </tr>
            <tr>
              <td>A4</td>
              <td>C4</td>
            </tr>
            <tr>
              <td>A5</td>
              <td>C5</td>
            </tr>
          </tbody>
        </table>
      </header>
    </div>
  );
}

export default App;