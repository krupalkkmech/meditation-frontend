import React, { useState } from 'react';

import { useNavigate } from 'react-router-dom';

import {
  AttachMoney as PricingIcon,
  Info as InfoIcon,
  Logout as LogoutIcon,
  Menu as MenuIcon,
} from '@mui/icons-material';
import {
  AppBar,
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';

import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { logoutUser } from '../store/slices/authSlice';

const Header = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { user } = useAppSelector(state => state.auth);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/auth');
    setAnchorEl(null);
  };

  const handleMenuOpen = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNavigation = path => {
    navigate(path);
    handleMenuClose();
  };

  const menuItems = [
    { label: 'About', path: '/about', icon: <InfoIcon /> },
    { label: 'Pricing', path: '/pricing', icon: <PricingIcon /> },
  ];

  return (
    <AppBar position="static" elevation={0}>
      <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, md: 3 } }}>
        {/* Brand */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography
            variant="h5"
            component="div"
            sx={{
              fontWeight: 700,
              color: 'primary.main',
              cursor: 'pointer',
              '&:hover': {
                color: 'primary.dark',
              },
            }}
            onClick={() => user && navigate('/dashboard')}
          >
            TimeFlow
          </Typography>
        </Box>

        {user ? (
          // Authenticated user
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {isMobile ? (
              // Mobile menu
              <>
                <IconButton
                  color="inherit"
                  onClick={handleMenuOpen}
                  sx={{ color: 'text.primary' }}
                >
                  <MenuIcon />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                  PaperProps={{
                    sx: {
                      mt: 1,
                      minWidth: 200,
                      borderRadius: 2,
                      boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                    },
                  }}
                >
                  {menuItems.map(item => (
                    <MenuItem
                      key={item.path}
                      onClick={() => handleNavigation(item.path)}
                      sx={{
                        gap: 1,
                        py: 1.5,
                        '&:hover': {
                          backgroundColor: 'primary.50',
                        },
                      }}
                    >
                      {item.icon}
                      {item.label}
                    </MenuItem>
                  ))}
                  <MenuItem
                    onClick={handleLogout}
                    sx={{
                      gap: 1,
                      py: 1.5,
                      color: 'error.main',
                      '&:hover': {
                        backgroundColor: 'error.50',
                      },
                    }}
                  >
                    <LogoutIcon />
                    Logout
                  </MenuItem>
                </Menu>
              </>
            ) : (
              // Desktop menu
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {menuItems.map(item => (
                  <Button
                    key={item.path}
                    color="inherit"
                    onClick={() => handleNavigation(item.path)}
                    startIcon={item.icon}
                    sx={{
                      color: 'text.primary',
                      '&:hover': {
                        backgroundColor: 'primary.50',
                        color: 'primary.main',
                      },
                    }}
                  >
                    {item.label}
                  </Button>
                ))}
                <Button
                  color="error"
                  variant="outlined"
                  onClick={handleLogout}
                  startIcon={<LogoutIcon />}
                  sx={{
                    ml: 1,
                    borderColor: 'error.main',
                    '&:hover': {
                      backgroundColor: 'error.50',
                      borderColor: 'error.dark',
                    },
                  }}
                >
                  Logout
                </Button>
              </Box>
            )}
          </Box>
        ) : (
          // Unauthenticated user
          <Typography variant="body2" color="text.secondary">
            Welcome to TimeFlow
          </Typography>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
