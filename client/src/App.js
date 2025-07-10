import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import AdminDashboard from './components/AdminDashboard';
import jwt_decode from 'jwt-decode';

function App() {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      const decodedUser = jwt_decode(storedToken);
      setUser(decodedUser.user);
    }
  }, []);

  const handleSetToken = (token) => {
    localStorage.setItem('token', token);
    setToken(token);
    const decodedUser = jwt_decode(token);
    setUser(decodedUser.user);
  };

  return (
    <div className="App">
      {token ? (
        user && user.is_admin ? (
          <AdminDashboard token={token} />
        ) : (
          <Dashboard token={token} />
        )
      ) : (
        <Login setToken={handleSetToken} />
      )}
    </div>
  );
}

export default App;
