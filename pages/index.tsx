import {
  Typography,
  CssBaseline,
  Container,
  Box,
  Card,
  Link,
  Button,
  Grid,
} from '@mui/material';

import Head from 'next/head';
import { useState, useEffect } from 'react';

import Theme from '@/components/Theme/Theme';
import Nav from '@/components/LandingNav/Nav';
import { Code, DynamicForm, VpnKey } from '@mui/icons-material';
import Image from 'next/image';

const Index = () => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const darkMode = localStorage.getItem('darkMode');

    if (darkMode === 'true') {
      setDarkMode(true)
      return
    }
    setDarkMode(false)
  }, []);

  return (
    <>
      <Head>
        <title>Mitter</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <Theme color={darkMode}>
        <CssBaseline />
        <Nav />

        <Container maxWidth="md">
          <Typography
            variant="h1"
            sx={{ fontSize: '3.75rem', mt: 4, mb: 5, textAlign: 'center' }}
          >
            A Social Media without tracking
          </Typography>

          <Grid
            container
            spacing={{ xs: 2, md: 3 }}
            columns={{ xs: 4, sm: 8, md: 12 }}
          >
            <Grid item xs={2} sm={4} md={4}>
              <Card
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  p: 2,
                }}
              >
                <Code sx={{ fontSize: 50, color: '#56F989' }} />
                <Typography variant="h5">Open Source</Typography>
                <Box sx={{ textAlign: 'center', textWrap: 'balance' }}>
                  <p>
                    You can find the source code{' '}
                    <Link
                      href="https://github.com/martinval11/Mitter"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      here
                    </Link>
                  </p>
                </Box>
              </Card>
            </Grid>
            <Grid item xs={2} sm={4} md={4}>
              <Card
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  p: 2,
                }}
              >
                <VpnKey sx={{ fontSize: 50, color: '#F9D556' }} />
                <Typography variant="h5">Private</Typography>
                <Box sx={{ textAlign: 'center', textWrap: 'balance' }}>
                  <p>Data is encrypted in our servers.</p>
                </Box>
              </Card>
            </Grid>

            <Grid item xs={2} sm={4} md={4}>
              <Card
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  p: 2,
                }}
              >
                <DynamicForm sx={{ fontSize: 50, color: '#F95658' }} />
                <Typography variant="h5">Self regulated</Typography>
                <Box sx={{ textAlign: 'center', textWrap: 'balance' }}>
                  <p>Each community has its own rules.</p>
                </Box>
              </Card>
            </Grid>
          </Grid>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }} id="flexColumn">
            <Image src="/img/safe.svg" alt="Safe SVG Image" width={350} height={350} />
            <div>
              <Typography variant="h5">Your information is <b>yours</b></Typography>
              <p>We do <b>not</b> collect any personal information.</p>
            </div>
          </Box>

          <Box sx={{ textAlign: 'center', mb: 5 }}>
            <Typography variant="h3" sx={{ mt: 6, mb: 4, fontWeight: 300 }}>
              Ready to get started?
            </Typography>

            <Button variant="contained" href="/signup">
              Create your first account
            </Button>
          </Box>
        </Container>
      </Theme>
    </>
  );
};

export default Index;
