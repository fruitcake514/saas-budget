import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton,
  Snackbar,
  Alert,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Close as CloseIcon,
  GetApp as InstallIcon,
  Smartphone as PhoneIcon,
  Computer as ComputerIcon,
  Apple as AppleIcon,
  Android as AndroidIcon
} from '@mui/icons-material';
import { usePWAInstall } from '../hooks/usePWAInstall';

const PWAInstallPrompt = ({ open, onClose }) => {
  const { canInstall, installPWA, platform } = usePWAInstall();
  const [installing, setInstalling] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleInstall = async () => {
    setInstalling(true);
    
    try {
      const success = await installPWA();
      if (success) {
        setShowSuccess(true);
        onClose();
      } else {
        setShowError(true);
      }
    } catch (error) {
      setShowError(true);
    } finally {
      setInstalling(false);
    }
  };

  const getPlatformIcon = () => {
    switch (platform) {
      case 'android':
        return <AndroidIcon sx={{ fontSize: 48, color: '#4CAF50' }} />;
      case 'ios':
        return <AppleIcon sx={{ fontSize: 48, color: '#000' }} />;
      case 'desktop':
        return <ComputerIcon sx={{ fontSize: 48, color: '#2196F3' }} />;
      default:
        return <PhoneIcon sx={{ fontSize: 48, color: '#FF9800' }} />;
    }
  };

  const getPlatformInstructions = () => {
    switch (platform) {
      case 'ios':
        return (
          <Box sx={{ textAlign: 'left', mt: 2 }}>
            <Typography variant="body2" gutterBottom>
              To install on iOS:
            </Typography>
            <Typography variant="body2" component="ol" sx={{ pl: 2 }}>
              <li>Tap the Share button in Safari</li>
              <li>Scroll down and tap "Add to Home Screen"</li>
              <li>Tap "Add" to confirm</li>
            </Typography>
          </Box>
        );
      case 'android':
        return canInstall ? (
          <Typography variant="body2" sx={{ mt: 2 }}>
            Tap "Install" below to add SaaS Budget to your home screen for quick access.
          </Typography>
        ) : (
          <Box sx={{ textAlign: 'left', mt: 2 }}>
            <Typography variant="body2" gutterBottom>
              To install on Android:
            </Typography>
            <Typography variant="body2" component="ol" sx={{ pl: 2 }}>
              <li>Open the Chrome menu (⋮)</li>
              <li>Tap "Add to Home screen"</li>
              <li>Tap "Add" to confirm</li>
            </Typography>
          </Box>
        );
      default:
        return (
          <Typography variant="body2" sx={{ mt: 2 }}>
            Install SaaS Budget for quick access and offline functionality.
          </Typography>
        );
    }
  };

  if (!open) return null;

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="sm"
        fullWidth
        fullScreen={isMobile}
        PaperProps={{
          sx: {
            borderRadius: isMobile ? 0 : 2,
            background: 'linear-gradient(135deg, #0a0e27 0%, #1a1a2e 100%)',
            color: '#ffffff'
          }
        }}
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          pb: 1
        }}>
          <Typography variant="h6">Install SaaS Budget</Typography>
          <IconButton
            onClick={onClose}
            sx={{ color: '#ffffff' }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        
        <DialogContent sx={{ textAlign: 'center', py: 3 }}>
          <Box sx={{ mb: 3 }}>
            {getPlatformIcon()}
          </Box>
          
          <Typography variant="h6" gutterBottom sx={{ color: '#00b4d8' }}>
            Get the full app experience
          </Typography>
          
          <Typography variant="body1" paragraph>
            Install SaaS Budget as a native app on your device for:
          </Typography>
          
          <Box sx={{ textAlign: 'left', mb: 3 }}>
            <Typography variant="body2" component="ul" sx={{ pl: 2 }}>
              <li>⚡ Faster loading and better performance</li>
              <li>📱 Home screen access like a native app</li>
              <li>🔄 Offline functionality with data sync</li>
              <li>🔔 Push notifications for budget alerts</li>
              <li>🎨 Full-screen immersive experience</li>
            </Typography>
          </Box>
          
          {getPlatformInstructions()}
        </DialogContent>
        
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button
            onClick={onClose}
            sx={{ 
              color: '#ffffff',
              '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' }
            }}
          >
            Maybe Later
          </Button>
          
          {canInstall && (
            <Button
              onClick={handleInstall}
              variant="contained"
              disabled={installing}
              startIcon={<InstallIcon />}
              sx={{
                background: 'linear-gradient(45deg, #00b4d8, #0077b6)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #0077b6, #005f73)',
                }
              }}
            >
              {installing ? 'Installing...' : 'Install App'}
            </Button>
          )}
        </DialogActions>
      </Dialog>
      
      <Snackbar
        open={showSuccess}
        autoHideDuration={4000}
        onClose={() => setShowSuccess(false)}
      >
        <Alert
          onClose={() => setShowSuccess(false)}
          severity="success"
          sx={{ width: '100%' }}
        >
          App installed successfully! Check your home screen.
        </Alert>
      </Snackbar>
      
      <Snackbar
        open={showError}
        autoHideDuration={4000}
        onClose={() => setShowError(false)}
      >
        <Alert
          onClose={() => setShowError(false)}
          severity="error"
          sx={{ width: '100%' }}
        >
          Failed to install app. Please try again.
        </Alert>
      </Snackbar>
    </>
  );
};

export default PWAInstallPrompt;