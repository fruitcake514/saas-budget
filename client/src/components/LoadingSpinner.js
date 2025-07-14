import React from 'react';
import {
  Box,
  CircularProgress,
  Typography,
  useTheme,
  useMediaQuery
} from '@mui/material';

const LoadingSpinner = ({ 
  message = "Loading...", 
  size = 40, 
  fullscreen = false,
  overlay = false 
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const containerStyles = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    ...(fullscreen && {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 9999,
      background: 'rgba(10, 14, 39, 0.9)',
      backdropFilter: 'blur(4px)'
    }),
    ...(overlay && {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 1000,
      background: 'rgba(10, 14, 39, 0.7)',
      backdropFilter: 'blur(2px)'
    }),
    ...(!fullscreen && !overlay && {
      padding: isMobile ? 2 : 4,
      minHeight: 200
    })
  };

  return (
    <Box sx={containerStyles}>
      <CircularProgress 
        size={isMobile ? size * 0.8 : size} 
        sx={{ 
          color: '#00b4d8',
          '& .MuiCircularProgress-circle': {
            strokeLinecap: 'round',
          }
        }} 
      />
      <Typography 
        variant={isMobile ? "body2" : "body1"} 
        color="textSecondary"
        sx={{ 
          textAlign: 'center',
          fontWeight: 500,
          color: '#ffffff',
          opacity: 0.8
        }}
      >
        {message}
      </Typography>
    </Box>
  );
};

export default LoadingSpinner;