import {
  ThemeProvider,
  Box,
  Container,
  CssBaseline,
  Typography,
  Card,
  CardHeader,
  CardActions,
  CardContent,
  Avatar,
  IconButton,
  createTheme,
} from '@mui/material';
import { red } from '@mui/material/colors';
import { Favorite, Comment } from '@mui/icons-material';

import Head from 'next/head';
import Link from 'next/link';
import NextLink from 'next/link';

import { useState, useEffect, forwardRef } from 'react';

import Nav from '@/components/Nav/Nav';
import { supabase } from '@/lib/supabaseClient';

import styles from '@/styles/profile.module.css';

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
      } as any,
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

        <div className={styles.toTop}>
          <img
            src="http://localhost:3000/img/profile_background.jpg"
            alt="Profile background"
            className={styles.profileBackground}
          />

          <Box className={styles.profileContainer}>
            <Typography variant="h4" component="h1" gutterBottom>
              {profile[0].author}
            </Typography>
            Followers: 0
          </Box>

          <Container maxWidth="md">
            <Typography variant="h5" sx={{ mt: 3, mb: 1 }}>Recent Posts</Typography>
            {profile.map((post: any) => (
              <Link
                href={{
                  pathname: '/home/post',
                  query: { id: post.id },
                }}
                key={post.id}
                id="no_colorlink"
              >
                <Card sx={{ mt: 1, mb: 1 }}>
                  <CardHeader
                    avatar={
                      <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                        {post.author.charAt(0).toUpperCase()}
                      </Avatar>
                    }
                    title={post.author}
                    subheader={post.created_at
                      .split('.')[0]
                      .replace('T', ' ')
                      .substring(0, 16)}
                  />

                  <CardContent>
                    <Typography variant="body2" color="text.secondary">
                      {post.content}
                    </Typography>
                  </CardContent>

                  <CardActions disableSpacing>
                    <IconButton aria-label="add to favorites">
                      <Favorite />{' '}
                      {post.likes.usersLike.map((like: any, index: number) => (
                        <>
                          {like.username === 'martin' ? (
                            <small
                              id={`like${post.id}`}
                              key={index}
                              className="incremented"
                            >
                              {post.likes.usersLike.length - 1}
                            </small>
                          ) : null}
                        </>
                      ))}
                    </IconButton>

                    <IconButton aria-label="comment">
                      <Comment sx={{ marginRight: '3px' }} />{' '}
                      <small>{post.comments.allComments.length}</small>
                    </IconButton>
                  </CardActions>
                </Card>
              </Link>
            ))}
          </Container>
        </div>
      </ThemeProvider>
    </>
  );
};

export async function getServerSideProps({ query }: any) {
  const { user } = query;
  const { data } = await supabase.from('posts').select('*').eq('author', user);
  console.log(data);
  return {
    props: {
      profile: data,
    },
  };
}

export default Profile;
