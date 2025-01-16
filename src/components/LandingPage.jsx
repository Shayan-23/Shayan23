import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  useTheme,
  AppBar,
  Toolbar,
  IconButton,
  Tooltip,
} from '@mui/material';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import TimelineIcon from '@mui/icons-material/Timeline';
import SecurityIcon from '@mui/icons-material/Security';
import DevicesIcon from '@mui/icons-material/Devices';
import LoginIcon from '@mui/icons-material/Login';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { styled } from '@mui/material/styles';
import { useThemeContext } from '../context/ThemeContext';

const GradientButton = styled(Button)(({ theme }) => ({
  background: theme.palette.mode === 'dark' 
    ? 'linear-gradient(45deg, #2563eb 30%, #3b82f6 90%)'
    : 'linear-gradient(45deg, #3b82f6 30%, #60a5fa 90%)',
  border: 0,
  borderRadius: 50,
  boxShadow: '0 3px 5px 2px rgba(59, 130, 246, 0.3)',
  color: 'white',
  padding: '10px 30px',
  transition: 'transform 0.2s ease-in-out',
  '&:hover': {
    transform: 'scale(1.05)',
    background: theme.palette.mode === 'dark' 
      ? 'linear-gradient(45deg, #1e40af 30%, #2563eb 90%)'
      : 'linear-gradient(45deg, #2563eb 30%, #3b82f6 90%)',
  },
  [theme.breakpoints.down('sm')]: {
    padding: '8px 16px',
    fontSize: '0.875rem',
    '& .MuiButton-startIcon': {
      marginRight: 4,
    },
  },
}));

const OutlinedButton = styled(Button)(({ theme }) => ({
  borderRadius: 50,
  borderColor: theme.palette.primary.main,
  color: theme.palette.primary.main,
  padding: '10px 30px',
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    transform: 'scale(1.05)',
    borderColor: theme.palette.mode === 'dark' 
      ? '#1e40af'
      : '#2563eb',
    background: theme.palette.mode === 'dark' 
      ? 'rgba(59, 130, 246, 0.1)'
      : 'rgba(59, 130, 246, 0.1)',
  },
  [theme.breakpoints.down('sm')]: {
    padding: '8px 16px',
    fontSize: '0.875rem',
    '& .MuiButton-startIcon': {
      marginRight: 4,
    },
  },
}));

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  padding: theme.spacing(3),
  borderRadius: 16,
  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.palette.mode === 'dark' 
      ? '0 8px 20px rgba(59, 130, 246, 0.4)'
      : '0 8px 20px rgba(59, 130, 246, 0.2)',
  },
}));

const features = [
  {
    icon: <AccountBalanceWalletIcon sx={{ fontSize: 40 }} />,
    title: 'Track Expenses',
    description: 'Easily monitor your daily expenses and income with our intuitive interface.',
  },
  {
    icon: <TimelineIcon sx={{ fontSize: 40 }} />,
    title: 'Visual Analytics',
    description: 'Get insights into your spending patterns with beautiful charts and graphs.',
  },
  {
    icon: <SecurityIcon sx={{ fontSize: 40 }} />,
    title: 'Secure & Private',
    description: 'Your financial data is encrypted and stored securely with Firebase.',
  },
  {
    icon: <DevicesIcon sx={{ fontSize: 40 }} />,
    title: 'Access Anywhere',
    description: 'Access your financial data from any device, anytime, anywhere.',
  },
];

function LandingPage() {
  const navigate = useNavigate();
  const theme = useTheme();
  const { isDarkMode, toggleTheme } = useThemeContext();

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: theme.palette.background.gradient,
      color: theme.palette.text.primary,
    }}>
      <AppBar 
        position="static" 
        elevation={0}
        sx={{ 
          background: 'transparent',
          boxShadow: 'none',
        }}
      >
        <Toolbar sx={{ 
          flexWrap: 'wrap',
          gap: { xs: 1, sm: 2 },
          justifyContent: { xs: 'space-between', sm: 'flex-start' },
          py: { xs: 2, sm: 3 },
          px: { xs: 3, sm: 4 }
        }}>
          <Typography 
            variant="h5" 
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
              <IconButton onClick={toggleTheme} color="primary" sx={{ p: 1 }}>
                {isDarkMode ? <Brightness7Icon /> : <Brightness4Icon />}
              </IconButton>
            </Tooltip>
            <OutlinedButton
              onClick={() => navigate('/login')}
              startIcon={<LoginIcon />}
              sx={{ display: { xs: 'none', sm: 'inline-flex' } }}
            >
              Login
            </OutlinedButton>
            <GradientButton
              onClick={() => navigate('/signup')}
              startIcon={<PersonAddIcon />}
            >
              Sign Up
            </GradientButton>
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg">
        <Box sx={{ mt: 8, mb: 6 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Typography
              variant="h2"
              component="h1"
              align="center"
              gutterBottom
              sx={{
                fontWeight: 700,
                background: theme.palette.mode === 'dark' 
                  ? 'linear-gradient(45deg, #2563eb 30%, #3b82f6 90%)'
                  : 'linear-gradient(45deg, #1e40af 30%, #3b82f6 90%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 3,
              }}
            >
              Take Control of Your Finances
            </Typography>
            <Typography
              variant="h5"
              align="center"
              sx={{ 
                mb: 4,
                color: theme.palette.text.secondary,
                maxWidth: '800px',
                mx: 'auto',
              }}
            >
              Track your income and expenses with our easy-to-use finance management tool.
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3 }}>
              <GradientButton
                size="large"
                onClick={() => navigate('/signup')}
                startIcon={<PersonAddIcon />}
              >
                Get Started
              </GradientButton>
              <OutlinedButton
                size="large"
                onClick={() => navigate('/login')}
                startIcon={<LoginIcon />}
              >
                Login
              </OutlinedButton>
            </Box>
          </motion.div>
        </Box>

        <Grid container spacing={4} sx={{ mt: 4, mb: 8 }}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={feature.title}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <StyledCard sx={{ 
                  background: theme.palette.background.paper,
                  color: theme.palette.text.primary,
                }}>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      mb: 3,
                      width: 80,
                      height: 80,
                      borderRadius: '50%',
                      background: theme.palette.mode === 'dark' 
                        ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(147, 197, 253, 0.2) 100%)'
                        : 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
                      color: theme.palette.primary.main,
                    }}
                  >
                    {feature.icon}
                  </Box>
                  <Typography 
                    variant="h6" 
                    component="h2" 
                    gutterBottom
                    sx={{ 
                      fontWeight: 600,
                      color: theme.palette.text.primary,
                    }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      color: theme.palette.text.secondary,
                      lineHeight: 1.6,
                    }}
                  >
                    {feature.description}
                  </Typography>
                </StyledCard>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}

export default LandingPage;
