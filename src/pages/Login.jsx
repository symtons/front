import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  TextField,
  Button,
  Typography,
  Checkbox,
  FormControlLabel,
  Link,
  IconButton,
  InputAdornment,
  Avatar,
  Grid,
  Alert,
  CircularProgress
} from '@mui/material';
import { Visibility, VisibilityOff, AccountCircle } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { authService } from '../services/authService';

// Styled components for beautiful design
const StyledCard = styled(Card)(({ theme }) => ({
  minHeight: '600px',
  borderRadius: '16px',
  overflow: 'hidden',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  display: 'flex',
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
  },
}));

const LeftPanel = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: 'white',
  padding: theme.spacing(6),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '600px',
  width: '50%',
  [theme.breakpoints.down('md')]: {
    width: '100%',
    minHeight: '300px',
  },
}));

const RightPanel = styled(Box)(({ theme }) => ({
  padding: theme.spacing(6),
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  width: '50%',
  backgroundColor: 'white',
  [theme.breakpoints.down('md')]: {
    width: '100%',
  },
}));

const LogoContainer = styled(Box)(({ theme }) => ({
  backgroundColor: 'white',
  borderRadius: '16px',
  padding: theme.spacing(3),
  marginBottom: theme.spacing(4),
  width: '180px',
  height: '180px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const SignInButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(90deg, #667eea 0%, #f59e42 100%)',
  color: 'white',
  padding: '12px',
  borderRadius: '8px',
  textTransform: 'none',
  fontSize: '16px',
  fontWeight: 500,
  '&:hover': {
    background: 'linear-gradient(90deg, #5568d3 0%, #e08a2e 100%)',
  },
}));

const CarouselDot = styled(Box)(({ active }) => ({
  width: '8px',
  height: '8px',
  borderRadius: '50%',
  backgroundColor: active ? 'white' : 'rgba(255, 255, 255, 0.5)',
  margin: '0 4px',
  cursor: 'pointer',
}));

// Login Component
const Login = () => {
  const navigate = useNavigate();
  
  // React state hooks
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const slides = [
    {
      title: 'TPA',
      subtitle: 'Tennessee Personal Assistance',
      description: 'Empowering communities through comprehensive personal assistance services across Tennessee',
    },
  ];

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authService.login(email, password);
      
      // Store remember me preference
      if (rememberMe) {
        localStorage.setItem('rememberMe', 'true');
      }
      
      // Navigate based on user role
      const userRole = response.user.role;
      
      if (userRole === 'Admin') {
        navigate('/admin/dashboard');
      } else if (userRole === 'HRManager') {
        navigate('/hr/dashboard');
      } else {
        navigate('/employee/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f59e42 100%)',
        padding: 2,
      }}
    >
      <StyledCard sx={{ maxWidth: 1100, width: '100%' }}>
        {/* Left Panel - Branding */}
        <LeftPanel>
          <LogoContainer>
            <img 
              src="/logo.png" 
              alt="TPA Logo" 
              style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
            />
          </LogoContainer>
          
          <Typography variant="h3" sx={{ fontWeight: 600, mb: 2, textAlign: 'center' }}>
            {slides[activeSlide].title}
          </Typography>
          
          <Typography variant="h6" sx={{ mb: 2, textAlign: 'center' }}>
            {slides[activeSlide].subtitle}
          </Typography>
          
          <Typography variant="body1" sx={{ textAlign: 'center', maxWidth: 400, opacity: 0.95 }}>
            {slides[activeSlide].description}
          </Typography>

          {/* Carousel Dots */}
          <Box sx={{ display: 'flex', mt: 4 }}>
            {[0, 1, 2].map((index) => (
              <CarouselDot
                key={index}
                active={activeSlide === index}
                onClick={() => setActiveSlide(index)}
              />
            ))}
          </Box>
        </LeftPanel>

        {/* Right Panel - Login Form */}
        <RightPanel>
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Avatar sx={{ bgcolor: '#667eea', mr: 1 }}>
                <AccountCircle />
              </Avatar>
              <Typography variant="h4" sx={{ fontWeight: 600, color: '#333' }}>
                Welcome Back
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              Sign in to your account
            </Typography>
          </Box>

          <form onSubmit={handleSubmit}>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            
            <TextField
              fullWidth
              label="Email Address *"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              margin="normal"
              variant="outlined"
              required
              disabled={loading}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="Password *"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
              variant="outlined"
              required
              disabled={loading}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleClickShowPassword}
                      edge="end"
                      disabled={loading}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2 }}
            />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    color="primary"
                    disabled={loading}
                  />
                }
                label="Remember me"
              />
              <Link href="#" underline="hover" sx={{ color: '#667eea' }}>
                Forgot Password?
              </Link>
            </Box>

            <SignInButton
              fullWidth
              variant="contained"
              size="large"
              type="submit"
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
            </SignInButton>

            <Box sx={{ textAlign: 'center', mt: 3 }}>
              <Typography variant="body2" color="text.secondary">
                Need help?{' '}
                <Link href="#" underline="hover" sx={{ color: '#667eea' }}>
                  Contact Support
                </Link>
              </Typography>
            </Box>
          </form>
        </RightPanel>
      </StyledCard>
    </Box>
  );
};

export default Login;