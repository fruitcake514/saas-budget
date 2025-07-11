import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';
import { useSnackbar } from 'notistack';

const BudgetItemManager = ({ token, selectedBudget, categories }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [budgetItems, setBudgetItems] = useState([]);
  const [newItem, setNewItem] = useState({ item_name: '', allocated_amount: '', category_id: '' });
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
    if (selectedBudget) {
      fetchBudgetItems();
    }
  }, [selectedBudget]);

  const fetchBudgetItems = async () => {
    try {
      const res = await axios.get(`/api/budget-items/${selectedBudget}`, {
        headers: { 'x-auth-token': token }
      });
      setBudgetItems(res.data);
    } catch (err) {
      enqueueSnackbar(err.response?.data || err.message, { variant: 'error' });
    }
  };

  const handleCreateItem = async () => {
    try {
      const res = await axios.post('/api/budget-items', {
        budget_id: selectedBudget,
        ...newItem,
        allocated_amount: parseFloat(newItem.allocated_amount)
      }, {
        headers: { 'x-auth-token': token }
      });
      setBudgetItems([...budgetItems, res.data]);
      setNewItem({ item_name: '', allocated_amount: '', category_id: '' });
      enqueueSnackbar('Budget item created successfully', { variant: 'success' });
    } catch (err) {
      enqueueSnackbar(err.response?.data || err.message, { variant: 'error' });
    }
  };

  const handleUpdateItem = async (id) => {
    try {
      const res = await axios.put(`/api/budget-items/${id}`, {
        item_name: editingItem.item_name,
        allocated_amount: parseFloat(editingItem.allocated_amount)
      }, {
        headers: { 'x-auth-token': token }
      });
      setBudgetItems(budgetItems.map(item => item.budget_item_id === id ? res.data : item));
      setEditingItem(null);
      enqueueSnackbar('Budget item updated successfully', { variant: 'success' });
    } catch (err) {
      enqueueSnackbar(err.response?.data || err.message, { variant: 'error' });
    }
  };

  const handleDeleteItem = async (id) => {
    try {
      await axios.delete(`/api/budget-items/${id}`, {
        headers: { 'x-auth-token': token }
      });
      setBudgetItems(budgetItems.filter(item => item.budget_item_id !== id));
      enqueueSnackbar('Budget item deleted successfully', { variant: 'success' });
    } catch (err) {
      enqueueSnackbar(err.response?.data || err.message, { variant: 'error' });
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>Manage Budget Items</Typography>
      <Grid container spacing={2} alignItems="center" sx={{ mb: 3 }}>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Item Name"
            value={newItem.item_name}
            onChange={(e) => setNewItem(prev => ({ ...prev, item_name: e.target.value }))}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField
            fullWidth
            label="Allocated Amount"
            type="number"
            value={newItem.allocated_amount}
            onChange={(e) => setNewItem(prev => ({ ...prev, allocated_amount: e.target.value }))}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <FormControl fullWidth>
            <InputLabel>Category</InputLabel>
            <Select
              value={newItem.category_id}
              onChange={(e) => setNewItem(prev => ({ ...prev, category_id: e.target.value }))}
              label="Category"
            >
              {categories.map((cat) => (
                <MenuItem key={cat.category_id} value={cat.category_id}>
                  {cat.category_name} (ID: {cat.category_id})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={2}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreateItem}
            fullWidth
          >
            Add Item
          </Button>
        </Grid>
      </Grid>

      <List>
        {budgetItems.map((item) => (
          <ListItem key={item.budget_item_id}>
            {editingItem && editingItem.budget_item_id === item.budget_item_id ? (
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Item Name"
                    value={editingItem.item_name}
                    onChange={(e) => setEditingItem(prev => ({ ...prev, item_name: e.target.value }))}
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <TextField
                    fullWidth
                    label="Allocated Amount"
                    type="number"
                    value={editingItem.allocated_amount}
                    onChange={(e) => setEditingItem(prev => ({ ...prev, allocated_amount: e.target.value }))}
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <ListItemText
                    primary={categories.find(cat => cat.category_id === item.category_id)?.category_name}
                  />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <IconButton onClick={() => handleUpdateItem(item.budget_item_id)}>
                    <SaveIcon />
                  </IconButton>
                  <IconButton onClick={() => setEditingItem(null)}>
                    <CancelIcon />
                  </IconButton>
                </Grid>
              </Grid>
            ) : (
              <>
                <ListItemText
                  primary={`${item.item_name} (ID: ${item.budget_item_id}) (${parseFloat(item.allocated_amount).toFixed(2)})`}
                  secondary={`${categories.find(cat => cat.category_id === item.category_id)?.category_name} (Category ID: ${item.category_id})`}
                />
                <IconButton onClick={() => setEditingItem(item)}>
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => handleDeleteItem(item.budget_item_id)}>
                  <DeleteIcon />
                </IconButton>
              </>
            )}
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default BudgetItemManager;