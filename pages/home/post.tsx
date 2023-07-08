import { ThemeProvider } from '@emotion/react';
import {
  Box,
  Container,
  CssBaseline,
  Button,
  Typography,
  Card,
  CardHeader,
  CardContent,
  Avatar,
  IconButton,
  CardActions,
  createTheme,
} from '@mui/material';
import { red } from '@mui/material/colors';
import { Share, Favorite } from '@mui/icons-material';

import Head from 'next/head';
import NextLink from 'next/link';
import { useRouter } from 'next/router';

import { SearchBox } from '@/components/SearchBox/SearchBox';
import Nav from '@/components/Nav/Nav';

import { supabase } from '@/lib/supabaseClient';

import { useState, useRef, useEffect, forwardRef } from 'react';

const Post = ({ post }: any) => {
  const [comments, setComments] = useState(post[0].comments.allComments);
  const [posts, setPosts] = useState(post);
  const [checked, setChecked] = useState(false);

  const router = useRouter();
  const postId = Number(router.query.id);

  const publishCommentRef = useRef<HTMLInputElement>(null);

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

  const publishComment = async (event: any) => {
    event.preventDefault();
    const user = localStorage.getItem('username');
    const date = new Date();
    const dateFormat = {
      day: date.getDate(),
      month: date.getMonth() + 1,
      year: date.getFullYear(),
      hour: date.getHours(),
      minute: date.getMinutes(),
    };

    setComments([
      ...comments,
      {
        id: comments.length + 1,
        content: publishCommentRef.current?.value,
        created_at: `${dateFormat.year}-${dateFormat.month}-${dateFormat.day} ${dateFormat.hour}:${dateFormat.minute}`,
        author: user,
      },
    ]);

    const { data, error } = await supabase
      .from('posts')
      .update({
        comments: {
          allComments: [
            ...comments,
            {
              id: comments.length + 1,
              content: publishCommentRef.current?.value,
              created_at: `${dateFormat.year}-${dateFormat.month}-${dateFormat.day} ${dateFormat.hour}:${dateFormat.minute}`,
              author: user,
            },
          ],
        },
      })
      .eq('id', postId)
      .select();

    if (error) {
      console.log(error);
      return;
    }

    setPosts(data);
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
        <title>{posts[0].content} / Mitter</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="" />
      </Head>

      <ThemeProvider theme={theme}>
        <CssBaseline />

        <Nav />

        <Container maxWidth="md">
          <Card sx={{ mt: 1, mb: 1 }}>
            <CardHeader
              avatar={
                <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                  {posts[0].author.charAt(0).toUpperCase()}
                </Avatar>
              }
              title={posts[0].author}
              subheader={posts[0].created_at
                .split('.')[0]
                .replace('T', ' ')
                .substring(0, 16)}
            />

            <CardContent>
              <Typography variant="body2" color="text.secondary">
                {posts[0].content}
              </Typography>
            </CardContent>

            <CardActions disableSpacing>
              <IconButton
                aria-label="add to favorites"
                onClick={() => likePost(posts[0].likes, posts[0].id)}
              >
                <Favorite /> <small id={`like${posts[0].id}`}>{posts[0].likes}</small>
              </IconButton>

              <IconButton aria-label="share" onClick={rePost}>
                <Share /> <small>{posts[0].rePost}</small>
              </IconButton>
            </CardActions>
          </Card>

          <Typography variant="h5" sx={{ mb: 2, mt: 2 }} gutterBottom>
            Comments
          </Typography>

          <form onSubmit={publishComment}>
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
                label="Write your comment here"
                inputRef={publishCommentRef}
                sx={{ borderRadius: '4px 0 0 4px' }}
                required
                fullWidth
              />
              <Button
                type="submit"
                variant="contained"
                sx={{ borderRadius: '0 4px 4px 0' }}
              >
                Comment
              </Button>
            </Box>
          </form>

          {posts[0].comments.allComments.map((comment: any) => (
            <Card sx={{ mt: 1, mb: 1 }} key={comment.id}>
              <CardHeader
                avatar={
                  <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                    {comment.author.charAt(0).toUpperCase()}
                  </Avatar>
                }
                subheader={comment.created_at}
                title={comment.author}
              />

              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  {comment.content}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Container>
      </ThemeProvider>
    </>
  );
};

export async function getServerSideProps({ query }: any) {
  const { id } = query;
  const { data } = await supabase.from('posts').select('*').eq('id', id);

  return {
    props: {
      post: data,
    },
  };
}

export default Post;
