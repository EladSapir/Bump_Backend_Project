/* eslint-disable no-plusplus */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-await-in-loop */
/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
/* eslint-disable no-multiple-empty-lines */
/* eslint-disable no-unused-vars */
/* eslint-disable import/no-extraneous-dependencies   */
/* eslint-disable brace-style */
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import DbApi from '../api/DbApi.js';


const PORT = process.env.PORT || 5000;
const app = express();
const dbURI = 'mongodb+srv://bumpAdmin:bumpSCE12345@bumpdb.gr2nk3i.mongodb.net/BumpDB?retryWrites=true&w=majority';
mongoose.connect(dbURI)
  .then((result) => {
    console.log('Connected to the DataBase successfully');
  })
  .catch((err) => console.log(err));


app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  console.log('Got a request');
  res.send(JSON.stringify('<h3>Hi From Backend API</h3>'));
  return res;
});

// checks!!
app.get('/test/:id', async (req, res) => {
  const followers = await DbApi.whoFollowsTheID(req.params.id);
  res.json(followers);
});

// // register
app.post('/register', async (req, res) => {
  const { email } = req.body;
  const { gamertag } = req.body;
  const { password } = req.body;
  const { gender } = req.body;
  const { dob } = req.body;
  const { g1 } = req.body;
  const { g2 } = req.body;
  const { g3 } = req.body;
  const { g4 } = req.body;
  const { g5 } = req.body;
  const { discord } = req.body;
  const { country } = req.body;
  const { language } = req.body;
  const { picture } = req.body;
  // eslint-disable-next-line max-len
  const id = await DbApi.signUp(email, gamertag, password, gender, dob, g1, g2, g3, g4, g5, discord, country, language, picture);
  if (id === 1) {
    res.send('email already exists');
  }
  else if (id === 2) {
    res.send('gamerTag exists');
  }
  else {
    res.json({ id });
  }
});

// // login
app.post('/login', async (req, res) => {
  const { email } = req.body;
  const { password } = req.body;
  const id = await DbApi.signIn(email, password);
  if (id === 1) {
    res.send('email/password not right');
  }
  else if (id === 2) {
    res.send('already logged in');
  }
  else {
    res.json({ id });
  }
});


// get homepage of a user
app.get('/homepage/:id', async (req, res) => {
  const { id } = req.params;

  let posts = [];

  const following = await DbApi.whoIDFollows(id);

  for (let i = 0; i < following.length; i++) {
    posts = posts.concat(await DbApi.getThePostsAUserShared(following[i]._id));
    posts = posts.concat(await DbApi.getThePostsOfAUser(following[i]._id));
  }
  posts = posts.concat(await DbApi.getThePostsOfAUser(id));
  posts = posts.concat(await DbApi.getThePostsAUserShared(id));

  posts.sort((a, b) => b.date - a.date);

  res.json(posts);
});


// get the posts of a user
app.get('/myposts/:id', (req, res) => {
  const { id } = req.params;
  DbApi.getMyPosts(id).then((result) => {
    res.json(result);
  });
});

// logout
app.get('/logout/:id', (req, res) => {
  const { id } = req.params;
  DbApi.logOut(id).then((result) => {
    res.json(result);
  });
});




// // get profile of a user
// app.get('/users/:id/profile', (req, res) => {
// });

// // get matching search page by user
// app.get('/users/:id/matching', (req, res) => {
// });




// // get all users the user is following
// app.get('/users/:id/following', (req, res) => {
// });

// // get all users that are following the user
// app.get('/users/:id/followers', (req, res) => {
// });

// // get all users by game
// app.get('/users/:game', (req, res) => {
// });

// // get user by id
// app.get('/users/:id', (req, res) => {
// });

// // update user by id
// app.put('/users/:id', (req, res) => {
// });

// // delete user by id
// app.delete('/users/:id', (req, res) => {
// });

// // get user by gamer tag
// app.get('/users/:gamerTag', (req, res) => {
// });

// // get all posts by user
// app.get('/users/:id/posts', (req, res) => {
// });

// // get amount of all comments by user
// app.get('/users/:id/comments', (req, res) => {
// });

// // get all posts liked by user
// app.get('/posts/:id/liked', (req, res) => {
// });

// // get all posts saved by user
// app.get('/posts/:id/saved', (req, res) => {
// });

// // get all posts shared by user
// app.get('/posts/:id/shared', (req, res) => {
// });




// // create post
// app.post('/posts', (req, res) => {
// });

// // update post by id
// app.put('/posts/:id', (req, res) => {
// });

// // delete post by id
// app.delete('/posts/:id', (req, res) => {
// });




// // get all comments by post id
// app.get('/comments/:id', (req, res) => {
// });

// // get comment by id
// app.get('/comments/:id', (req, res) => {
// });

// // create comment
// app.post('/comments', (req, res) => {
// });

// // delete comment by id
// app.delete('/comments/:id', (req, res) => {
// });




// // get all bumps of a post by id
// app.get('/bumps/:id', (req, res) => {
// });

// // create bump
// app.post('/bump', (req, res) => {
// });

// // delete bump by id
// app.delete('/bump/:id', (req, res) => {
// });








app.listen(PORT, () => {
  console.log(`Server has started on port: ${PORT}`);
});
