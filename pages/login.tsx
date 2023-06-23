import { ThemeProvider } from '@emotion/react';
import {
  Typography,
  CssBaseline,
  Container,
  Button,
  TextField,
  Box,
  FormControl,
  OutlinedInput,
  InputAdornment,
  InputLabel,
  IconButton,
  FormControlLabel,
  Checkbox,
  Link,
} from '@mui/material';

import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

import Head from 'next/head';

import { useRef, useState, useEffect } from 'react';
import { useRouter } from 'next/router';

import { theme } from '../lib/theme';
import { supabase } from '../lib/supabaseClient';
import { decrypt } from '../lib/security/decrypt';

import Error from '@/components/Error/Error';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [checked, setChecked] = useState(true);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const userRef: any = useRef<HTMLInputElement>(null);
  const passRef = useRef<HTMLInputElement>(null);

  const router = useRouter();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const login = async (event: any) => {
    event.preventDefault();
    const { data: users, error } = await supabase
      .from('users')
      .select('name, password')

    if (error) {
      setError(true);
      setErrorMessage('Something went wrong');
    }

    const searchUser = users!.find(
      (user: any) =>
        user.name === userRef.current?.value &&
        decrypt(user.password).message === passRef.current?.value
    );

    if (searchUser) {
      localStorage.setItem('username', userRef.current?.value);
      localStorage.setItem('saveSession', checked.toString());
      router.push('/home');
    } else {
      setError(true);
      setErrorMessage('Invalid username or password');
    }
  };

  useEffect(() => {
    if (localStorage.getItem('saveSession') === 'true') {
      router.push('/home');
    }
  }, []);

  return (
    <>
      <Head>
        <title>Log in to Mitter / Mitter</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Container
          maxWidth="md"
          sx={{
            height: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <form onSubmit={login}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                background: '#181818',
                borderRadius: '8px',
                padding: '4rem 5rem',
              }}
            >
              <Typography variant="h3">Log in to Mitter</Typography>
              <TextField
                id="outlined-basic"
                label="Username"
                variant="outlined"
                inputRef={userRef}
                required
                sx={{ mt: 3 }}
              />

              <FormControl variant="outlined" sx={{ mt: 2 }}>
                <InputLabel htmlFor="outlined-adornment-password">
                  Password *
                </InputLabel>

                <OutlinedInput
                  id="outlined-adornment-password"
                  type={showPassword ? 'text' : 'password'}
                  inputRef={passRef}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                  label="Password"
                  required
                />
              </FormControl>

              <FormControlLabel
                control={
                  <Checkbox
                    checked={checked}
                    onChange={handleChange}
                    inputProps={{ 'aria-label': 'controlled' }}
                  />
                }
                label="Save session"
              />

              <Button type="submit" variant="contained" sx={{ mt: 2 }}>
                Log in
              </Button>
              <Button variant="outlined" sx={{ mt: 2, mb: 1 }}>
                Forgot password?
              </Button>

              <p>
                Don't have an account? <Link href="/">Sign up</Link>
              </p>
            </Box>
          </form>
        </Container>

        {error && <Error message={errorMessage} />}
      </ThemeProvider>
    </>
  );
};

export default Login;
