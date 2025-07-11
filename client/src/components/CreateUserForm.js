import React, { useState } from 'react';
import axios from 'axios';
import {
  Box,
  Button,
  TextField,
  Grid,
  Typography
} from '@mui/material';
import { useSnackbar } from 'notistack';

const CreateUserForm = ({ token, onUserCreated }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [newUser, setNewUser] = useState({ username: '', password: '' });

  const handleCreateUser = async () => {
    try {
      const res = await axios.post('/api/users/register',
        { ...newUser, is_admin: false },
        { headers: { 'x-auth-token': token } }
      );
      enqueueSnackbar('User created successfully', { variant: 'success' });
      setNewUser({ username: '', password: '' }); // Reset form
      onUserCreated(res.data); // Notify parent to update user list
    } catch (err) {
      enqueueSnackbar(err.response?.data || err.message, { variant: 'error' });
    }
  };

  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="subtitle1" gutterBottom>Create New User</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Username"
            value={newUser.username}
            onChange={(e) => setNewUser(prev => ({...prev, username: e.target.value}))}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Password"
            type="password"
            value={newUser.password}
            onChange={(e) => setNewUser(prev => ({...prev, password: e.target.value}))}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <Button
            variant="contained"
            onClick={handleCreateUser}
            fullWidth
            sx={{ height: '56px' }}
          >
            Create User
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CreateUserForm;