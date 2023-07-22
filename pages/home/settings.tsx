import {
  CssBaseline,
  Container,
  Typography,
  Checkbox,
  FormControlLabel,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
} from '@mui/material';

import Head from 'next/head';
import { useRouter } from 'next/router';

import { supabase } from '@/lib/supabaseClient';
import { decrypt } from '@/lib/security/decrypt';

import { useState, useEffect, useRef, FormEvent } from 'react';

import Nav from '@/components/Nav/Nav';
import Theme from '@/components/Theme/Theme';

const Settings = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [openDelAccModal, setOpenDelAccModal] = useState(false);
  const passwordDelAccountRef = useRef<HTMLInputElement>(null);

  const router = useRouter();

  const openDelAccDialog = () => {
    setOpenDelAccModal(!openDelAccModal);
  };

  const deleteAccount = async (event: FormEvent) => {
    event.preventDefault();

    const getUser = localStorage.getItem('username');

    const { data: users, error } = await supabase
      .from('users')
      .select('id, name, password');

    if (error) {
      alert('Error deleting account');
      return;
    }

    const searchUser = users!.find(
      (user: any) =>
        user.name === getUser &&
        decrypt(user.password) === passwordDelAccountRef.current?.value
    );

    if (searchUser) {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', searchUser.id);

      if (error) {
        console.error(error);
        return;
      }

      localStorage.removeItem('username');
      localStorage.removeItem('saveSession');
      localStorage.removeItem('saveSession');

      router.push('/');
      return;
    }

    alert('Error searching your user');
  };

  let instantChecked = false;

  const handleCheckDarkMode = () => {
    instantChecked = !darkMode;
    setDarkMode(!darkMode);
    localStorage.setItem('darkMode', instantChecked.toString());
  };

  useEffect(() => {
    const darkMode = Boolean(localStorage.getItem('darkMode'));

    {
      darkMode ? setDarkMode(true) : null;
    }
  }, []);

  return (
    <>
      <Head>
        <title>Settings / Mitter</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="" />
      </Head>

      <Theme color={darkMode}>
        <CssBaseline />

        <Nav />

        <Container maxWidth="md">
          <Typography variant="h4">Settings</Typography>

          <FormControlLabel
            control={
              <Checkbox checked={darkMode} onChange={handleCheckDarkMode} />
            }
            label="Dark mode"
          />

          <Typography variant="h5" sx={{ color: '#F44336', my: 1.5 }}>
            Danger Zone
          </Typography>

          <Button variant="outlined" onClick={openDelAccDialog}>
            Delete Account
          </Button>

          <Dialog open={openDelAccModal} onClose={openDelAccDialog}>
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
                <Button onClick={openDelAccDialog}>Cancel</Button>
                <Button type="submit">Delete account</Button>
              </DialogActions>
            </form>
          </Dialog>
        </Container>
      </Theme>
    </>
  );
};

export default Settings;
