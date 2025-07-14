import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Grid,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Collapse,
  useTheme,
  useMediaQuery,
  Chip
} from '@mui/material';
import {
  ExpandMore,
  ExpandLess,
  Download as DownloadIcon,
  Visibility as ViewIcon
} from '@mui/icons-material';
import { useSnackbar } from 'notistack';

const Reports = ({ token }) => {
  const { enqueueSnackbar } = useSnackbar();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  
  const [detailedExpenses, setDetailedExpenses] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [selectedBudget, setSelectedBudget] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [expandedExpenses, setExpandedExpenses] = useState({});

  useEffect(() => {
    fetchBudgets();
  }, [token]);

  const fetchBudgets = async () => {
    try {
      const res = await axios.get('/api/budgets', {
        headers: { 'x-auth-token': token }
      });
      setBudgets(res.data);
      if (res.data.length > 0) {
        setSelectedBudget(res.data[0].budget_id);
      }
    } catch (err) {
      enqueueSnackbar(err.response?.data || err.message, { variant: 'error' });
    }
  };


  const fetchDetailedExpenses = async () => {
    if (!selectedBudget || !selectedDate) return;
    try {
      const res = await axios.get(`/api/reports/detailed-expenses/${selectedBudget}?endDate=${selectedDate}`, {
        headers: { 'x-auth-token': token }
      });
      setDetailedExpenses(res.data);
    } catch (err) {
      enqueueSnackbar(err.response?.data || err.message, { variant: 'error' });
    }
  };

  const handleExportCsv = () => {
    if (detailedExpenses.length === 0) {
      enqueueSnackbar('No data to export', { variant: 'info' });
      return;
    }

    const headers = ['Expense ID', 'Amount', 'Date', 'Description', 'Category', 'Budget Item'];
    const rows = detailedExpenses.map(exp => [
      exp.expense_id,
      parseFloat(exp.amount).toFixed(2),
      new Date(exp.expense_date).toLocaleDateString(),
      exp.description,
      exp.category_name,
      exp.budget_item_name || ''
    ]);

    let csvContent = headers.join(',') + '\n';
    rows.forEach(row => {
      csvContent += row.join(',') + '\n';
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `expense_report_${selectedDate}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      enqueueSnackbar('CSV exported successfully', { variant: 'success' });
    }
  };

  const toggleExpenseExpanded = (expenseId) => {
    setExpandedExpenses(prev => ({
      ...prev,
      [expenseId]: !prev[expenseId]
    }));
  };

  const MobileExpenseCard = ({ expense }) => (
    <Card sx={{ mb: 2 }}>
      <CardContent sx={{ pb: 1 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" color="primary">
            ${parseFloat(expense.amount).toFixed(2)}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {new Date(expense.expense_date).toLocaleDateString()}
          </Typography>
        </Box>
        <Typography variant="body1" sx={{ mt: 1 }}>
          {expense.description}
        </Typography>
        <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mt: 1 }}>
          <Chip
            label={expense.category_name}
            size="small"
            variant="outlined"
            sx={{ mr: 1 }}
          />
          <IconButton
            size="small"
            onClick={() => toggleExpenseExpanded(expense.expense_id)}
          >
            {expandedExpenses[expense.expense_id] ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        </Box>
        <Collapse in={expandedExpenses[expense.expense_id]}>
          <Box sx={{ mt: 2, pt: 2, borderTop: 1, borderColor: 'divider' }}>
            <Typography variant="body2" color="textSecondary">
              <strong>Budget Item:</strong> {expense.budget_item_name || 'N/A'}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              <strong>Expense ID:</strong> {expense.expense_id}
            </Typography>
          </Box>
        </Collapse>
      </CardContent>
    </Card>
  );


  return (
    <Paper sx={{ p: isMobile ? 2 : 3 }}>
      <Typography variant="h6" gutterBottom>
        Expense Reports
      </Typography>
      
      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel>Select Budget</InputLabel>
        <Select
          value={selectedBudget}
          onChange={(e) => setSelectedBudget(e.target.value)}
          label="Select Budget"
        >
          {budgets.map((budget) => (
            <MenuItem key={budget.budget_id} value={budget.budget_id}>
              {budget.budget_name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            fullWidth
            label="End Date"
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Button 
            variant="contained" 
            onClick={fetchDetailedExpenses} 
            fullWidth
            startIcon={<ViewIcon />}
          >
            {isMobile ? 'Generate' : 'Generate Detailed Report'}
          </Button>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Button 
            variant="outlined" 
            onClick={handleExportCsv} 
            fullWidth
            startIcon={<DownloadIcon />}
          >
            {isMobile ? 'Export CSV' : 'Export to CSV'}
          </Button>
        </Grid>
      </Grid>
      
      {/* Detailed Expenses - Mobile vs Desktop */}
      {isMobile ? (
        <Box>
          {detailedExpenses.map((expense) => (
            <MobileExpenseCard key={expense.expense_id} expense={expense} />
          ))}
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Budget Item</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {detailedExpenses.map((expense) => (
                <TableRow key={expense.expense_id}>
                  <TableCell>{new Date(expense.expense_date).toLocaleDateString()}</TableCell>
                  <TableCell>${parseFloat(expense.amount).toFixed(2)}</TableCell>
                  <TableCell>{expense.description}</TableCell>
                  <TableCell>{expense.category_name}</TableCell>
                  <TableCell>{expense.budget_item_name || 'N/A'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Paper>
  );
};

export default Reports;