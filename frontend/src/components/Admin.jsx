import React, { useEffect, useState } from "react"
import { useNavigate } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { toast } from "react-toastify";



const defaultTheme = createTheme();

const Admin = () => {


  const navigate = useNavigate();

  const [username, setName] = useState('');
  const [password, setPassword] = useState('');
  const [isdisabled, setIsDisabled] = useState(true);

  useEffect(() => {
    if (username === '' || password === '') {
      setIsDisabled(true)
    }
    else {
      setIsDisabled(false)
    }
  }, [username, password])


  const handaleSubmit = (e) => {
    e.preventDefault();
    if (username.length > 50 || password.length > 50) {
      toast.error('Name and password max length is 50')
    }
    else {
      try {
        const data = {
          username,
          password
        }
        fetch('http://localhost:4500/admin', {
          method : 'POST',
          headers : {
            'Content-Type':'application/json',
          },
          body: JSON.stringify(data),
        })
        .then((res) => {
          if(res.ok){
            toast.success('Login Successful');
            navigate('/dashboard');
            return res.json()
          } else{
            throw new Error('Network response was no ok');
          }
        })
        .then((data) =>{
          sessionStorage.setItem('token', data.token);
        })
        .catch(() => {
          toast.error('Invalid Username and Password')
        });
      } catch (error) {
        console.error('Network error:', error);
      }
    }
  }

  return (

    <div style={{ height: '100vh' }}>
      <ThemeProvider theme={defaultTheme} >
        <Container component="main" maxWidth="xs" >
          <CssBaseline />
            <Box
            sx={{
              marginTop: '50px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              border: '2px solid orange',
              padding: '4rem',
              backgroundColor :'#F4F6F6' 
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: 'warning.main', margin: '20px' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            <Box component="form" onSubmit={(e)=>handaleSubmit(e)} noValidate sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="UserName"
                name="username"
                
                autoFocus
                value={username}
                onChange={(e) => setName(e.target.value)}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}

              />
              <FormControlLabel
                control={<Checkbox value="remember" color="warning" />}
                label="Remember me"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 4.5 }}
                disabled={isdisabled}
              >
                Sign in
              </Button>
              <Grid container>
                <Grid item xs>
                  <Link href="#" variant="body2" sx={{ marginLeft: '9rem', color: 'black' }} >
                    Forgot password?
                  </Link>
                </Grid>
                <Grid item>
                  {/* <Link href="#" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link> */}
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Container>
      </ThemeProvider>
    </div>
  )
}

export default Admin