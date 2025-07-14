import React from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Alert,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  Error as ErrorIcon,
  Home as HomeIcon
} from '@mui/icons-material';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    
    // Log error to console for debugging
    console.error('Error caught by boundary:', error, errorInfo);
  }

  handleRefresh = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return <ErrorFallback 
        error={this.state.error} 
        onRefresh={this.handleRefresh}
        onGoHome={this.handleGoHome}
      />;
    }

    return this.props.children;
  }
}

const ErrorFallback = ({ error, onRefresh, onGoHome }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0a0e27 0%, #1a1f3a 100%)',
        padding: isMobile ? 2 : 4
      }}
    >
      <Paper
        sx={{
          p: isMobile ? 3 : 4,
          maxWidth: 600,
          width: '100%',
          textAlign: 'center',
          background: 'rgba(26, 31, 58, 0.9)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(0, 180, 216, 0.1)',
          color: '#ffffff'
        }}
      >
        <Box sx={{ mb: 3 }}>
          <ErrorIcon 
            sx={{ 
              fontSize: isMobile ? 48 : 64, 
              color: '#ff006e',
              mb: 2
            }} 
          />
          <Typography 
            variant={isMobile ? "h5" : "h4"} 
            gutterBottom
            sx={{ color: '#ff006e', fontWeight: 600 }}
          >
            Something went wrong
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ opacity: 0.8, mb: 3 }}
          >
            We're sorry, but something unexpected happened. Please try refreshing the page or go back to the homepage.
          </Typography>
        </Box>

        <Alert 
          severity="error" 
          sx={{ 
            mb: 3, 
            textAlign: 'left',
            backgroundColor: 'rgba(255, 0, 110, 0.1)',
            borderColor: 'rgba(255, 0, 110, 0.3)',
            color: '#ffffff',
            '& .MuiAlert-icon': {
              color: '#ff006e'
            }
          }}
        >
          <Typography variant="body2">
            <strong>Error:</strong> {error?.message || 'Unknown error occurred'}
          </Typography>
        </Alert>

        <Box 
          sx={{ 
            display: 'flex', 
            gap: 2, 
            flexDirection: isMobile ? 'column' : 'row',
            justifyContent: 'center'
          }}
        >
          <Button
            variant="contained"
            startIcon={<RefreshIcon />}
            onClick={onRefresh}
            sx={{
              background: 'linear-gradient(45deg, #00b4d8, #0077b6)',
              '&:hover': {
                background: 'linear-gradient(45deg, #0077b6, #005f73)',
              },
              flex: isMobile ? 1 : 'initial'
            }}
          >
            Refresh Page
          </Button>
          <Button
            variant="outlined"
            startIcon={<HomeIcon />}
            onClick={onGoHome}
            sx={{
              borderColor: '#00b4d8',
              color: '#00b4d8',
              '&:hover': {
                borderColor: '#0077b6',
                backgroundColor: 'rgba(0, 180, 216, 0.1)',
              },
              flex: isMobile ? 1 : 'initial'
            }}
          >
            Go to Homepage
          </Button>
        </Box>

        {process.env.NODE_ENV === 'development' && error && (
          <Box sx={{ mt: 3, textAlign: 'left' }}>
            <Typography variant="h6" sx={{ mb: 1, color: '#ffb700' }}>
              Development Error Details:
            </Typography>
            <Paper 
              sx={{ 
                p: 2, 
                backgroundColor: 'rgba(0, 0, 0, 0.3)',
                border: '1px solid rgba(255, 183, 0, 0.3)',
                maxHeight: 200,
                overflow: 'auto'
              }}
            >
              <Typography 
                variant="body2" 
                component="pre"
                sx={{ 
                  whiteSpace: 'pre-wrap',
                  fontSize: '0.75rem',
                  fontFamily: 'monospace',
                  color: '#ffb700'
                }}
              >
                {error.stack}
              </Typography>
            </Paper>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default ErrorBoundary;