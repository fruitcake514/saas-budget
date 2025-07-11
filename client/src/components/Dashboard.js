import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Container,
  Grid,
  Paper,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  LinearProgress,
  Alert,
  Tab,
  Tabs,
  InputAdornment
} from '@mui/material';
import {
  Add as AddIcon,
  AccountBalance as IncomeIcon,
  ShoppingCart as ExpenseIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  ExitToApp as LogoutIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Doughnut } from 'react-chartjs-2';
import Reports from './Reports';
import { useSnackbar } from 'notistack';
import CreateUserForm from './CreateUserForm';
import BudgetItemManager from './BudgetItemManager';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#00b4d8',
    },
    secondary: {
      main: '#0077b6',
    },
    success: {
      main: '#00f5ff',
    },
    warning: {
      main: '#ffb700',
    },
    error: {
      main: '#ff006e',
    },
    background: {
      default: '#0a0e27',
      paper: '#1a1f3a',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: 'rgba(26, 31, 58, 0.8)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(0, 180, 216, 0.1)',
        },
      },
    },
  },
});

const Dashboard = ({ token, user }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [currentTab, setCurrentTab] = useState(0);
  const [budgets, setBudgets] = useState([]);
  const [selectedBudget, setSelectedBudget] = useState('');
  const [income, setIncome] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [budgetItems, setBudgetItems] = useState([]);
  
  // Dialog states
  const [incomeDialog, setIncomeDialog] = useState(false);
  const [expenseDialog, setExpenseDialog] = useState(false);
  const [budgetDialog, setBudgetDialog] = useState(false);
  const [csvImportDialog, setCsvImportDialog] = useState(false);
  
  // Form states
  const [newIncome, setNewIncome] = useState({ amount: '', date: new Date().toISOString().split('T')[0] });
  const [newExpense, setNewExpense] = useState({ amount: '', category_id: '', description: '', date: new Date().toISOString().split('T')[0], budget_item_id: '' });
  const [newBudget, setNewBudget] = useState({ name: '' });
  
  // Admin states
  const [users, setUsers] = useState([]);
  
  // Edit states
  const [editingUser, setEditingUser] = useState(null);
  const [editingIncome, setEditingIncome] = useState(null);
  const [editingExpense, setEditingExpense] = useState(null);
  const [editingBudget, setEditingBudget] = useState(null);

  // Confirmation Dialog states
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [confirmDialogDetails, setConfirmDialogDetails] = useState({
    title: '',
    message: '',
    onConfirm: () => {},
  });

  useEffect(() => {
    fetchBudgets();
    fetchCategories();
    if (user && user.is_admin) {
      fetchUsers();
    }
  }, [token, user]);

  useEffect(() => {
    if (selectedBudget) {
      fetchIncome();
      fetchExpenses();
      fetchBudgetItems();
    }
  }, [selectedBudget]);

  const fetchBudgets = async () => {
    try {
      const res = await axios.get('/api/budgets', {
        headers: { 'x-auth-token': token }
      });
      setBudgets(res.data);
      if (res.data.length > 0 && !selectedBudget) {
        setSelectedBudget(res.data[0].budget_id);
      }
    } catch (err) {
      enqueueSnackbar(err.response?.data || err.message, { variant: 'error' });
    }
  };

  const fetchIncome = async () => {
    try {
      const res = await axios.get(`/api/income/${selectedBudget}`, {
        headers: { 'x-auth-token': token }
      });
      setIncome(res.data);
    } catch (err) {
      enqueueSnackbar(err.response?.data || err.message, { variant: 'error' });
    }
  };

  const fetchExpenses = async () => {
    try {
      const res = await axios.get(`/api/expenses/${selectedBudget}`, {
        headers: { 'x-auth-token': token }
      });
      setExpenses(res.data);
    } catch (err) {
      enqueueSnackbar(err.response?.data || err.message, { variant: 'error' });
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get('/api/categories', {
        headers: { 'x-auth-token': token }
      });
      setCategories(res.data);
    } catch (err) {
      enqueueSnackbar(err.response?.data || err.message, { variant: 'error' });
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get('/api/users', {
        headers: { 'x-auth-token': token }
      });
      setUsers(res.data);
    } catch (err) {
      enqueueSnackbar(err.response?.data || err.message, { variant: 'error' });
    }
  };

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

  const handleCreateBudget = async () => {
    try {
      const res = await axios.post('/api/budgets', 
        { budget_name: newBudget.name },
        { headers: { 'x-auth-token': token } }
      );
      setBudgets([...budgets, res.data]);
      setNewBudget({ name: '' });
      setBudgetDialog(false);
    } catch (err) {
      enqueueSnackbar(err.response?.data || err.message, { variant: 'error' });
    }
  };

  const handleAddIncome = async () => {
    try {
      const payload = { 
        budget_id: selectedBudget, 
        amount: parseFloat(newIncome.amount),
        income_date: newIncome.date
      };
      console.log('Sending income payload:', payload);
      
      await axios.post('/api/income', payload, {
        headers: { 'x-auth-token': token }
      });
      fetchIncome(); // Re-fetch income
      setNewIncome({ amount: '', date: new Date().toISOString().split('T')[0] });
      setIncomeDialog(false);
    } catch (err) {
      enqueueSnackbar(err.response?.data || err.message, { variant: 'error' });
    }
  };

  const handleAddExpense = async () => {
    try {
      const payload = {
        budget_id: selectedBudget,
        category_id: parseInt(newExpense.category_id),
        amount: parseFloat(newExpense.amount),
        expense_date: newExpense.date,
        description: newExpense.description,
        budget_item_id: newExpense.budget_item_id || null
      };
      console.log('Sending expense payload:', payload);
      
      await axios.post('/api/expenses', payload, {
        headers: { 'x-auth-token': token }
      });
      fetchExpenses(); // Re-fetch expenses
      setNewExpense({ amount: '', category_id: '', description: '', date: new Date().toISOString().split('T')[0] });
      setExpenseDialog(false);
    } catch (err) {
      enqueueSnackbar(err.response?.data || err.message, { variant: 'error' });
    }
  };

  

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.reload();
  };

  // Delete functions
  const handleDeleteUser = async (userId) => {
    setConfirmDialogDetails({
      title: 'Delete User',
      message: 'Are you sure you want to delete this user?',
      onConfirm: async () => {
        try {
          await axios.delete(`/api/users/${userId}`, {
            headers: { 'x-auth-token': token }
          });
          setUsers(users.filter(u => u.user_id !== userId));
          enqueueSnackbar('User deleted successfully', { variant: 'success' });
        } catch (err) {
          enqueueSnackbar(err.response?.data || err.message, { variant: 'error' });
        }
      },
    });
    setConfirmDialogOpen(true);
  };

  const handleDeleteBudget = async (budgetId) => {
    setConfirmDialogDetails({
      title: 'Delete Budget',
      message: 'Are you sure you want to delete this budget? This will delete all associated income and expenses.',
      onConfirm: async () => {
        try {
          await axios.delete(`/api/budgets/${budgetId}`, {
            headers: { 'x-auth-token': token }
          });
          setBudgets(budgets.filter(b => b.budget_id !== budgetId));
          if (selectedBudget === budgetId) {
            setSelectedBudget('');
            setIncome([]);
            setExpenses([]);
          }
          enqueueSnackbar('Budget deleted successfully', { variant: 'success' });
        } catch (err) {
          enqueueSnackbar(err.response?.data || err.message, { variant: 'error' });
        }
      },
    });
    setConfirmDialogOpen(true);
  };

  const handleDeleteIncome = async (incomeId) => {
    setConfirmDialogDetails({
      title: 'Delete Income',
      message: 'Are you sure you want to delete this income entry?',
      onConfirm: async () => {
        try {
          await axios.delete(`/api/income/${incomeId}`, {
            headers: { 'x-auth-token': token }
          });
          setIncome(income.filter(i => i.income_id !== incomeId));
          enqueueSnackbar('Income deleted successfully', { variant: 'success' });
        } catch (err) {
          enqueueSnackbar(err.response?.data || err.message, { variant: 'error' });
        }
      },
    });
    setConfirmDialogOpen(true);
  };

  const handleDeleteExpense = async (expenseId) => {
    setConfirmDialogDetails({
      title: 'Delete Expense',
      message: 'Are you sure you want to delete this expense?',
      onConfirm: async () => {
        try {
          await axios.delete(`/api/expenses/${expenseId}`, {
            headers: { 'x-auth-token': token }
          });
          setExpenses(expenses.filter(e => e.expense_id !== expenseId));
          enqueueSnackbar('Expense deleted successfully', { variant: 'success' });
        } catch (err) {
          enqueueSnackbar(err.response?.data || err.message, { variant: 'error' });
        }
      },
    });
    setConfirmDialogOpen(true);
  };

  // Edit functions
  const handleEditUser = async (userId, userData) => {
    try {
      const res = await axios.put(`/api/users/${userId}`, userData, {
        headers: { 'x-auth-token': token }
      });
      setUsers(users.map(u => u.user_id === userId ? res.data : u));
      setEditingUser(null);
    } catch (err) {
      enqueueSnackbar(err.response?.data || err.message, { variant: 'error' });
    }
  };

  const handleEditIncome = async (incomeId, incomeData) => {
    try {
      const res = await axios.put(`/api/income/${incomeId}`, incomeData, {
        headers: { 'x-auth-token': token }
      });
      setIncome(income.map(i => i.income_id === incomeId ? res.data : i));
      setEditingIncome(null);
    } catch (err) {
      enqueueSnackbar(err.response?.data || err.message, { variant: 'error' });
    }
  };

  const handleEditExpense = async (expenseId, expenseData) => {
    try {
      const res = await axios.put(`/api/expenses/${expenseId}`, expenseData, {
        headers: { 'x-auth-token': token }
      });
      setExpenses(expenses.map(e => e.expense_id === expenseId ? res.data : e));
      setEditingExpense(null);
    } catch (err) {
      enqueueSnackbar(err.response?.data || err.message, { variant: 'error' });
    }
  };

  const handleEditBudget = async (budgetId, budgetData) => {
    try {
      const res = await axios.put(`/api/budgets/${budgetId}`, budgetData, {
        headers: { 'x-auth-token': token }
      });
      setBudgets(budgets.map(b => b.budget_id === budgetId ? res.data : b));
      setEditingBudget(null);
    } catch (err) {
      enqueueSnackbar(err.response?.data || err.message, { variant: 'error' });
    }
  };

  // Debugging logs for overview calculations
  console.log('Selected Budget:', selectedBudget);
  console.log('Categories:', JSON.stringify(categories, null, 2));
  console.log('Expenses:', JSON.stringify(expenses, null, 2));
  console.log('Budget Items:', JSON.stringify(budgetItems, null, 2));
  console.log('Income:', JSON.stringify(income, null, 2));

  // Calculate budget data
  const totalIncome = income.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0);
  console.log('Total Income:', totalIncome);

  const needsBudget = totalIncome * 0.5;
  const wantsBudget = totalIncome * 0.3;
  const savingsBudget = totalIncome * 0.2;

  const totalExpenses = expenses.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0);
  const remaining = totalIncome - totalExpenses;

  // Calculate allocated amounts for each category from budget items
  const allocatedNeeds = budgetItems.filter(item => {
    const cat = categories.find(c => c.category_id === item.category_id);
    return cat && parseFloat(cat.percentage) === 50;
  }).reduce((sum, item) => sum + parseFloat(item.allocated_amount || 0), 0);

  const allocatedWants = budgetItems.filter(item => {
    const cat = categories.find(c => c.category_id === item.category_id);
    return cat && parseFloat(cat.percentage) === 30;
  }).reduce((sum, item) => sum + parseFloat(item.allocated_amount || 0), 0);

  const allocatedSavings = budgetItems.filter(item => {
    const cat = categories.find(c => c.category_id === item.category_id);
    return cat && parseFloat(cat.percentage) === 20;
  }).reduce((sum, item) => sum + parseFloat(item.allocated_amount || 0), 0);

  // Calculate spent amounts for each category
  const spentNeeds = expenses.filter(e => {
    const cat = categories.find(c => c.category_id === e.category_id);
    return cat && parseFloat(cat.percentage) === 50;
  }).reduce((sum, item) => sum + parseFloat(item.amount || 0), 0);

  const spentWants = expenses.filter(e => {
    const cat = categories.find(c => c.category_id === e.category_id);
    return cat && parseFloat(cat.percentage) === 30;
  }).reduce((sum, item) => sum + parseFloat(item.amount || 0), 0);

  const spentSavings = expenses.filter(e => {
    const cat = categories.find(c => c.category_id === e.category_id);
    return cat && parseFloat(cat.percentage) === 20;
  }).reduce((sum, item) => sum + parseFloat(item.amount || 0), 0);

  // Calculate percentages based on allocated amounts
  const needsPercentage = allocatedNeeds > 0 ? Math.min((spentNeeds / allocatedNeeds) * 100, 100) : 0;
  const wantsPercentage = allocatedWants > 0 ? Math.min((spentWants / allocatedWants) * 100, 100) : 0;
  const savingsPercentage = allocatedSavings > 0 ? Math.min((spentSavings / allocatedSavings) * 100, 100) : 0;

  const chartData = {
    labels: ['Needs (50%)', 'Wants (30%)', 'Savings (20%)'],
    datasets: [{
      data: [spentNeeds, spentWants, spentSavings],
      backgroundColor: ['#ff006e', '#ffb700', '#00f5ff'],
      borderColor: ['#ff006e', '#ffb700', '#00f5ff'],
      borderWidth: 2,
    }]
  };

  const TabPanel = ({ children, value, index }) => (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );

  return (
    <ThemeProvider theme={darkTheme}>
      <Box sx={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #0a0e27 0%, #1a1f3a 100%)',
      }}>
        <AppBar position="static" elevation={0} sx={{ 
          background: 'rgba(26, 31, 58, 0.9)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(0, 180, 216, 0.1)'
        }}>
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700 }}>
              SaaS Budget
            </Typography>
            <Typography variant="body2" sx={{ mr: 2 }}>
              Welcome, {user?.username}
            </Typography>
            <IconButton color="inherit" onClick={handleLogout}>
              <LogoutIcon />
            </IconButton>
          </Toolbar>
        </AppBar>

        <Container maxWidth="xl" sx={{ py: 3 }}>
          {/* Budget Selector */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Select Budget</InputLabel>
                  <Select
                    value={selectedBudget}
                    onChange={(e) => setSelectedBudget(e.target.value)}
                    label="Select Budget"
                  >
                    {budgets.map((budget) => (
                      <MenuItem key={budget.budget_id} value={budget.budget_id}>
                        <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
                          <span>{budget.budget_name}</span>
                          <Box>
                            <IconButton 
                              size="small" 
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingBudget(budget);
                              }}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton 
                              size="small" 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteBudget(budget.budget_id);
                              }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => setBudgetDialog(true)}
                  fullWidth
                >
                  New Budget
                </Button>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="h6" align="center">
                  Remaining: ${remaining.toFixed(2)}
                  {remaining < 0 && <Chip label="Over Budget" color="error" size="small" sx={{ ml: 1 }} />}
                </Typography>
              </Grid>
            </Grid>
          </Paper>

          {/* Summary Cards */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} md={3}>
              <Card sx={{ background: 'linear-gradient(45deg, #00f5ff, #0077b6)' }}>
                <CardContent>
                  <Box display="flex" alignItems="center">
                    <IncomeIcon sx={{ fontSize: 40, mr: 2 }} />
                    <Box>
                      <Typography variant="h6">Total Income</Typography>
                      <Typography variant="h4">${totalIncome.toFixed(2)}</Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card sx={{ background: 'linear-gradient(45deg, #ff006e, #c77dff)' }}>
                <CardContent>
                  <Box display="flex" alignItems="center">
                    <ExpenseIcon sx={{ fontSize: 40, mr: 2 }} />
                    <Box>
                      <Typography variant="h6">Total Expenses</Typography>
                      <Typography variant="h4">${totalExpenses.toFixed(2)}</Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card sx={{ background: 'linear-gradient(45deg, #ffb700, #ff8500)' }}>
                <CardContent>
                  <Box display="flex" alignItems="center">
                    <TrendingUpIcon sx={{ fontSize: 40, mr: 2 }} />
                    <Box>
                      <Typography variant="h6">Needs (50%)</Typography>
                      <Typography variant="h6">${spentNeeds.toFixed(2)} / ${needsBudget.toFixed(2)}</Typography>
                      <LinearProgress 
                        variant="determinate" 
                        value={needsPercentage} 
                        sx={{ mt: 1 }}
                      />
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card sx={{ background: 'linear-gradient(45deg, #7209b7, #560bad)' }}>
                <CardContent>
                  <Box display="flex" alignItems="center">
                    <TrendingDownIcon sx={{ fontSize: 40, mr: 2 }} />
                    <Box>
                      <Typography variant="h6">Budget Health</Typography>
                      <Typography variant="h6" color={remaining >= 0 ? 'success.main' : 'error.main'}>
                        {remaining >= 0 ? 'On Track' : 'Over Budget'}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Main Content Tabs */}
          <Paper sx={{ mb: 3 }}>
            <Tabs value={currentTab} onChange={(e, v) => setCurrentTab(v)}>
              <Tab label="Overview" />
              <Tab label="Transactions" />
              <Tab label="Reports" />
              <Tab label="Budget Items" />
              {user && user.is_admin && <Tab label="Admin" />}
            </Tabs>

            {/* Overview Tab */}
            <TabPanel value={currentTab} index={0}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom>Budget Breakdown</Typography>
                    {totalIncome > 0 ? (
                      <Doughnut data={chartData} options={{ 
                        responsive: true,
                        plugins: {
                          legend: { position: 'bottom' }
                        }
                      }} />
                    ) : (
                      <Alert severity="info">Add income to see budget breakdown</Alert>
                    )}
                  </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom>50-30-20 Progress</Typography>
                    {categories.length > 0 && budgetItems.length > 0 ? (
                      <>
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="body2">Needs: ${spentNeeds.toFixed(2)} / ${needsBudget.toFixed(2)}</Typography>
                          <LinearProgress 
                            variant="determinate" 
                            value={needsBudget > 0 ? Math.min((spentNeeds / needsBudget) * 100, 100) : 0} 
                            color={spentNeeds <= needsBudget ? 'success' : 'error'}
                            sx={{ mb: 1 }}
                          />
                        </Box>
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="body2">Wants: ${spentWants.toFixed(2)} / ${wantsBudget.toFixed(2)}</Typography>
                          <LinearProgress 
                            variant="determinate" 
                            value={wantsBudget > 0 ? Math.min((spentWants / wantsBudget) * 100, 100) : 0} 
                            color={spentWants <= wantsBudget ? 'warning' : 'error'}
                            sx={{ mb: 1 }}
                          />
                        </Box>
                        <Box>
                          <Typography variant="body2">Savings: ${spentSavings.toFixed(2)} / ${savingsBudget.toFixed(2)}</Typography>
                          <LinearProgress 
                            variant="determinate" 
                            value={savingsBudget > 0 ? Math.min((spentSavings / savingsBudget) * 100, 100) : 0} 
                            color={spentSavings <= savingsBudget ? 'info' : 'error'}
                            sx={{ mb: 1 }}
                          />
                        </Box>
                      </>
                    ) : (
                      <Alert severity="info">Please define categories and budget items to see 50-30-20 progress.</Alert>
                    )}
                  </Paper>
                  <Paper sx={{ p: 3, mt: 3 }}>
                    <Typography variant="h6" gutterBottom>Individual Budget Item Progress</Typography>
                    {categories.map(category => (
                      <Box key={category.category_id} sx={{ mb: 2 }}>
                        <Typography variant="subtitle1">{category.category_name}</Typography>
                        {budgetItems.filter(item => item.category_id === category.category_id).length > 0 ? (
                          budgetItems.filter(item => item.category_id === category.category_id).map(item => {
                            const spentForItem = expenses.filter(e => e.budget_item_id === item.budget_item_id)
                                                          .reduce((sum, e) => sum + parseFloat(e.amount || 0), 0);
                            const itemPercentage = item.allocated_amount > 0 ? Math.min((spentForItem / item.allocated_amount) * 100, 100) : 0;
                            return (
                              <Box key={item.budget_item_id} sx={{ mb: 1 }}>
                                <Typography variant="body2">{item.item_name}: ${spentForItem.toFixed(2)} / ${parseFloat(item.allocated_amount).toFixed(2)}</Typography>
                                <LinearProgress 
                                  variant="determinate" 
                                  value={itemPercentage} 
                                  color={spentForItem <= item.allocated_amount ? 'success' : 'error'}
                                />
                              </Box>
                            );
                          })
                        ) : (
                          <Typography variant="body2" color="text.secondary">No budget items defined for this category.</Typography>
                        )}
                      </Box>
                    ))}
                  </Paper>
                </Grid>
              </Grid>
            </TabPanel>

            {/* Transactions Tab */}
            <TabPanel value={currentTab} index={1}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 3 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                      <Typography variant="h6">Income</Typography>
                      <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => setIncomeDialog(true)}
                      >
                        Add Income
                      </Button>
                    </Box>
                    <List>
                      {income.map((item) => (
                        <ListItem key={item.income_id}>
                          <ListItemText
                            primary={`$${parseFloat(item.amount).toFixed(2)}`}
                            secondary={new Date(item.income_date).toLocaleDateString()}
                          />
                          <Box>
                            <IconButton 
                              size="small" 
                              onClick={() => setEditingIncome(item)}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton 
                              size="small" 
                              onClick={() => handleDeleteIncome(item.income_id)}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        </ListItem>
                      ))}
                      {income.length === 0 && (
                        <Alert severity="info">No income entries yet. Add your first income!</Alert>
                      )}
                    </List>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 3 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                      <Typography variant="h6">Expenses</Typography>
                      <Box>
                        <Button
                          variant="contained"
                          startIcon={<AddIcon />}
                          onClick={() => setExpenseDialog(true)}
                          sx={{ mr: 1 }}
                        >
                          Add Expense
                        </Button>
                        <Button
                          variant="outlined"
                          onClick={() => setCsvImportDialog(true)}
                        >
                          Import CSV
                        </Button>
                      </Box>
                    </Box>
                    <List>
                      {expenses.map((item) => (
                        <ListItem key={item.expense_id}>
                          <ListItemText
                            primary={`$${parseFloat(item.amount).toFixed(2)} - ${item.description || 'No description'}`}
                            secondary={`${categories.find(c => c.category_id === item.category_id)?.category_name || 'Unknown'} • ${new Date(item.expense_date).toLocaleDateString()}`}
                          />
                          <Box>
                            <IconButton 
                              size="small" 
                              onClick={() => setEditingExpense(item)}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton 
                              size="small" 
                              onClick={() => handleDeleteExpense(item.expense_id)}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        </ListItem>
                      ))}
                      {expenses.length === 0 && (
                        <Alert severity="info">No expenses yet. Add your first expense!</Alert>
                      )}
                    </List>
                  </Paper>
                </Grid>
              </Grid>
            </TabPanel>

            {/* Admin Tab */}
            <TabPanel value={currentTab} index={2}>
              <Reports token={token} />
            </TabPanel>

            <TabPanel value={currentTab} index={3}>
              <BudgetItemManager token={token} selectedBudget={selectedBudget} categories={categories} />
            </TabPanel>

            {/* Admin Tab */}
            {user && user.is_admin && (
              <TabPanel value={currentTab} index={4}>
                <Paper sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>User Management</Typography>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <CreateUserForm token={token} onUserCreated={(newUser) => setUsers([...users, newUser])} />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle1" gutterBottom>All Users</Typography>
                      <List>
                        {users.map((u) => (
                          <ListItem key={u.user_id}>
                            <ListItemText
                              primary={u.username}
                              secondary={u.is_admin ? 'Administrator' : 'User'}
                            />
                            <Box display="flex" alignItems="center" gap={1}>
                              <Chip
                                label={u.is_admin ? 'Admin' : 'User'}
                                color={u.is_admin ? 'secondary' : 'default'}
                                size="small"
                              />
                              <IconButton 
                                size="small" 
                                onClick={() => setEditingUser(u)}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                              {u.user_id !== user?.user_id && (
                                <IconButton 
                                  size="small" 
                                  onClick={() => handleDeleteUser(u.user_id)}
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              )}
                            </Box>
                          </ListItem>
                        ))}
                      </List>
                    </Grid>
                  </Grid>
                </Paper>
              </TabPanel>
            )}
          </Paper>
        </Container>

        {/* Add Income Dialog */}
        <Dialog open={incomeDialog} onClose={() => setIncomeDialog(false)}>
          <DialogTitle>Add Income</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Amount"
              type="number"
              fullWidth
              variant="outlined"
              value={newIncome.amount}
              onChange={(e) => setNewIncome(prev => ({...prev, amount: e.target.value}))}
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
              }}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              label="Date"
              type="date"
              fullWidth
              variant="outlined"
              value={newIncome.date}
              onChange={(e) => setNewIncome(prev => ({...prev, date: e.target.value}))}
              InputLabelProps={{ shrink: true }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIncomeDialog(false)}>Cancel</Button>
            <Button onClick={handleAddIncome} variant="contained">Add</Button>
          </DialogActions>
        </Dialog>

        {/* Add Expense Dialog */}
        <Dialog open={expenseDialog} onClose={() => setExpenseDialog(false)}>
          <DialogTitle>Add Expense</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Amount"
              type="number"
              fullWidth
              variant="outlined"
              value={newExpense.amount}
              onChange={(e) => setNewExpense(prev => ({...prev, amount: e.target.value}))}
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
              }}
              sx={{ mb: 2 }}
            />
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Category</InputLabel>
              <Select
                value={newExpense.category_id}
                onChange={(e) => setNewExpense(prev => ({...prev, category_id: e.target.value}))}
                label="Category"
              >
                {categories.map((cat) => (
                  <MenuItem key={cat.category_id} value={cat.category_id}>
                    {cat.category_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Budget Item (Optional)</InputLabel>
              <Select
                value={newExpense.budget_item_id}
                onChange={(e) => setNewExpense(prev => ({...prev, budget_item_id: e.target.value}))}
                label="Budget Item (Optional)"
              >
                <MenuItem value=""><em>None</em></MenuItem>
                {budgetItems.filter(item => item.category_id === newExpense.category_id).map((item) => (
                  <MenuItem key={item.budget_item_id} value={item.budget_item_id}>
                    {item.item_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              margin="dense"
              label="Description"
              fullWidth
              variant="outlined"
              value={newExpense.description}
              onChange={(e) => setNewExpense(prev => ({...prev, description: e.target.value}))}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              label="Date"
              type="date"
              fullWidth
              variant="outlined"
              value={newExpense.date}
              onChange={(e) => setNewExpense(prev => ({...prev, date: e.target.value}))}
              InputLabelProps={{ shrink: true }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setExpenseDialog(false)}>Cancel</Button>
            <Button onClick={handleAddExpense} variant="contained">Add</Button>
          </DialogActions>
        </Dialog>

        {/* Add Budget Dialog */}
        <Dialog open={budgetDialog} onClose={() => setBudgetDialog(false)}>
          <DialogTitle>Create New Budget</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Budget Name"
              fullWidth
              variant="outlined"
              value={newBudget.name}
              onChange={(e) => setNewBudget(prev => ({...prev, name: e.target.value}))}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setBudgetDialog(false)}>Cancel</Button>
            <Button onClick={handleCreateBudget} variant="contained">Create</Button>
          </DialogActions>
        </Dialog>

        {/* Edit Budget Dialog */}
        <Dialog open={!!editingBudget} onClose={() => setEditingBudget(null)}>
          <DialogTitle>Edit Budget</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Budget Name"
              fullWidth
              variant="outlined"
              value={editingBudget?.budget_name || ''}
              onChange={(e) => setEditingBudget(prev => ({...prev, budget_name: e.target.value}))}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditingBudget(null)}>Cancel</Button>
            <Button 
              onClick={() => handleEditBudget(editingBudget.budget_id, { budget_name: editingBudget.budget_name })} 
              variant="contained"
            >
              Save
            </Button>
          </DialogActions>
        </Dialog>

        {/* Edit Income Dialog */}
        <Dialog open={!!editingIncome} onClose={() => setEditingIncome(null)}>
          <DialogTitle>Edit Income</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Amount"
              type="number"
              fullWidth
              variant="outlined"
              value={editingIncome?.amount || ''}
              onChange={(e) => setEditingIncome(prev => ({...prev, amount: e.target.value}))}
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
              }}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              label="Date"
              type="date"
              fullWidth
              variant="outlined"
              value={editingIncome?.income_date?.split('T')[0] || ''}
              onChange={(e) => setEditingIncome(prev => ({...prev, income_date: e.target.value}))}
              InputLabelProps={{ shrink: true }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditingIncome(null)}>Cancel</Button>
            <Button 
              onClick={() => handleEditIncome(editingIncome.income_id, {
                amount: parseFloat(editingIncome.amount),
                income_date: editingIncome.income_date
              })} 
              variant="contained"
            >
              Save
            </Button>
          </DialogActions>
        </Dialog>

        {/* Edit Expense Dialog */}
        <Dialog open={!!editingExpense} onClose={() => setEditingExpense(null)}>
          <DialogTitle>Edit Expense</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Amount"
              type="number"
              fullWidth
              variant="outlined"
              value={editingExpense?.amount || ''}
              onChange={(e) => setEditingExpense(prev => ({...prev, amount: e.target.value}))}
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
              }}
              sx={{ mb: 2 }}
            />
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Category</InputLabel>
              <Select
                value={editingExpense?.category_id || ''}
                onChange={(e) => setEditingExpense(prev => ({...prev, category_id: e.target.value}))}
                label="Category"
              >
                {categories.map((cat) => (
                  <MenuItem key={cat.category_id} value={cat.category_id}>
                    {cat.category_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Budget Item (Optional)</InputLabel>
              <Select
                value={editingExpense?.budget_item_id || ''}
                onChange={(e) => setEditingExpense(prev => ({...prev, budget_item_id: e.target.value}))}
                label="Budget Item (Optional)"
              >
                <MenuItem value=""><em>None</em></MenuItem>
                {budgetItems.filter(item => item.category_id === editingExpense?.category_id).map((item) => (
                  <MenuItem key={item.budget_item_id} value={item.budget_item_id}>
                    {item.item_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              margin="dense"
              label="Description"
              fullWidth
              variant="outlined"
              value={editingExpense?.description || ''}
              onChange={(e) => setEditingExpense(prev => ({...prev, description: e.target.value}))}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              label="Date"
              type="date"
              fullWidth
              variant="outlined"
              value={editingExpense?.expense_date?.split('T')[0] || ''}
              onChange={(e) => setEditingExpense(prev => ({...prev, expense_date: e.target.value}))}
              InputLabelProps={{ shrink: true }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditingExpense(null)}>Cancel</Button>
            <Button 
              onClick={() => handleEditExpense(editingExpense.expense_id, {
                category_id: parseInt(editingExpense.category_id),
                amount: parseFloat(editingExpense.amount),
                expense_date: editingExpense.expense_date,
                description: editingExpense.description,
                budget_item_id: editingExpense.budget_item_id || null
              })} 
              variant="contained"
            >
              Save
            </Button>
          </DialogActions>
        </Dialog>

        {/* Edit User Dialog */}
        <Dialog open={!!editingUser} onClose={() => setEditingUser(null)}>
          <DialogTitle>Edit User</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Username"
              fullWidth
              variant="outlined"
              value={editingUser?.username || ''}
              onChange={(e) => setEditingUser(prev => ({...prev, username: e.target.value}))}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              label="New Password (leave empty to keep current)"
              type="password"
              fullWidth
              variant="outlined"
              value={editingUser?.password || ''}
              onChange={(e) => setEditingUser(prev => ({...prev, password: e.target.value}))}
              sx={{ mb: 2 }}
            />
            <FormControl fullWidth>
              <InputLabel>Role</InputLabel>
              <Select
                value={editingUser?.is_admin ? 'admin' : 'user'}
                onChange={(e) => setEditingUser(prev => ({...prev, is_admin: e.target.value === 'admin'}))}
                label="Role"
              >
                <MenuItem value="user">User</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditingUser(null)}>Cancel</Button>
            <Button 
              onClick={() => handleEditUser(editingUser.user_id, {
                username: editingUser.username,
                password: editingUser.password || undefined,
                is_admin: editingUser.is_admin
              })} 
              variant="contained"
            >
              Save
            </Button>
          </DialogActions>
        </Dialog>

        {/* CSV Import Dialog */}
        <Dialog open={csvImportDialog} onClose={() => setCsvImportDialog(false)}>
          <DialogTitle>Import Expenses from CSV</DialogTitle>
          <DialogContent>
            <Typography variant="body2" sx={{ mb: 1 }}>
              Current Budget ID: {selectedBudget}
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Upload a CSV file with the following columns: `budget_id`, `category_id`, `amount`, `expense_date` (YYYY-MM-DD), `description`, `budget_item_id` (optional).
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <input
                type="file"
                accept=".csv"
                onChange={async (e) => {
                  const file = e.target.files[0];
                  if (!file) return;

                  const formData = new FormData();
                  formData.append('csvFile', file);

                  try {
                    await axios.post('/api/expenses/import-csv', formData, {
                      headers: {
                        'x-auth-token': token,
                        'Content-Type': 'multipart/form-data',
                      },
                    });
                    enqueueSnackbar('CSV imported successfully', { variant: 'success' });
                    fetchExpenses(); // Re-fetch expenses after import
                    setCsvImportDialog(false);
                  } catch (err) {
                    enqueueSnackbar(err.response?.data || err.message, { variant: 'error' });
                  }
                }}
              />
              <Button
                variant="outlined"
                onClick={() => {
                  const headers = ['budget_id', 'category_id', 'amount', 'expense_date', 'description', 'budget_item_id'];
                  const csvContent = headers.join(',') + '\n';
                  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                  const link = document.createElement('a');
                  if (link.download !== undefined) {
                    const url = URL.createObjectURL(blob);
                    link.setAttribute('href', url);
                    link.setAttribute('download', 'expense_template.csv');
                    link.style.visibility = 'hidden';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    enqueueSnackbar('CSV template downloaded', { variant: 'success' });
                  }
                }}
                sx={{ ml: 2 }}
              >
                Download Template
              </Button>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setCsvImportDialog(false)}>Cancel</Button>
          </DialogActions>
        </Dialog>

        {/* Confirmation Dialog */}
        <Dialog
          open={confirmDialogOpen}
          onClose={() => setConfirmDialogOpen(false)}
        >
          <DialogTitle>{confirmDialogDetails.title}</DialogTitle>
          <DialogContent>
            <Typography>{confirmDialogDetails.message}</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmDialogOpen(false)}>Cancel</Button>
            <Button
              onClick={() => {
                confirmDialogDetails.onConfirm();
                setConfirmDialogOpen(false);
              }}
              variant="contained"
              color="error"
            >
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </ThemeProvider>
  );
};

export default Dashboard;