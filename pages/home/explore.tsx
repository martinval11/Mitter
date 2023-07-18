import { ThemeProvider } from '@emotion/react';
import {
  Box,
  Container,
  CssBaseline,
  Button,
  Typography,
  Card,
  CardHeader,
  CardActions,
  CardContent,
  Avatar,
  IconButton,
  createTheme,
  LinearProgress,
} from '@mui/material';
import { red } from '@mui/material/colors';
import { Favorite, Comment } from '@mui/icons-material';

import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import NextLink from 'next/link';

import { useState, forwardRef, useRef, useEffect } from 'react';

import { supabase } from '@/lib/supabaseClient';

import Nav from '@/components/Nav/Nav';
import { SearchBox } from '@/components/SearchBox/SearchBox';

const Explore = () => {
  const [posts, setPosts]: any = useState([]);
  const [searching, setSearching]: any = useState(false);
  const [resultsNotFound, setResultsNotFound]: any = useState(false);

  const [checked, setChecked] = useState(false);

  const searchPostRef: any = useRef<HTMLInputElement>(null);

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

  const searchPost = async (event: any) => {
    event.preventDefault();

    setPosts([]);
    setSearching(true);

    const { data } = await supabase
      .from('posts')
      .select('*')
      .eq('content', searchPostRef.current.value);

    if (data?.length === 0) {
      setResultsNotFound(true);
      setSearching(false);
      return;
    }

    setPosts(data);
    setSearching(false);
  };

  const likePost = async (likes: number, postId: number) => {
    const likeValue: any = document.getElementById(`like${postId}`);

    if (likeValue.className === 'incremented') {
      const { error } = await supabase
        .from('posts')
        .update({ likes: likes - 1 })
        .eq('id', postId);

      {
        error ? console.error(error) : null;
      }

      likeValue!.innerHTML = likes;
      likeValue.classList.remove('incremented');
      return;
    }

    const { error } = await supabase
      .from('posts')
      .update({ likes: likes + 1 })
      .eq('id', postId);

    {
      error ? console.error(error) : null;
    }

    likeValue!.innerHTML = likes + 1;
    likeValue.classList.add('incremented');
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
        <title>Explore / Mitter</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="" />
      </Head>

      <ThemeProvider theme={theme}>
        <CssBaseline />

        <Nav />

        <Container maxWidth="md">
          <form onSubmit={searchPost}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                mb: 2,
              }}
            >
              <SearchBox
                variant="outlined"
                label="Search content here"
                inputRef={searchPostRef}
                sx={{ borderRadius: '4px 0 0 4px' }}
                required
                fullWidth
              />
              <Button
                type="submit"
                variant="contained"
                sx={{ borderRadius: '0 4px 4px 0' }}
              >
                Search
              </Button>
            </Box>
          </form>

          <Box>
            {posts.map((post: any, index: number) => (
              <Link
                href={{
                  pathname: '/home/post',
                  query: { id: post.id },
                }}
                key={post.id}
                id="no_colorlink"
              >
                <Card key={index} sx={{ mt: 1, mb: 1 }}>
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
                    <IconButton
                      aria-label="add to favorites"
                      onClick={() => likePost(post.likes, post.id)}
                    >
                      <Favorite sx={{ marginRight: '3px' }} />{' '}
                      <small id={`like${post.id}`}>{post.likes.usersLike.length}</small>
                    </IconButton>

                    <IconButton aria-label="comment">
                      <Comment sx={{ marginRight: '3px' }} />{' '}
                      <small>{post.comments.allComments.length}</small>
                    </IconButton>
                  </CardActions>
                </Card>
              </Link>
            ))}

            {searching ? <LinearProgress /> : null}
            {resultsNotFound ? (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <Image
                  src="http://localhost:3000/img/404-error.png"
                  alt="Error 404 image"
                  width={250}
                  height={250}
                />
                <Typography variant="h4" mt={-5}>
                  No post found
                </Typography>
              </Box>
            ) : null}
          </Box>
        </Container>
      </ThemeProvider>
    </>
  );
};

export default Explore;
