import React, { useState } from 'react';
import axios from 'axios';
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  Alert,
  CircularProgress,
  Paper
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#00b4d8',
    },
    secondary: {
      main: '#0077b6',
    },
    background: {
      default: '#0a0e27',
      paper: '#1a1f3a',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
});

const Login = ({ setToken }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { username, password } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const res = await axios.post('/api/users/login', formData);
      setToken(res.data.token);
    } catch (err) {
      setError(err.response?.data || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #0a0e27 0%, #1a1f3a 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 2,
        }}
      >
        <Container maxWidth="sm">
          <Paper
            elevation={24}
            sx={{
              padding: 4,
              borderRadius: 3,
              background: 'rgba(26, 31, 58, 0.9)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(0, 180, 216, 0.1)',
            }}
          >
            <Box textAlign="center" mb={3}>
              <Typography
                variant="h3"
                component="h1"
                gutterBottom
                sx={{
                  fontWeight: 700,
                  background: 'linear-gradient(45deg, #00b4d8, #0077b6)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  color: 'transparent',
                }}
              >
                SaaS Budget
              </Typography>
              <Typography variant="h6" color="text.secondary">
                50-30-20 Smart Budgeting
              </Typography>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <form onSubmit={onSubmit}>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoComplete="username"
                autoFocus
                value={username}
                onChange={onChange}
                sx={{ mb: 2 }}
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={onChange}
                sx={{ mb: 3 }}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
                sx={{
                  height: 56,
                  borderRadius: 2,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  background: 'linear-gradient(45deg, #00b4d8, #0077b6)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #0077b6, #005577)',
                  },
                }}
              >
                {loading ? <CircularProgress size={24} /> : 'Sign In'}
              </Button>
            </form>

            
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default Login;