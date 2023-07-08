import Head from 'next/head';
import NextLink from 'next/link';
import {
  ThemeProvider,
  CssBaseline,
  Container,
  createTheme,
  Typography,
} from '@mui/material';

import { useState, useEffect, forwardRef } from 'react';

import Nav from '@/components/Nav/Nav';
import { supabase } from '@/lib/supabaseClient';

const Profile = ({ profile }: any) => {
  const [checked, setChecked] = useState(false);

  const LinkBehaviour: any = forwardRef(function LinkBehaviour(
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

  useEffect(() => {
    const darkMode = localStorage.getItem('darkMode');

    if (darkMode === 'true') {
      setChecked(true);
    }
  }, []);

  return (
    <>
      <Head>
        <title>Profile / Mitter</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="" />
      </Head>

      <ThemeProvider theme={theme}>
        <CssBaseline />

        <Nav />

        <Container maxWidth="md">

            <Typography variant="h4" component="h1" gutterBottom>
              {profile}
            </Typography>

        </Container>
      </ThemeProvider>
    </>
  );
};

export async function getServerSideProps({ query }: any) {
  const { user } = query;
  const { data } = await supabase.from('users').select('*').eq('name', user);
  console.log(data);

  return {
    props: {
      profile: user,
    },
  };
}

export default Profile;
