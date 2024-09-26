"use client"
import { AppBar, Avatar, Box, CssBaseline, IconButton, Menu, MenuItem, Toolbar, Tooltip, Typography } from '@mui/material'
import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import Cookies from 'js-cookie';
import axiosInstance from '@utils/axios';

const settings = ['Profile', 'Logout']; 

const Navbar = () => {
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState();

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

  useEffect(() => {
    if (Cookies.get('token')) {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(()=>{
    axiosInstance.get("/api/v1/users/profile")
    .then((res) => {setUser(res.data)})
},[])

  return (
    <Box display={'flex'} width={'auto%'}>
        <CssBaseline />
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar>
          
          <Typography component={Link} href={"/"} fontWeight={'700'} width={'100%'}>
            MSc Project Administrator
          </Typography>

          <Box sx={{ flexGrow: 0, 
            display:'flex', justifyContent:'end', alignItems:'center', width:'100%' 
            }}>
              <Typography fontWeight={'700'} marginRight={5}>
                {
                  user && 
                  // @ts-ignore
                  "Hello, " + user.firstname + " " + user.lastname
                }
              </Typography>
              {
                isAuthenticated && 
            <Tooltip title="Open" >
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar />
              </IconButton>
            </Tooltip>
               }
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