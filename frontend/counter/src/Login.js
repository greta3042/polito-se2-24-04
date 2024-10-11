import React, {useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

function Login({ counterId, setCounterId, counters, setCounters }) {
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCounters = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/counters');
        const result = await response.json();
        if (response.ok) {
          setCounters(result);
        } else {
          console.error('Error fetching counters:', result.error);
        }
      } catch (error) {
        console.error('Error fetching counters:', error);
      }
    };
    fetchCounters();
  }, []);


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
            value={counterId}
            onChange={(e) => setCounterId(e.target.value)}
            required
          >
           <option value="">Select a counter</option>
            {counters.map((counter) => (
              <option key={counter.id} value={counter.id}>
                {counter.id}
              </option>
            ))}
          </select>
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;