import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorBoundary from './components/ErrorBoundary';
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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      setIsLoading(true);
      
      try {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
          try {
            const decodedUser = jwtDecode(storedToken);
            // Check if token is expired
            if (decodedUser.exp * 1000 < Date.now()) {
              localStorage.removeItem('token');
              setIsLoading(false);
              return;
            }
            setToken(storedToken);
            setUser(decodedUser.user);
          } catch (error) {
            localStorage.removeItem('token');
            console.error('Token validation error:', error);
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const handleSetToken = (token) => {
    localStorage.setItem('token', token);
    setToken(token);
    const decodedUser = jwtDecode(token);
    setUser(decodedUser.user);
  };

  if (isLoading) {
    return (
      <LoadingSpinner 
        message="Loading OpenBudget..." 
        fullscreen={true}
        size={60}
      />
    );
  }

  return (
    <ErrorBoundary>
      <div className="App">
        {token ? (
          <Dashboard token={token} user={user} />
        ) : (
          <Login setToken={handleSetToken} />
        )}
      </div>
    </ErrorBoundary>
  );
}

export default App;
