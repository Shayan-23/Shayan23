import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth, db } from '../firebase';
import { 
  collection, 
  addDoc, 
  getDocs, 
  deleteDoc, 
  doc, 
  query, 
  orderBy, 
  where,
  serverTimestamp,
  setDoc
} from 'firebase/firestore';
import { format } from 'date-fns';
import {
  Box,
  Container,
  Grid,
  Paper,
  TextField,
  Select,
  MenuItem,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Typography,
  Card,
  CardContent,
  AppBar,
  Toolbar,
  FormControl,
  InputLabel,
  CircularProgress,
  Alert,
  styled,
  Avatar,
  Tooltip,
  Divider,
  useTheme,
  useMediaQuery,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import LogoutIcon from '@mui/icons-material/Logout';
import AddIcon from '@mui/icons-material/Add';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import { StyledTextField, GradientButton } from './shared/AuthStyles';
import { useThemeContext } from '../context/ThemeContext';

// Styled Components
const DashboardContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  backgroundColor: theme.palette.background.default,
  color: theme.palette.text.primary,
}));

const MainContent = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  paddingTop: theme.spacing(15),
  [theme.breakpoints.up('sm')]: {
    paddingTop: theme.spacing(18),
  },
}));

const StyledAppBar = styled(AppBar)({
  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  backdropFilter: 'blur(10px)',
  marginBottom: '2rem',
});

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: '16px',
  boxShadow: theme.palette.mode === 'dark' 
    ? '0 4px 6px -1px rgba(0, 0, 0, 0.2)'
    : '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  transition: 'all 0.3s ease-in-out',
  background: theme.palette.mode === 'dark' ? theme.palette.background.paper : '#ffffff',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  overflow: 'visible',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.palette.mode === 'dark'
      ? '0 12px 20px -5px rgba(0, 0, 0, 0.3)'
      : '0 12px 20px -5px rgba(0, 0, 0, 0.15)',
  },
}));

const CardIconWrapper = styled(Box)(({ theme, color }) => ({
  background: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : color + '20',
  borderRadius: '50%',
  padding: '12px',
  display: 'inline-flex',
  marginBottom: '16px',
}));

const TransactionForm = styled(Paper)(({ theme }) => ({
  padding: '24px',
  borderRadius: '16px',
  background: theme.palette.mode === 'dark' 
    ? theme.palette.background.paper
    : '#ffffff',
  boxShadow: theme.palette.mode === 'dark'
    ? '0 4px 6px -1px rgba(0, 0, 0, 0.2)'
    : '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
}));

const TransactionList = styled(List)(({ theme }) => ({
  background: theme.palette.mode === 'dark'
    ? theme.palette.background.paper
    : '#ffffff',
  borderRadius: '16px',
  padding: '16px',
  boxShadow: theme.palette.mode === 'dark'
    ? '0 4px 6px -1px rgba(0, 0, 0, 0.2)'
    : '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
}));

const TransactionItem = styled(ListItem)(({ theme }) => ({
  borderRadius: '12px',
  marginBottom: '8px',
  padding: '16px',
  background: theme.palette.mode === 'dark'
    ? 'rgba(255, 255, 255, 0.05)'
    : 'rgba(0, 0, 0, 0.02)',
  '&:hover': {
    background: theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, 0.08)'
      : 'rgba(0, 0, 0, 0.04)',
  },
}));

const NoTransactionsBox = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  padding: '48px',
  background: theme.palette.mode === 'dark'
    ? theme.palette.background.paper
    : '#ffffff',
  borderRadius: '16px',
  boxShadow: theme.palette.mode === 'dark'
    ? '0 4px 6px -1px rgba(0, 0, 0, 0.2)'
    : '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  '& .MuiSvgIcon-root': {
    fontSize: '48px',
    marginBottom: '16px',
    color: theme.palette.mode === 'dark'
      ? theme.palette.text.secondary
      : '#64748b',
  },
}));

const StyledSelect = styled(Select)(({ theme }) => ({
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, 0.15)'
      : 'rgba(0, 0, 0, 0.1)',
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: theme.palette.primary.main,
  },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: theme.palette.primary.main,
  },
  '& .MuiSelect-icon': {
    color: theme.palette.text.secondary,
  },
}));

function Dashboard() {
  const navigate = useNavigate();
  const theme = useTheme();
  const { isDarkMode, toggleTheme } = useThemeContext();
  const [transactions, setTransactions] = useState([]);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('expense');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addingTransaction, setAddingTransaction] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState(null);

  useEffect(() => {
    // Create user document if it doesn't exist
    const createUserDoc = async () => {
      const userId = auth.currentUser?.uid;
      if (!userId) return;

      try {
        const userDocRef = doc(db, 'users', userId);
        await setDoc(userDocRef, {
          lastUpdated: serverTimestamp()
        }, { merge: true });
      } catch (err) {
        console.error('Error creating user document:', err);
      }
    };

    createUserDoc();
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    console.log('Fetching transactions...');
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) {
        throw new Error('No user logged in');
      }

      console.log('Fetching transactions for user:', userId);
      
      // Using the correct collection path that matches security rules
      const transactionsRef = collection(db, 'users', userId, 'transactions');
      const q = query(transactionsRef, orderBy('timestamp', 'desc'));

      console.log('Executing query:', q);
      const querySnapshot = await getDocs(q);
      console.log('Query snapshot size:', querySnapshot.size);

      const transactionList = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          timestamp: data.timestamp?.toDate() || new Date(),
          amount: Number(data.amount)
        };
      });

      console.log('Processed transactions:', transactionList);
      setTransactions(transactionList);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching transactions:', err);
      setError(`Failed to load transactions: ${err.message}`);
      setLoading(false);
    }
  };

  const handleAddTransaction = async (e) => {
    e.preventDefault();
    console.log('Add transaction form submitted');

    if (!description || !amount) {
      setError('Please fill in all fields');
      console.log('Form validation failed:', { description, amount });
      return;
    }

    setAddingTransaction(true);
    setError(null);

    try {
      const userId = auth.currentUser?.uid;
      if (!userId) {
        throw new Error('No user logged in');
      }

      // First ensure user document exists
      const userDocRef = doc(db, 'users', userId);
      await setDoc(userDocRef, {
        lastUpdated: serverTimestamp()
      }, { merge: true });

      console.log('Adding transaction with data:', {
        description,
        amount,
        type,
        userId
      });

      const transactionData = {
        description,
        amount: Number(amount),
        type,
        timestamp: serverTimestamp(),
        userId
      };

      // Using the correct collection path that matches security rules
      const transactionsRef = collection(db, 'users', userId, 'transactions');
      console.log('Transaction collection reference:', transactionsRef.path);

      const docRef = await addDoc(transactionsRef, transactionData);
      console.log('Transaction added successfully with ID:', docRef.id);
      
      // Reset form
      setDescription('');
      setAmount('');
      setType('expense');
      setError(null);
      
      // Refresh transactions
      await fetchTransactions();
    } catch (err) {
      console.error('Error adding transaction:', err);
      setError(`Failed to add transaction: ${err.message}`);
    } finally {
      setAddingTransaction(false);
    }
  };

  const handleDeleteClick = (transaction) => {
    setTransactionToDelete(transaction);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (transactionToDelete) {
      try {
        await handleDeleteTransaction(transactionToDelete.id);
        setDeleteDialogOpen(false);
        setTransactionToDelete(null);
      } catch (error) {
        console.error('Error deleting transaction:', error);
      }
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setTransactionToDelete(null);
  };

  const handleDeleteTransaction = async (transactionId) => {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) {
        throw new Error('No user logged in');
      }

      await deleteDoc(doc(db, 'users', userId, 'transactions', transactionId));
      await fetchTransactions();
    } catch (err) {
      console.error('Error deleting transaction:', err);
      setError('Failed to delete transaction');
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');  
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const calculateTotal = (type) => {
    return transactions
      .filter(t => t.type === type)
      .reduce((sum, transaction) => sum + transaction.amount, 0);
  };

  return (
    <DashboardContainer sx={{ 
      bgcolor: theme.palette.background.default,
      minHeight: '100vh',
      pt: '64px'
    }}>
      <StyledAppBar 
        position="fixed" 
        elevation={0}
        sx={{ 
          background: 'transparent',
          backdropFilter: 'blur(8px)',
          borderBottom: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
        }}
      >
        <Toolbar sx={{ 
          flexWrap: 'wrap',
          gap: { xs: 1, sm: 2 },
          justifyContent: { xs: 'space-between', sm: 'flex-start' },
          '& > :last-child': {
            marginLeft: { xs: 0, sm: 2 }
          },
          py: { xs: 1.5, sm: 2 },
          px: { xs: 2, sm: 3 }
        }}>
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
              flexGrow: { xs: 1, sm: 1 },
              color: theme.palette.primary.main,
              fontWeight: 600,
            }}
          >
            Finance Tracker
          </Typography>
          <Box sx={{ display: 'flex', gap: { xs: 1, sm: 2 }, alignItems: 'center' }}>
            <Tooltip title={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}>
              <IconButton 
                onClick={toggleTheme} 
                sx={{ 
                  color: theme.palette.primary.main,
                  '&:hover': {
                    backgroundColor: theme.palette.mode === 'dark' 
                      ? 'rgba(255, 255, 255, 0.05)' 
                      : 'rgba(0, 0, 0, 0.05)'
                  }
                }}
              >
                {isDarkMode ? <Brightness7Icon /> : <Brightness4Icon />}
              </IconButton>
            </Tooltip>
            <Tooltip title="Logout">
              <GradientButton
                onClick={handleLogout}
                startIcon={<LogoutIcon />}
                size="small"
                sx={{
                  fontSize: '0.875rem',
                  py: 0.75,
                  px: 2,
                  '& .MuiButton-startIcon': {
                    marginRight: 0.5
                  }
                }}
              >
                Logout
              </GradientButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </StyledAppBar>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Typography variant="h3" sx={{ 
              fontWeight: 700,
              color: theme.palette.text.primary,
              mb: 1
            }}>
              Dashboard
            </Typography>
          </Grid>

          {/* Summary Cards */}
          <Grid item xs={12} md={4}>
            <StyledCard>
              <CardContent>
                <CardIconWrapper color="#4ade80">
                  <TrendingUpIcon sx={{ color: theme.palette.mode === 'dark' ? '#4ade80' : '#059669' }} />
                </CardIconWrapper>
                <Typography variant="h6" sx={{ color: theme.palette.text.primary }}>
                  Total Income
                </Typography>
                <Typography variant="h4" sx={{ color: theme.palette.mode === 'dark' ? '#4ade80' : '#059669' }}>
                  ${calculateTotal('income').toFixed(2)}
                </Typography>
              </CardContent>
            </StyledCard>
          </Grid>
          <Grid item xs={12} md={4}>
            <StyledCard>
              <CardContent>
                <CardIconWrapper color="#f87171">
                  <TrendingDownIcon sx={{ color: theme.palette.mode === 'dark' ? '#f87171' : '#dc2626' }} />
                </CardIconWrapper>
                <Typography variant="h6" sx={{ color: theme.palette.text.primary }}>
                  Total Expenses
                </Typography>
                <Typography variant="h4" sx={{ color: theme.palette.mode === 'dark' ? '#f87171' : '#dc2626' }}>
                  ${calculateTotal('expense').toFixed(2)}
                </Typography>
              </CardContent>
            </StyledCard>
          </Grid>
          <Grid item xs={12} md={4}>
            <StyledCard>
              <CardContent>
                <CardIconWrapper color="#818cf8">
                  <AccountBalanceWalletIcon sx={{ color: theme.palette.mode === 'dark' ? '#818cf8' : '#4f46e5' }} />
                </CardIconWrapper>
                <Typography variant="h6" sx={{ color: theme.palette.text.primary }}>
                  Balance
                </Typography>
                <Typography 
                  variant="h4" 
                  sx={{ 
                    color: (calculateTotal('income') - calculateTotal('expense')) >= 0
                      ? theme.palette.mode === 'dark' ? '#4ade80' : '#059669'
                      : theme.palette.mode === 'dark' ? '#f87171' : '#dc2626'
                  }}
                >
                  ${(calculateTotal('income') - calculateTotal('expense')).toFixed(2)}
                </Typography>
              </CardContent>
            </StyledCard>
          </Grid>

          {/* Transaction Form */}
          <Grid item xs={12}>
            <TransactionForm elevation={0}>
              <Typography variant="h5" gutterBottom sx={{ 
                fontWeight: 600, 
                mb: 3,
                color: theme.palette.text.primary 
              }}>
                Add New Transaction
              </Typography>
              <form onSubmit={handleAddTransaction}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={4}>
                    <StyledTextField
                      fullWidth
                      label="Description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Enter transaction description"
                      sx={{
                        '& .MuiInputBase-input': {
                          color: theme.palette.text.primary,
                        },
                        '& .MuiInputLabel-root': {
                          color: theme.palette.text.secondary,
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <StyledTextField
                      fullWidth
                      label="Amount"
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                      InputProps={{
                        startAdornment: (
                          <Typography sx={{ 
                            mr: 1,
                            color: theme.palette.text.secondary
                          }}>
                            $
                          </Typography>
                        ),
                      }}
                      sx={{
                        '& .MuiInputBase-input': {
                          color: theme.palette.text.primary,
                        },
                        '& .MuiInputLabel-root': {
                          color: theme.palette.text.secondary,
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <FormControl fullWidth>
                      <InputLabel sx={{ color: theme.palette.text.secondary }}>
                        Type
                      </InputLabel>
                      <StyledSelect
                        value={type}
                        label="Type"
                        onChange={(e) => setType(e.target.value)}
                      >
                        <MenuItem value="expense" sx={{ color: theme.palette.text.primary }}>
                          Expense
                        </MenuItem>
                        <MenuItem value="income" sx={{ color: theme.palette.text.primary }}>
                          Income
                        </MenuItem>
                      </StyledSelect>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={2}>
                    <GradientButton
                      fullWidth
                      type="submit"
                      disabled={addingTransaction}
                      startIcon={addingTransaction ? <CircularProgress size={20} /> : <AddIcon />}
                      sx={{ height: '56px' }}
                    >
                      {addingTransaction ? 'Adding...' : 'Add'}
                    </GradientButton>
                  </Grid>
                </Grid>
              </form>
            </TransactionForm>
          </Grid>

          {/* Transactions List */}
          <Grid item xs={12}>
            {error && (
              <Alert 
                severity="error" 
                sx={{ 
                  mb: 3,
                  borderRadius: '12px',
                  backgroundColor: theme.palette.mode === 'dark' 
                    ? 'rgba(239, 68, 68, 0.1)'
                    : '#fee2e2',
                  color: theme.palette.mode === 'dark'
                    ? '#fca5a5'
                    : '#dc2626',
                  '& .MuiAlert-icon': {
                    color: theme.palette.mode === 'dark'
                      ? '#fca5a5'
                      : '#dc2626',
                    fontSize: '24px'
                  }
                }}
              >
                {error}
              </Alert>
            )}
            
            <Typography variant="h5" gutterBottom sx={{ 
              fontWeight: 600, 
              mb: 3,
              color: theme.palette.text.primary 
            }}>
              Recent Transactions
            </Typography>
            
            {loading ? (
              <Box display="flex" justifyContent="center" p={4}>
                <CircularProgress />
              </Box>
            ) : transactions.length > 0 ? (
              <TransactionList>
                {transactions.map((transaction) => (
                  <TransactionItem key={transaction.id}>
                    <ListItemText
                      primary={
                        <Typography variant="subtitle1" sx={{ 
                          fontWeight: 500,
                          color: theme.palette.text.primary
                        }}>
                          {transaction.description}
                        </Typography>
                      }
                      secondary={
                        <Typography variant="body2" sx={{ 
                          color: theme.palette.text.secondary
                        }}>
                          {format(transaction.timestamp, 'MMM dd, yyyy HH:mm')}
                        </Typography>
                      }
                    />
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography
                        variant="h6"
                        sx={{
                          color: transaction.type === 'income'
                            ? theme.palette.mode === 'dark' ? '#4ade80' : '#059669'
                            : theme.palette.mode === 'dark' ? '#f87171' : '#dc2626',
                          fontWeight: 600,
                          mr: 3
                        }}
                      >
                        {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
                      </Typography>
                      <Tooltip title="Delete Transaction">
                        <IconButton
                          edge="end"
                          onClick={() => handleDeleteClick(transaction)}
                          sx={{ 
                            color: theme.palette.text.secondary,
                            '&:hover': { 
                              color: theme.palette.mode === 'dark' ? '#f87171' : '#dc2626',
                              backgroundColor: theme.palette.mode === 'dark'
                                ? 'rgba(248, 113, 113, 0.1)'
                                : 'rgba(220, 38, 38, 0.1)'
                            }
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TransactionItem>
                ))}
              </TransactionList>
            ) : (
              <NoTransactionsBox>
                <AccountBalanceWalletIcon />
                <Typography variant="h6" gutterBottom sx={{ 
                  color: theme.palette.text.primary
                }}>
                  No Transactions Yet
                </Typography>
                <Typography variant="body2" sx={{ 
                  color: theme.palette.text.secondary
                }}>
                  Add your first transaction using the form above
                </Typography>
              </NoTransactionsBox>
            )}
          </Grid>
        </Grid>
      </Container>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        PaperProps={{
          sx: {
            bgcolor: theme.palette.background.paper,
            borderRadius: '16px',
            boxShadow: theme.palette.mode === 'dark'
              ? '0 4px 6px -1px rgba(0, 0, 0, 0.2)'
              : '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          }
        }}
      >
        <DialogTitle sx={{ 
          color: theme.palette.text.primary,
          fontWeight: 600,
          pb: 1
        }}>
          Confirm Delete
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ color: theme.palette.text.primary }}>
            Are you sure you want to delete this transaction?
          </Typography>
          {transactionToDelete && (
            <Box sx={{ mt: 2, p: 2, bgcolor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)', borderRadius: '8px' }}>
              <Typography variant="subtitle2" sx={{ color: theme.palette.text.secondary, mb: 1 }}>
                Description: {transactionToDelete.description}
              </Typography>
              <Typography variant="subtitle2" sx={{ 
                color: transactionToDelete.type === 'income'
                  ? theme.palette.mode === 'dark' ? '#4ade80' : '#059669'
                  : theme.palette.mode === 'dark' ? '#f87171' : '#dc2626'
              }}>
                Amount: ${transactionToDelete.amount.toFixed(2)}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 1 }}>
          <Button 
            onClick={handleDeleteCancel}
            sx={{ 
              color: theme.palette.text.primary,
              '&:hover': {
                bgcolor: theme.palette.mode === 'dark' 
                  ? 'rgba(255, 255, 255, 0.05)' 
                  : 'rgba(0, 0, 0, 0.05)'
              }
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteConfirm}
            variant="contained"
            sx={{
              bgcolor: theme.palette.mode === 'dark' ? '#f87171' : '#dc2626',
              color: '#ffffff',
              '&:hover': {
                bgcolor: theme.palette.mode === 'dark' ? '#ef4444' : '#b91c1c'
              }
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardContainer>
  );
}

export default Dashboard;
