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
import { MoreVert, Favorite, Share } from '@mui/icons-material';

import { supabase } from 'lib/supabaseClient';
import { SearchBox } from '@/components/SearchBox/SearchBox';

import Head from 'next/head';
import NextLink from 'next/link';

import Nav from '@/components/Nav/Nav';
import { useState, useRef, useEffect, forwardRef } from 'react';

const Home = ({ posts }: any) => {
  const [data, setData] = useState(posts);
  const postContentRef = useRef<HTMLInputElement>(null);
  const [checked, setChecked] = useState(false);

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

  useEffect(() => {
    const darkMode = localStorage.getItem('darkMode');
    if (darkMode === 'true') {
      setChecked(true);
    }
  }, []);

  const renderUpdatedData = async () => {
    const { data } = await supabase
      .from('posts')
      .select('author, content, likes, rePost, postNumber');

    setData(data);
  }

  const publish = async (event: any) => {
    event.preventDefault();
    const user = localStorage.getItem('username');

    const { error }: any = await supabase.from('posts').insert({
      author: user,
      content: postContentRef.current?.value,
      likes: 0,
      rePost: 0,
      postNumber: data.length + 1,
    });

    if (error) {
      console.log(error);
    } else {
      renderUpdatedData();
    }
  };

  const likePost = async (likes: number, postId: number) => {
    const likeValue: any = document.getElementById(`like${postId}`); // TODO: this is insane, please change this...

    if (likeValue.className === 'incremented') {
      const { error }: any = await supabase
        .from('posts')
        .update({ likes: likes - 1 })
        .eq('id', postId);

      if (error) {
        console.log(error);
      }

      likeValue!.innerHTML = likes;
      likeValue.classList.remove('incremented');
    } else {
      const { error }: any = await supabase
        .from('posts')
        .update({ likes: likes + 1 })
        .eq('id', postId);

      if (error) {
        console.log(error);
      }

      likeValue!.innerHTML = likes + 1;
      likeValue.classList.add('incremented');
    }
  };

  const rePost = () => {
    console.log('Re Post');
  };

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
                      R
                    </Avatar>
                  }
                  action={
                    <IconButton aria-label="settings">
                      <MoreVert />
                    </IconButton>
                  }
                  title={post.author}
                  subheader={post.created_at}
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
  const { data } = await supabase
    .from('posts')
    .select('id, author, content, likes, rePost');

  return {
    props: {
      posts: data,
    },
  };
};

export default Home;
