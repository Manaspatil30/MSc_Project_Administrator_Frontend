'use client'
import { Avatar, Box, Button, Checkbox, Container, FormControlLabel, Grid, Link, TextField, Typography } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { toast } from 'react-toastify';


const Login = () => {
  const router = useRouter();
  useEffect(()=>{
    console.log('Token:', Cookies.get('token')); // Debugging line
    if(Cookies.get('token')){
      router.push('/dashboard')
    }
    console.log(Cookies.get('token'))
  },[router])

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    await axios.post(process.env.baseUrl + 'api/v1/auth/authenticate',
      {
        email : data.get('email'),
        password : data.get('password')
      }
    ).then((res) => {
      Cookies.set('token', res.data.access_token);
      Cookies.set('userId', res.data.user.userId);
      Cookies.set('user_role', res.data.user.role);
      console.log('Login successful, redirecting...'); // Debugging line
    }).then(()=>{
      if(Cookies.get('user_role') == 'MOD_OWNER'){
        router.push('/mod_ownerDashboard')
      } else {
        router.push('/dashboard')
      }
    }).catch((err) => {
      if (err.response && err.response.status === 401) {
        toast.error('Wrong username or password');
      } else {
        console.log("Login Error", err);
      }
    })
  };

  return (
    <Container component="main" maxWidth="xs">
    <Box
      sx={{
        marginTop: 8,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
        <LockOutlinedIcon />
      </Avatar>
      <Typography component="h1" variant="h5">
        Log in
      </Typography>
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
        <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email Address"
          name="email"
          autoComplete="email"
          autoFocus
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="password"
          label="Password"
          type="password"
          id="password"
          autoComplete="current-password"
        />
        <FormControlLabel
          control={<Checkbox value="remember" color="primary" />}
          label="Remember me"
          sx={{display:'none'}}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Sign In
        </Button>
        {/* <Grid container>
          <Grid item xs>
            <Link href="#" variant="body2">
              Forgot password?
            </Link>
          </Grid>
          <Grid item>
            <Link href="#" variant="body2">
              {"Don't have an account? Sign Up"}
            </Link>
          </Grid>
        </Grid> */}
      </Box>
    </Box>
  </Container>
  )
}

export default Login