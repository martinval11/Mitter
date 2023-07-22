import {
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
} from '@mui/material';
import { red } from '@mui/material/colors';
import { Favorite, Comment } from '@mui/icons-material';

import Head from 'next/head';
import Link from 'next/link';

import { useState, useEffect } from 'react';

import Nav from '@/components/Nav/Nav';
import Theme from '@/components/Theme/Theme';

import { supabase } from '@/lib/supabaseClient';
import updateToDB from '@/lib/dbTools/updateToDB';

import styles from '@/styles/profile.module.css';

const Profile = ({ profile }: any) => {
  const [darkMode, setDarkMode] = useState(false);

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
        <title>Profile / Mitter</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="" />
      </Head>

      <Theme color={darkMode}>
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
        </div>
      </Theme>
    </>
  );
};

export async function getServerSideProps({ query }: any) {
  const { user } = query;
  const { data } = await supabase.from('posts').select('*').eq('author', user);

  return {
    props: {
      profile: data,
    },
  };
}

export default Profile;
