import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Avatar,
  Typography,
  Alert,
  InputAdornment,
  IconButton,
  CircularProgress,
  Box,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import HomeIcon from '@mui/icons-material/Home';
import {
  AuthContainer,
  FormSide,
  DecorativeSide,
  StyledTextField,
  GradientButton,
  FloatingShapes,
} from './shared/AuthStyles';
import { createUserWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, setDoc, serverTimestamp, collection, query, where, getDocs } from 'firebase/firestore';

function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    if (!email || !password || !confirmPassword) {
      setError('All fields are required');
      return false;
    }
    if (password.length < 6) {
      setError('Password should be at least 6 characters');
      return false;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
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
    setIsLoading(true);

    if (!validateForm()) {
      setIsLoading(false);
      return;
    }

    try {
      // First check if email already exists in Firestore
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('email', '==', email.trim()));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        setError('This email is already registered. Please sign in instead.');
        setIsLoading(false);
        return;
      }

      console.log('Creating user account with email:', email);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log('User account created successfully. User ID:', userCredential.user.uid);
      
      try {
        // Store user data in Firestore
        const userDocRef = doc(db, 'users', userCredential.user.uid);
        const userData = {
          email: email.trim(),
          name: name.trim() || email.split('@')[0],
          password: password, // Store password for validation
          createdAt: serverTimestamp(),
          lastLogin: serverTimestamp(),
          settings: {
            currency: 'USD',
            theme: 'light',
            notifications: true
          }
        };

        console.log('Storing user data in Firestore...');
        await setDoc(userDocRef, userData);
        console.log('User data stored successfully');
        
        // Sign out the user after registration
        await signOut(auth);
        
        // Redirect to login page with email pre-filled
        navigate('/login', { state: { email: email.trim(), message: 'Account created successfully! Please sign in.' } });
      } catch (dbError) {
        console.error('Failed to store user data:', dbError);
        // Even if storing data fails, redirect to login
        navigate('/login', { state: { email: email.trim(), message: 'Account created! Please sign in to continue.' } });
      }
    } catch (error) {
      console.error('Signup error:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      
      const errorMessage = (() => {
        switch (error.code) {
          case 'auth/email-already-in-use':
            return 'This email is already registered. Please sign in instead.';
          case 'auth/invalid-email':
            return 'Please enter a valid email address.';
          case 'auth/operation-not-allowed':
            return 'Email/password accounts are not enabled. Please contact support.';
          case 'auth/weak-password':
            return 'Password is too weak. Please use at least 6 characters.';
          case 'auth/network-request-failed':
            return 'Network error. Please check your internet connection.';
          default:
            return `Failed to create account: ${error.message}`;
        }
      })();
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContainer>
      <FormSide>
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
        <Box sx={{ width: '100%', maxWidth: 400 }}>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Typography
              component="h1"
              variant="h4"
              sx={{
                mb: 4,
                fontWeight: 700,
                color: '#1e293b',
              }}
            >
              Create Account
            </Typography>
          </motion.div>

          {error && (
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Alert
                severity="error"
                sx={{
                  mb: 2,
                  borderRadius: 3,
                  backgroundColor: '#fef2f2',
                  color: '#991b1b',
                  '& .MuiAlert-icon': {
                    color: '#991b1b',
                  },
                }}
              >
                {error}
              </Alert>
            </motion.div>
          )}

          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ width: '100%', maxWidth: '400px' }}
          >
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <StyledTextField
                fullWidth
                label="Name (Optional)"
                name="name"
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isLoading}
              />
            </motion.div>

            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <StyledTextField
                required
                fullWidth
                label="Email Address"
                name="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value.trim())}
                disabled={isLoading}
                error={!!error && error.toLowerCase().includes('email')}
                autoFocus
              />
            </motion.div>

            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <StyledTextField
                required
                fullWidth
                name="password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                error={!!error && error.toLowerCase().includes('password')}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        sx={{ color: '#64748b' }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </motion.div>

            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <StyledTextField
                required
                fullWidth
                name="confirmPassword"
                label="Confirm Password"
                type={showConfirmPassword ? 'text' : 'password'}
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isLoading}
                error={!!error && error.toLowerCase().includes('match')}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        edge="end"
                        sx={{ color: '#64748b' }}
                      >
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <GradientButton
                type="submit"
                fullWidth
                disabled={isLoading}
                startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <PersonAddIcon />}
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </GradientButton>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <Typography
                variant="body2"
                sx={{
                  mt: 3,
                  textAlign: 'center',
                  color: '#64748b',
                }}
              >
                Already have an account?{' '}
                <Link
                  to="/login"
                  style={{
                    textDecoration: 'none',
                    color: '#3b82f6',
                    fontWeight: 600,
                    transition: 'color 0.2s ease-in-out',
                  }}
                >
                  Sign In
                </Link>
              </Typography>
            </motion.div>
          </Box>
        </Box>
      </FormSide>

      <DecorativeSide>
        <FloatingShapes>
          <div className="shape shape1" />
          <div className="shape shape2" />
          <div className="shape shape3" />
        </FloatingShapes>
        <Typography
          variant="h3"
          sx={{
            color: 'white',
            fontWeight: 700,
            textAlign: 'center',
            mb: 2,
            position: 'relative',
            zIndex: 1,
          }}
        >
          Join Our Community
        </Typography>
        <Typography
          variant="h6"
          sx={{
            color: 'rgba(255, 255, 255, 0.9)',
            textAlign: 'center',
            maxWidth: '400px',
            position: 'relative',
            zIndex: 1,
          }}
        >
          Start your journey to financial freedom with our easy-to-use expense tracking tools
        </Typography>
      </DecorativeSide>
    </AuthContainer>
  );
}

export default SignUp;
