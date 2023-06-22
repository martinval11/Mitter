import {
  CssBaseline,
  ThemeProvider,
  Container,
  Typography,
  Checkbox,
  FormControlLabel,
  createTheme,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
} from '@mui/material';

import { forwardRef } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import Head from 'next/head';

import { supabase } from 'lib/supabaseClient';
import Nav from '@/components/Nav/Nav';

import { useState, useEffect, useRef } from 'react';

const Settings = () => {
  const [checked, setChecked] = useState(false);
  const [openDelAccountModal, setOpenDelAccountModal] = useState(false);
  const passwordDelAccountRef = useRef<HTMLInputElement>(null);

  const router = useRouter();

  const openDelAccountDialog = () => {
    setOpenDelAccountModal(true);
  };

  const closeDelAccountDialog = () => {
    setOpenDelAccountModal(false);
  };

  const deleteAccount = async (event: any) => {
    event.preventDefault();
    const getUser = localStorage.getItem('username');

    const { data: users, error } = await supabase
      .from('users')
      .select('id, name, password')

    if (error) {
      alert('Error deleting account');
      return;
    }
    
    const searchUser = users!.find(
      (user: any) =>
        user.name === getUser &&
        user.password === passwordDelAccountRef.current?.value
    );

    if (searchUser) {
      const { error: deleteUser } = await supabase
        .from('users')
        .delete()
        .eq('id', searchUser.id);
    
      if (deleteUser) {
        localStorage.removeItem('username');
        localStorage.removeItem('saveSession');
        localStorage.removeItem('saveSession');
        router.push('/');
      } else {
        alert('Error deleting account');
      }
    } else {
      alert('Error searching your user');
    }
  };

  let instantChecked = false; // This is for prevent useState delay, fuck useState >.<

  const LinkBehaviour = forwardRef(function LinkBehaviour(
    props: any,
    ref: any
  ) {
    return <NextLink ref={ref} {...props} />;
  });

  const theme = createTheme({
    components: {
      MuiLink: {
        defaultProps: {
          component: LinkBehaviour,
        },
      },
      MuiButtonBase: {
        defaultProps: {
          LinkComponent: LinkBehaviour,
        },
      },
    },
    palette: {
      mode: checked ? 'dark' : 'light',
    },
  });

  const handleCheckDarkMode = () => {
    instantChecked = !checked;
    console.log(instantChecked);
    setChecked(!checked);
    localStorage.setItem('darkMode', instantChecked.toString());
  };

  useEffect(() => {
    const darkMode = localStorage.getItem('darkMode');
    if (darkMode === 'true') {
      setChecked(true);
    }
  }, []);

  return (
    <>
      <Head>
        <title>Settings / Mitter</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="" />
      </Head>

      <ThemeProvider theme={theme}>
        <CssBaseline />

        <Nav />

        <Container maxWidth="md">
          <Typography variant="h4">Settings</Typography>

          <FormControlLabel
            control={
              <Checkbox checked={checked} onChange={handleCheckDarkMode} />
            }
            label="Dark mode"
          />

          <Typography variant="h5" sx={{ color: '#F44336', my: 1.5 }}>
            Danger Zone
          </Typography>

          <Button variant="outlined" onClick={openDelAccountDialog}>
            Delete Account
          </Button>
          <Dialog open={openDelAccountModal} onClose={closeDelAccountDialog}>
            <DialogTitle>Delete your account</DialogTitle>
            <form onSubmit={deleteAccount}>
              <DialogContent>
                <TextField
                  autoFocus
                  margin="dense"
                  label="Password"
                  type="password"
                  inputRef={passwordDelAccountRef}
                  fullWidth
                  variant="standard"
                  required
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={closeDelAccountDialog}>Cancel</Button>
                <Button type="submit">Delete account</Button>
              </DialogActions>
            </form>
          </Dialog>
        </Container>
      </ThemeProvider>
    </>
  );
};

export default Settings;
