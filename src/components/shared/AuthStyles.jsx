import { styled } from '@mui/material/styles';
import { Box, TextField, Button } from '@mui/material';

export const AuthContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  minHeight: '100vh',
  background: theme.palette.background.default,
}));

export const FormSide = styled(Box)(({ theme }) => ({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '40px',
  position: 'relative',
  background: theme.palette.background.paper,
  [theme.breakpoints.down('md')]: {
    flex: '0 0 100%',
  },
}));

export const DecorativeSide = styled(Box)(({ theme }) => ({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '40px',
  position: 'relative',
  background: theme.palette.mode === 'dark'
    ? 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)'
    : 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)',
  overflow: 'hidden',
  [theme.breakpoints.down('md')]: {
    display: 'none',
  },
}));

export const StyledTextField = styled(TextField)(({ theme }) => ({
  marginBottom: '16px',
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
    backgroundColor: theme.palette.mode === 'dark' 
      ? 'rgba(255, 255, 255, 0.05)'
      : 'rgba(255, 255, 255, 0.8)',
    transition: 'all 0.2s ease-in-out',
    '& fieldset': {
      borderColor: theme.palette.mode === 'dark'
        ? 'rgba(255, 255, 255, 0.1)'
        : 'rgba(0, 0, 0, 0.1)',
    },
    '&:hover fieldset': {
      borderColor: theme.palette.primary.main,
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.primary.main,
      borderWidth: '2px',
    },
  },
  '& .MuiInputLabel-root': {
    color: theme.palette.text.secondary,
    fontSize: '1rem',
  },
  '& .MuiInputBase-input': {
    color: theme.palette.text.primary,
    fontSize: '1rem',
    padding: '16px',
  },
}));

export const GradientButton = styled(Button)(({ theme }) => ({
  background: theme.palette.mode === 'dark'
    ? 'linear-gradient(45deg, #2563eb 30%, #3b82f6 90%)'
    : 'linear-gradient(45deg, #3b82f6 30%, #60a5fa 90%)',
  color: 'white',
  padding: '12px 24px',
  borderRadius: '12px',
  textTransform: 'none',
  fontSize: '1rem',
  fontWeight: 600,
  boxShadow: theme.palette.mode === 'dark'
    ? '0 4px 6px -1px rgba(37, 99, 235, 0.3)'
    : '0 4px 6px -1px rgba(59, 130, 246, 0.3)',
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    background: theme.palette.mode === 'dark'
      ? 'linear-gradient(45deg, #1e40af 30%, #2563eb 90%)'
      : 'linear-gradient(45deg, #2563eb 30%, #3b82f6 90%)',
    boxShadow: theme.palette.mode === 'dark'
      ? '0 10px 15px -3px rgba(37, 99, 235, 0.4)'
      : '0 10px 15px -3px rgba(59, 130, 246, 0.4)',
    transform: 'translateY(-1px)',
  },
  '&:active': {
    transform: 'translateY(0)',
  },
  '&.Mui-disabled': {
    background: theme.palette.action.disabledBackground,
    color: theme.palette.action.disabled,
  },
}));

export const FloatingShapes = styled(Box)({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  overflow: 'hidden',
  '& .shape': {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '50%',
    animation: 'float 6s infinite ease-in-out',
  },
  '& .shape1': {
    width: '120px',
    height: '120px',
    top: '20%',
    left: '20%',
    animationDelay: '0s',
  },
  '& .shape2': {
    width: '80px',
    height: '80px',
    top: '60%',
    right: '20%',
    animationDelay: '2s',
  },
  '& .shape3': {
    width: '60px',
    height: '60px',
    bottom: '20%',
    left: '30%',
    animationDelay: '4s',
  },
  '@keyframes float': {
    '0%, 100%': {
      transform: 'translateY(0) scale(1)',
    },
    '50%': {
      transform: 'translateY(-20px) scale(1.1)',
    },
  },
});
