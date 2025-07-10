import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, Grid, Paper, Button, TextField, Select, MenuItem } from '@mui/material';
import { Doughnut } from 'react-chartjs-2';

const Dashboard = ({ token }) => {
  const [budgets, setBudgets] = useState([]);
  const [selectedBudget, setSelectedBudget] = useState('');
  const [income, setIncome] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newBudgetName, setNewBudgetName] = useState('');
  const [shareWith, setShareWith] = useState('');

  useEffect(() => {
    const fetchBudgets = async () => {
      const config = {
        headers: {
          'x-auth-token': token,
        },
      };
      try {
        const res = await axios.get('/api/budgets', config);
        setBudgets(res.data);
        if (res.data.length > 0) {
          setSelectedBudget(res.data[0].budget_id);
        }
      } catch (err) {
        console.error(err.response.data);
      }
    };

    fetchBudgets();
  }, [token]);

  useEffect(() => {
    const fetchData = async () => {
      if (!selectedBudget) return;
      const config = {
        headers: {
          'x-auth-token': token,
        },
      };
      try {
        const [incomeRes, expensesRes, categoriesRes] = await Promise.all([
          axios.get(`/api/income/${selectedBudget}`, config),
          axios.get(`/api/expenses/${selectedBudget}`, config),
          axios.get('/api/categories', config),
        ]);
        setIncome(incomeRes.data);
        setExpenses(expensesRes.data);
        setCategories(categoriesRes.data);
      } catch (err) {
        console.error(err.response.data);
      }
    };

    fetchData();
  }, [token, selectedBudget]);

  const handleCreateBudget = async (e) => {
    e.preventDefault();
    const config = {
      headers: {
        'x-auth-token': token,
      },
    };
    try {
      const res = await axios.post('/api/budgets', { budget_name: newBudgetName }, config);
      setBudgets([...budgets, res.data]);
      setNewBudgetName('');
    } catch (err) {
      console.error(err.response.data);
    }
  };

  const handleShareBudget = async (e) => {
    e.preventDefault();
    const config = {
      headers: {
        'x-auth-token': token,
      },
    };
    try {
      await axios.post('/api/budgets/share', { budget_id: selectedBudget, share_with_username: shareWith }, config);
      setShareWith('');
    } catch (err) {
      console.error(err.response.data);
    }
  };

  const totalIncome = income.reduce((acc, curr) => acc + parseFloat(curr.amount), 0);
  const totalExpenses = expenses.reduce((acc, curr) => acc + parseFloat(curr.amount), 0);

  const needsExpenses = expenses
    .filter((expense) => {
      const category = categories.find((c) => c.category_id === expense.category_id);
      return category && category.percentage === 50;
    })
    .reduce((acc, curr) => acc + parseFloat(curr.amount), 0);

  const wantsExpenses = expenses
    .filter((expense) => {
      const category = categories.find((c) => c.category_id === expense.category_id);
      return category && category.percentage === 30;
    })
    .reduce((acc, curr) => acc + parseFloat(curr.amount), 0);

  const savingsExpenses = expenses
    .filter((expense) => {
      const category = categories.find((c) => c.category_id === expense.category_id);
      return category && category.percentage === 20;
    })
    .reduce((acc, curr) => acc + parseFloat(curr.amount), 0);

  const needsBudget = totalIncome * 0.5;
  const wantsBudget = totalIncome * 0.3;
  const savingsBudget = totalIncome * 0.2;

  const data = {
    labels: ['Needs', 'Wants', 'Savings & Debt'],
    datasets: [
      {
        data: [needsExpenses, wantsExpenses, savingsExpenses],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
      },
    ],
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper>
            <form onSubmit={handleCreateBudget}>
              <TextField
                label="New Budget Name"
                value={newBudgetName}
                onChange={(e) => setNewBudgetName(e.target.value)}
              />
              <Button type="submit" variant="contained" color="primary">
                Create Budget
              </Button>
            </form>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper>
            <Select
              value={selectedBudget}
              onChange={(e) => setSelectedBudget(e.target.value)}
            >
              {budgets.map((budget) => (
                <MenuItem key={budget.budget_id} value={budget.budget_id}>
                  {budget.budget_name}
                </MenuItem>
              ))}
            </Select>
            <form onSubmit={handleShareBudget}>
              <TextField
                label="Share with Username"
                value={shareWith}
                onChange={(e) => setShareWith(e.target.value)}
              />
              <Button type="submit" variant="contained" color="secondary">
                Share Budget
              </Button>
            </form>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper>
            <Doughnut data={data} />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper>
            <Typography variant="h6">Total Income: ${totalIncome.toFixed(2)}</Typography>
            <Typography variant="h6">Total Expenses: ${totalExpenses.toFixed(2)}</Typography>
            <hr />
            <Typography variant="h6">Needs: ${needsExpenses.toFixed(2)} / ${needsBudget.toFixed(2)}</Typography>
            <Typography variant="h6">Wants: ${wantsExpenses.toFixed(2)} / ${wantsBudget.toFixed(2)}</Typography>
            <Typography variant="h6">Savings & Debt: ${savingsExpenses.toFixed(2)} / ${savingsBudget.toFixed(2)}</Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
