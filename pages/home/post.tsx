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
} from '@mui/material';
import { red } from '@mui/material/colors';
import { Comment, Favorite } from '@mui/icons-material';

import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState, useRef, useEffect } from 'react';

import { SearchBox } from '@/components/SearchBox/SearchBox';
import Nav from '@/components/Nav/Nav';
import Theme from '@/components/Theme/Theme';

import { supabase } from '@/lib/supabaseClient';
import updateToDB from '@/lib/dbTools/updateToDB';

const Post = ({ post }: any) => {
  const [comments, setComments] = useState(post.comments.allComments);
  const [darkMode, setDarkMode] = useState(false);

  const router = useRouter();
  const postId = Number(router.query.id);

  const publishCommentRef = useRef<HTMLInputElement>(null);

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

    updateToDB(
      'posts',
      {
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
      },
      postId,
      null
    );

    publishCommentRef.current!.value = '';
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

    if (darkMode === 'true') {
      setDarkMode(true);
      return;
    }
    setDarkMode(false);

    if (session === 'false' || !session) {
      router.push('/');
      return;
    }
  }, []);

  return (
    <>
      <Head>
        <title>{post.content} / Mitter</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="" />
      </Head>

      <Theme color={darkMode}>
        <CssBaseline />
        <Nav />

        <Container maxWidth="md">
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
              <IconButton
                aria-label="add to favorites"
                onClick={() => likePost(post.likes, post.id)}
              >
                <Favorite className={`heart${post.id}`} />
                <small className={`like${post.id}`}>{post.likes}</small>
              </IconButton>

              <IconButton aria-label="comment">
                <Comment sx={{ marginRight: '3px' }} />
                <small>{post.comments.allComments.length}</small>
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

          {comments.map((comment: any) => (
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
      </Theme>
    </>
  );
};

export async function getServerSideProps({ query }: any) {
  const { id } = query;
  const { data }: any = await supabase.from('posts').select('*').eq('id', id);

  return {
    props: {
      post: data[0],
    },
  };
}

export default Post;
