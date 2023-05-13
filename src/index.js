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

// ADD COMMENT AND BUMP , REMOVE COMMENT AND BUMP, FROM SHARES
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


// create post
app.post('/createpost', async (req, res) => {
  const { id } = req.body;
  const { text } = req.body;
  const { picture } = req.body;
  const post = await DbApi.createPost(id, text, picture);
  if (post === false) {
    res.send('failed');
  }
  else {
    res.json({ postid: post._id });
  }
});

// edit post
app.post('/editpost', async (req, res) => {
  const { postid } = req.body;
  const { txt } = req.body;
  const result = await DbApi.editPost(postid, txt);
  if (result === false) {
    res.send('false');
  }
  else {
    res.send('true');
  }
});

// add comment
app.post('/addcomment', async (req, res) => {
  const { post } = req.body;
  const { user } = req.body;
  const { text } = req.body;
  const result = await DbApi.addCommentToPost(post, user, text);
  if (result) {
    res.json({ commentid: result._id });
  }
  else {
    res.send('false');
  }
});


// delete comment
app.post('/removecomment', async (req, res) => {
  const { post } = req.body;
  const { user } = req.body;
  const { comment } = req.body;
  const result = await DbApi.removeCommentFromAPost(user, post, comment);
  if (result) {
    res.send('true');
  }
  else {
    res.send('false');
  }
});

// bump Post
app.post('/addbump', async (req, res) => {
  const { post } = req.body;
  const { user } = req.body;
  const result = await DbApi.addBumpToPost(post, user);
  if (result) {
    res.send('true');
  }
  else {
    res.send('false');
  }
});

// remove bump
app.post('/removebump', async (req, res) => {
  const { post } = req.body;
  const { user } = req.body;
  const result = await DbApi.removeBumpFromAPost(user, post);
  if (result) {
    res.send('true');
  }
  else {
    res.send('false');
  }
});

// save post
app.post('/savepost', async (req, res) => {
  const { post } = req.body;
  const { user } = req.body;
  const result = await DbApi.addSaveToPost(post, user);
  if (result) {
    res.send('true');
  }
  else {
    res.send('false');
  }
});


// remove save
app.post('/removesaved', async (req, res) => {
  const { post } = req.body;
  const { user } = req.body;
  const result = await DbApi.removeSavedPostFromAPost(user, post);
  if (result) {
    res.send('true');
  }
  else {
    res.send('false');
  }
});


// share post
app.post('/sharepost', async (req, res) => {
  const { post } = req.body;
  const { user } = req.body;
  const result = await DbApi.addShareToPost(post, user);
  if (result) {
    res.send('true');
  }
  else {
    res.send('false');
  }
});

// remove share
app.post('/removeshare', async (req, res) => {
  const { post } = req.body;
  const { user } = req.body;
  const { share } = req.body;
  const result = await DbApi.removeShareFromAPost(user, post, share);
  if (result) {
    res.send('true');
  }
  else {
    res.send('false');
  }
});

// remove post
app.post('/removepost', async (req, res) => {
  const { post } = req.body;
  const result = await DbApi.removePost(post);
  res.send('true');
});

// const routes = [];
// for (const layer of app._router.stack) {
//   if (layer.route) {
//     const path = layer.route.path;
//     const methods = Object.keys(layer.route.methods).join(', ');
//     routes.push({ path, methods });
//   }
// }
// console.log(routes);

app.listen(PORT, () => {
  console.log(`Server has started on port: ${PORT}`);
});
