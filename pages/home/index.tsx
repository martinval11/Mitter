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
} from '@mui/material';
import { red } from '@mui/material/colors';
import { Favorite, Comment } from '@mui/icons-material';

import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState, useRef, useEffect, FormEvent } from 'react';

import { SearchBox } from '@/components/SearchBox/SearchBox';
import Nav from '@/components/Nav/Nav';
import Theme from '@/components/Theme/Theme';

import { supabase } from '@/lib/supabaseClient';

import insertToDB from '@/lib/dbTools/insertToDB';
import updateToDB from '@/lib/dbTools/updateToDB';

const Home = ({ posts }: any) => {
  const [data, setData] = useState(posts);
  const [darkMode, setDarkMode] = useState(false);
  const postContentRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const renderUpdatedData = async () => {
    const { data } = await supabase.from('posts').select('*');
    setData(data);
  };

  const publish = async (event: FormEvent) => {
    event.preventDefault();
    const user = localStorage.getItem('username');

    insertToDB(
      'posts',
      {
        author: user,
        content: postContentRef.current?.value,
        likes: 0,
        comments: { allComments: [] },
      },
      renderUpdatedData()
    );
  };

  const likePost = async (likes: number, postId: number) => {
    const likeValue: any = document.querySelector(`.like${postId}`);
    const heart: any = document.querySelector(`.heart${postId}`);

    if (likeValue.className === `like${postId} incremented`) {
      updateToDB('posts', { likes: likes - 1 }, postId, null);

      likeValue.innerHTML = likes;
      likeValue.classList.remove('incremented');
      heart.classList.remove('incremented');
      return;
    }

    updateToDB('posts', { likes: likes + 1 }, postId, null);

    likeValue!.innerHTML = likes + 1;
    likeValue.classList.add('incremented');
    heart.classList.add('incremented');
  };

  useEffect(() => {
    const session = localStorage.getItem('saveSession');
    const darkMode = localStorage.getItem('darkMode');
    const prefersDarkColorScheme = () =>
      window &&
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (darkMode === 'true' || prefersDarkColorScheme()) {
      setDarkMode(true);
    } else {
      setDarkMode(false);
    }

    if (session === 'false' || !session) {
      router.push('/');
      return;
    }
  }, []);

  return (
    <>
      <Head>
        <title>Home / Mitter</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="" />
      </Head>

      <Theme color={darkMode}>
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

          <Typography variant="h6">Recent Posts</Typography>

          {data?.map((post: any) => (
            <Card sx={{ mt: 1, mb: 1 }} key={post.id}>
              <Link
                href={{
                  pathname: '/home/post',
                  query: { id: post.id },
                }}
                id="no_colorlink"
              >
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

                <CardContent sx={{ pb: '8px !important' }}>
                  <Typography variant="body2" color="text.secondary">
                    {post.content}
                  </Typography>
                </CardContent>
              </Link>

              <CardActions disableSpacing>
                <IconButton
                  aria-label="add to favorites"
                  onClick={() => likePost(post.likes, post.id)}
                >
                  <Favorite className={`heart${post.id}`} />
                  <small className={`like${post.id}`}>{post.likes}</small>
                </IconButton>

                <Link
                  href={{
                    pathname: '/home/post',
                    query: { id: post.id },
                  }}
                  key={post.id}
                  id="no_colorlink"
                >
                  <IconButton aria-label="comment">
                    <Comment sx={{ marginRight: '3px' }} />
                    <small>{post.comments.allComments.length}</small>
                  </IconButton>
                </Link>
              </CardActions>
            </Card>
          ))}
        </Container>
      </Theme>
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
