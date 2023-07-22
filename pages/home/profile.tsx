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
  Button,
} from '@mui/material';
import { red } from '@mui/material/colors';
import { Favorite, Comment } from '@mui/icons-material';

import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';

import { useState, useEffect } from 'react';

import Nav from '@/components/Nav/Nav';
import Theme from '@/components/Theme/Theme';

import { supabase } from '@/lib/supabaseClient';
import updateToDB from '@/lib/dbTools/updateToDB';

import styles from '@/styles/profile.module.css';
import { useRouter } from 'next/router';

const Profile = ({ userData, postsData }: any) => {
  const [darkMode, setDarkMode] = useState(false);
  const [username, setUsername]: any = useState('');
  const [follow, setFollow] = useState('Follow');
  const router = useRouter();

  const likePost = async (likes: number, postId: number) => {
    const likeValue: any = document.querySelector(`.like${postId}`);
    const heart: any = document.querySelector(`.heart${postId}`);

    if (likeValue.className === `like${postId} incremented`) {
      await updateToDB('posts', { likes: likes - 1 }, postId, null);

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

  const followUser = async () => {
    console.log(userData[0].followers, userData[0].id, userData)
    if (follow === 'Following') {
      updateToDB('users', { followers: userData[0].followers + 1 - 1 }, userData[0].id, null);
      setFollow('Follow');
      return
    }
    updateToDB('users', { followers: userData[0].followers + 1 }, userData[0].id, null);
    setFollow('Following');
  }

  useEffect(() => {
    setUsername(localStorage.getItem('username'))
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
        <title>Profile / Mitter</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="" />
      </Head>

      <Theme color={darkMode}>
        <CssBaseline />

        <Nav />

        <div className={styles.toTop}>
          <img
            src="/img/profile_background.jpg"
            alt="Profile background"
            className={styles.profileBackground}
          />

          <Box className={styles.profileContainer}>
            <Container
              maxWidth="md"
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <Typography variant="h4" component="h1" gutterBottom>
                  {userData[0].name}
                </Typography>
                Followers: {userData[0].followers}
              </div>
              {userData[0].name !== username ? (
                <div>
                  <Button variant="contained" onClick={followUser}>{follow}</Button>
                </div>
              ) : null}
            </Container>
          </Box>

          <Container maxWidth="md">
            <Typography variant="h5" sx={{ mt: 3, mb: 1 }}>
              Recent Posts
            </Typography>

            {postsData?.map((post: any) => (
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
                        {post.author?.charAt(0).toUpperCase()}
                      </Avatar>
                    }
                    title={post.author}
                    subheader={post?.created_at
                      ?.split('.')
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
                      <small>{post.comments?.allComments.length}</small>
                    </IconButton>
                  </Link>
                </CardActions>
              </Card>
            ))}

            {postsData.length === 0 ? (
              <Box
                sx={{ display: 'flex', alignItems: 'center', p: '5px 0 25px' }}
              >
                <Image
                  src="http://localhost:3000/img/search.svg"
                  alt="No recent posts image"
                  width={225}
                  height={225}
                />
                <Typography variant="h4">No post found</Typography>
              </Box>
            ) : null}
          </Container>
        </div>
      </Theme>
    </>
  );
};

export async function getServerSideProps({ query }: any) {
  const { user } = query;
  const postsData = await supabase.from('posts').select('*').eq('author', user);
  const userData = await supabase
    .from('users')
    .select('id, name, followers')
    .eq('name', user);

  return {
    props: {
      userData: userData.data,
      postsData: postsData.data,
    },
  };
}

export default Profile;
