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
  LinearProgress,
} from '@mui/material';
import { red } from '@mui/material/colors';
import { Favorite, Comment } from '@mui/icons-material';

import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';

import { useState, useRef, useEffect, FormEvent, RefObject } from 'react';

import Nav from '@/components/Nav/Nav';
import Theme from '@/components/Theme/Theme';
import { SearchBox } from '@/components/SearchBox/SearchBox';

import updateToDB from '@/lib/dbTools/updateToDB';
import getDBData from '@/lib/dbTools/getDBData';

const Explore = () => {
  const [posts, setPosts]: any = useState([]);
  const [searching, setSearching]: any = useState(false);
  const [resultsNotFound, setResultsNotFound]: any = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const searchPostRef = useRef<HTMLInputElement>(null);

  const searchPost = async (event: FormEvent) => {
    event.preventDefault();

    setPosts([]);
    setSearching(true);

    const data = await getDBData(
      'posts',
      'content',
      searchPostRef.current?.value
    );

    if (data?.length === 0) {
      setResultsNotFound(true);
      setSearching(false);
      return;
    }

    setPosts(data);
    setSearching(false);
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
    const darkMode = Boolean(localStorage.getItem('darkMode'));

    {
      darkMode ? setDarkMode(true) : null;
    }
  }, []);

  return (
    <>
      <Head>
        <title>Explore / Mitter</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="" />
      </Head>

      <Theme color={darkMode}>
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

          {posts.map((post: any, index: number) => (
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
        </Container>
      </Theme>
    </>
  );
};

export default Explore;
