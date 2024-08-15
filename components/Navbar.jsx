"use client"
import { AppBar, Avatar, Box, CssBaseline, IconButton, Menu, MenuItem, Toolbar, Tooltip, Typography } from '@mui/material'
import Link from 'next/link';
import React from 'react'
import Cookies from 'js-cookie';

const settings = ['Profile', 'Logout']; 

const Navbar = () => {
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = () => {
    Cookies.remove('token');
    Cookies.remove('userId');
    Cookies.remove('user_role');
  }

  return (
    <Box display={'flex'} width={'auto%'}>
        <CssBaseline />
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar>
          <Typography variant="h6">
            Navbar
          </Typography>
          <Box sx={{ flexGrow: 0, 
            display:'flex', justifyContent:'end', width:'100%' 
            }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
                <MenuItem component={Link} href='/profile' onClick={handleCloseUserMenu}>
                  <Typography textAlign="center">Profile</Typography>
                </MenuItem>
                <MenuItem component={Link} href='/login' onClick={() => {handleCloseUserMenu(); handleLogout();}}>
                  <Typography textAlign="center">Logout</Typography>
                </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  )
}

export default Navbar