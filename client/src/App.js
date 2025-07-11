import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import { jwtDecode } from 'jwt-decode';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

function App() {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      try {
        const decodedUser = jwtDecode(storedToken);
        // Check if token is expired
        if (decodedUser.exp * 1000 < Date.now()) {
          localStorage.removeItem('token');
          return;
        }
        setToken(storedToken);
        setUser(decodedUser.user);
      } catch (error) {
        localStorage.removeItem('token');
      }
    }
  }, []);

  const handleSetToken = (token) => {
    localStorage.setItem('token', token);
    setToken(token);
    const decodedUser = jwtDecode(token);
    setUser(decodedUser.user);
  };

  return (
    <div className="App">
      {token ? (
        <Dashboard token={token} user={user} />
      ) : (
        <Login setToken={handleSetToken} />
      )}
    </div>
  );
}

export default App;
