import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import {
  Typography,
  Alert,
  Box,
  CircularProgress,
  InputAdornment,
  IconButton,
  Avatar,
  useTheme,
} from '@mui/material';
import { motion } from 'framer-motion';
import HomeIcon from '@mui/icons-material/Home';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useThemeContext } from '../context/ThemeContext';
import { 
  AuthContainer, 
  FormSide, 
  DecorativeSide, 
  StyledTextField, 
  GradientButton,
  FloatingShapes 
} from './shared/AuthStyles';

function Login() {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const { isDarkMode } = useThemeContext();
  const [email, setEmail] = useState(location.state?.email || '');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    if (!email || !password) {
      setError('Email and password are required');
      return false;
    }
    if (!email.includes('@')) {
      setError('Please enter a valid email address');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      let errorMessage = 'Failed to login. Please try again.';
      
      if (err.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email. Please sign up first.';
      } else if (err.code === 'auth/wrong-password') {
        errorMessage = 'Incorrect password. Please try again.';
      } else if (err.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address.';
      } else if (err.code === 'auth/too-many-requests') {
        errorMessage = 'Too many failed attempts. Please try again later.';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContainer sx={{ 
      background: theme.palette.background.default,
      color: theme.palette.text.primary,
    }}>
      <FormSide sx={{ 
        background: theme.palette.background.paper,
      }}>
        <Box sx={{ position: 'absolute', top: 20, left: 20 }}>
          <GradientButton
            component={Link}
            to="/"
            startIcon={<HomeIcon />}
            sx={{ 
              minWidth: 'auto',
              px: 2,
              py: 1,
            }}
          >
            Home
          </GradientButton>
        </Box>
        <Box sx={{ width: '100%', maxWidth: 400, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Avatar
              sx={{
                width: 56,
                height: 56,
                bgcolor: theme.palette.primary.main,
                mb: 2,
                boxShadow: `0 4px 6px -1px ${theme.palette.primary.main}20`,
              }}
            >
              <LockOutlinedIcon sx={{ fontSize: 32 }} />
            </Avatar>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Typography variant="h4" gutterBottom sx={{ 
              fontWeight: 600, 
              mb: 4, 
              textAlign: 'center',
              color: theme.palette.text.primary,
            }}>
              Welcome Back
            </Typography>
          </motion.div>

          {error && (
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              style={{ width: '100%' }}
            >
              <Alert 
                severity="error" 
                sx={{ 
                  mb: 3,
                  borderRadius: '12px',
                  backgroundColor: theme.palette.mode === 'dark' ? '#2c1212' : '#fef2f2',
                  color: theme.palette.mode === 'dark' ? '#fecaca' : '#991b1b',
                  '& .MuiAlert-icon': {
                    color: theme.palette.mode === 'dark' ? '#fecaca' : '#991b1b',
                  },
                }}
              >
                {error}
              </Alert>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <StyledTextField
                fullWidth
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value.trim())}
                disabled={loading}
                placeholder="Enter your email"
                sx={{ mb: 2 }}
              />
            </motion.div>

            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <StyledTextField
                fullWidth
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                placeholder="Enter your password"
                sx={{ mb: 3 }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        sx={{ color: theme.palette.text.secondary }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <GradientButton
                fullWidth
                type="submit"
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <LockOutlinedIcon />}
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </GradientButton>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Typography 
                sx={{ 
                  mt: 3, 
                  textAlign: 'center',
                  color: theme.palette.text.secondary,
                }}
              >
                Don't have an account?{' '}
                <Link 
                  to="/signup" 
                  style={{ 
                    color: theme.palette.primary.main,
                    textDecoration: 'none',
                    fontWeight: 600,
                    transition: 'color 0.2s ease-in-out',
                  }}
                >
                  Sign Up
                </Link>
              </Typography>
            </motion.div>
          </form>
        </Box>
      </FormSide>
      <DecorativeSide sx={{
        background: theme.palette.mode === 'dark'
          ? 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)'
          : 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)',
      }}>
        <FloatingShapes>
          <div className="shape shape1" />
          <div className="shape shape2" />
          <div className="shape shape3" />
        </FloatingShapes>
        <Typography variant="h3" color="white" sx={{ fontWeight: 600, mb: 2, textAlign: 'center', position: 'relative', zIndex: 1 }}>
          Track Your Finances
        </Typography>
        <Typography variant="h6" color="rgba(255,255,255,0.8)" sx={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
          Manage your income and expenses with ease
        </Typography>
      </DecorativeSide>
    </AuthContainer>
  );
}

export default Login;
