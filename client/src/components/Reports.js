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
  Grid
} from '@mui/material';
import { useSnackbar } from 'notistack';

const Reports = ({ token }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [monthlyReports, setMonthlyReports] = useState([]);
  const [detailedExpenses, setDetailedExpenses] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [selectedBudget, setSelectedBudget] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]); // Default to today

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

  const fetchMonthlyReport = async () => {
    if (!selectedBudget) return;
    try {
      const res = await axios.get(`/api/reports/monthly/${selectedBudget}`, {
        headers: { 'x-auth-token': token }
      });
      setMonthlyReports(res.data);
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

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>Monthly Budget Reports</Typography>
      <FormControl fullWidth sx={{ mb: 2 }}>
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
      <Button variant="contained" onClick={fetchMonthlyReport} sx={{ mb: 2 }}>
        Generate Monthly Report
      </Button>
      <TableContainer component={Paper} sx={{ mb: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Month</TableCell>
              <TableCell>Total Income</TableCell>
              <TableCell>Total Expenses</TableCell>
              <TableCell>Net Savings</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {monthlyReports.map((report, index) => (
              <TableRow key={index}>
                <TableCell>{report.month}</TableCell>
                <TableCell>${parseFloat(report.total_income).toFixed(2)}</TableCell>
                <TableCell>${parseFloat(report.total_expenses).toFixed(2)}</TableCell>
                <TableCell>${(parseFloat(report.total_income) - parseFloat(report.total_expenses)).toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>Detailed Expense Report (Last 30 Days)</Typography>
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
          <Button variant="contained" onClick={fetchDetailedExpenses} fullWidth>
            Generate Detailed Report
          </Button>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Button variant="outlined" onClick={handleExportCsv} fullWidth>
            Export to CSV
          </Button>
        </Grid>
      </Grid>
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
    </Paper>
  );
};

export default Reports;