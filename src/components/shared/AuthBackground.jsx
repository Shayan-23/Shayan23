import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';

const GradientBox = styled(Box)(({ theme }) => ({
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  background: 'linear-gradient(45deg, #f3f3f3 0%, #ffffff 100%)',
  zIndex: -1,
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    right: 0,
    width: '60%',
    height: '100%',
    background: 'linear-gradient(135deg, #e0f2ff 0%, #f5e6ff 50%, #e6f0ff 100%)',
    clipPath: 'polygon(30% 0, 100% 0, 100% 100%, 0% 100%)',
    opacity: 0.8,
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    top: '10%',
    right: '5%',
    width: '50%',
    height: '80%',
    background: 'radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 70%)',
    filter: 'blur(40px)',
  }
}));

const BubbleEffect = styled(Box)({
  position: 'absolute',
  top: 0,
  right: 0,
  width: '60%',
  height: '100%',
  overflow: 'hidden',
  '&::before, &::after': {
    content: '""',
    position: 'absolute',
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    background: 'rgba(255, 255, 255, 0.5)',
    animation: 'float 8s infinite ease-in-out',
  },
  '&::before': {
    top: '20%',
    right: '30%',
    animationDelay: '0s',
  },
  '&::after': {
    top: '60%',
    right: '40%',
    width: '15px',
    height: '15px',
    animationDelay: '2s',
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

function AuthBackground() {
  return (
    <>
      <GradientBox />
      <BubbleEffect />
    </>
  );
}

export default AuthBackground;
