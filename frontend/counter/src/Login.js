import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

function Login() {
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aggiungi qui la logica di autenticazione se necessario
    navigate('/homepage'); // Naviga alla pagina homepage
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="counter">Counter:</label>
          <select
            id="counter"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          >
            <option value="c1">c1</option>
            <option value="c2">c2</option>
            <option value="c3">c3</option>
            <option value="c4">c4</option>
            <option value="c5">c5</option>
          </select>
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;