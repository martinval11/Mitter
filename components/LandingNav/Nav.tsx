import {
  Button,
  Container,
  Typography,
  Toolbar,
  Box,
  AppBar,
} from '@mui/material';

import AdbIcon from '@mui/icons-material/Adb';

const Nav = () => {
  return (
    <AppBar
      position="static"
      sx={{
        mb: 4,
        background: 'transparent',
        color: 'inherit',
        boxShadow: 'none',
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <AdbIcon sx={{ display: 'flex', mr: 1 }} />
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="/home"
            sx={{
              mr: 2,
              display: 'flex',
              flexGrow: 1,
              fontFamily: 'Roboto',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            Mitter
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}></Box>

          <Box sx={{ flexGrow: 0 }}>
            <Button sx={{ mr: 1 }} href="/login">
              Login
            </Button>
            <Button variant="contained" href="/signup">
              Sign Up
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Nav;
