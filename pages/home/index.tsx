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
} from '@mui/material';
import { red } from '@mui/material/colors';
import { Favorite, Share, Comment } from '@mui/icons-material';

import Head from 'next/head';
import NextLink from 'next/link';

import { SearchBox } from '@/components/SearchBox/SearchBox';
import Nav from '@/components/Nav/Nav';

import { supabase } from '@/lib/supabaseClient';

import { useState, useRef, useEffect, forwardRef } from 'react';

const Home = ({ posts }: any) => {
  const [, setData] = useState(posts);
  const postContentRef = useRef<HTMLInputElement>(null);
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

  const renderUpdatedData = async () => {
    const { data } = await supabase
      .from('posts')
      .select('author, content, likes, rePost');

    setData(data);
  };

  const publish = async (event: any) => {
    event.preventDefault();

    const user = localStorage.getItem('username');

    const { error }: any = await supabase.from('posts').insert({
      author: user,
      content: postContentRef.current?.value,
      likes: 0,
      rePost: 0,
    });

    {
      error ? console.error(error) : renderUpdatedData();
    }
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

  const commentPost = () => {
    console.log('Comment post');
  };

  const rePost = () => {
    console.log('Re Post');
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
        <title>Home / Mitter</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="" />
      </Head>

      <ThemeProvider theme={theme}>
        <CssBaseline />

        <Nav />

        <Container maxWidth="md">
          <form onSubmit={publish}>
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
                label="What is happening?!"
                inputRef={postContentRef}
                sx={{ borderRadius: '4px 0 0 4px' }}
                required
                fullWidth
              />
              <Button
                type="submit"
                variant="contained"
                sx={{ borderRadius: '0 4px 4px 0' }}
              >
                Publish
              </Button>
            </Box>
          </form>

          <Box>
            <Typography variant="h6">Recent Posts</Typography>

            {posts.map((post: any, index: number) => (
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
                    <Favorite />{' '}
                    <small id={`like${post.id}`}>{post.likes}</small>
                  </IconButton>

                  <IconButton aria-label="comment" onClick={commentPost}>
                    <Comment sx={{ marginRight: '3px' }} />{' '}
                    <small>{post.comments.allComments.length}</small>
                  </IconButton>

                  <IconButton aria-label="share" onClick={rePost}>
                    <Share /> <small>{post.rePost}</small>
                  </IconButton>
                </CardActions>
              </Card>
            ))}
          </Box>
        </Container>
      </ThemeProvider>
    </>
  );
};

export const getServerSideProps = async () => {
  const { data } = await supabase.from('posts').select('*');

  return {
    props: {
      posts: data,
    },
  };
};

export default Home;
