import { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Avatar, Menu, MenuItem, IconButton } from '@mui/material';
import { Person as PersonIcon } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';

interface User {
  username: string;
  email: string;
}

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [user, setUser] = useState<User | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  useEffect(() => {
    if (token) {
      fetchUserInfo();
    }
  }, [token]);

  const fetchUserInfo = async () => {
    try {
      const response = await api.get('/users/me');
      setUser(response.data);
    } catch (error) {
      console.error('Error fetching user info:', error);
    }
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    handleMenuClose();
    navigate('/login');
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component={Link} to="/" sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }}>
          Blog App
        </Typography>
        <Box>
          {token && user ? (
            <>
              <Button color="inherit" component={Link} to="/create-post">
                Create Post
              </Button>
              <IconButton
                onClick={handleMenuOpen}
                color="inherit"
                sx={{ ml: 1 }}
              >
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <PersonIcon />
                  <Typography variant="caption">{user.username}</Typography>
                </Box>
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
              >
                <MenuItem component={Link} to="/profile" onClick={handleMenuClose}>
                  View Profile
                </MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </>
          ) : (
            <>
              <Button color="inherit" component={Link} to="/login">
                Login
              </Button>
              <Button color="inherit" component={Link} to="/register">
                Register
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;