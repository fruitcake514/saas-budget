import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, Button, TextField, List, ListItem, ListItemText } from '@mui/material';

const AdminDashboard = ({ token }) => {
  const [users, setUsers] = useState([]);
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      const config = {
        headers: {
          'x-auth-token': token,
        },
      };
      try {
        const res = await axios.get('/api/users', config);
        setUsers(res.data);
      } catch (err) {
        console.error(err.response.data);
      }
    };

    fetchUsers();
  }, [token]);

  const handleCreateUser = async (e) => {
    e.preventDefault();
    const config = {
      headers: {
        'x-auth-token': token,
      },
    };
    try {
      const res = await axios.post('/api/users/register', { username: newUsername, password: newPassword, is_admin: false }, config);
      setUsers([...users, res.data]);
      setNewUsername('');
      setNewPassword('');
    } catch (err) {
      console.error(err.response.data);
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>
      <form onSubmit={handleCreateUser}>
        <TextField
          label="New Username"
          value={newUsername}
          onChange={(e) => setNewUsername(e.target.value)}
        />
        <TextField
          label="New Password"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <Button type="submit" variant="contained" color="primary">
          Create User
        </Button>
      </form>
      <List>
        {users.map((user) => (
          <ListItem key={user.user_id}>
            <ListItemText primary={user.username} />
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default AdminDashboard;
