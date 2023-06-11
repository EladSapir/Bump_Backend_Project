/* eslint-disable max-len */
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
  try {
    const { id } = req.params;
    const [following, details] = await Promise.all([
      DbApi.whoIDFollows(id),
      DbApi.getUserDetails(id),
    ]);

    const postsPromises = following.map(async (follow) => {
      const [sharedPosts, userPosts] = await Promise.all([
        DbApi.getThePostsAUserShared(follow._id),
        DbApi.getThePostsOfAUser(follow._id),
      ]);
      return [...sharedPosts, ...userPosts];
    });

    const userPostsPromises = [
      DbApi.getThePostsOfAUser(id),
      DbApi.getThePostsAUserShared(id),
    ];

    const [userPosts, ...otherPosts] = await Promise.all([
      ...userPostsPromises.map((promise) => promise.catch(() => [])),
      ...postsPromises,
    ]);

    const posts = [].concat(...otherPosts, ...userPosts);
    posts.sort((a, b) => b.date - a.date);

    const postDetailsPromises = posts.map(async (post) => {
      const [hasUserBumped, hasUserSaved] = await Promise.all([
        DbApi.checkIfUserBumpedPost(id, post._id),
        DbApi.checkIfUserSavedPost(id, post._id),
      ]);

      return {
        ...post,
        hasUserBumped,
        hasUserSaved,
      };
    });

    const postsWithDetails = await Promise.all(postDetailsPromises);

    res.json({
      posts: postsWithDetails,
      gamertag: details.GamerTag,
      picture: details.Picture,
    });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred' });
  }
});



// get the posts of a user
app.get('/myposts/:id', (req, res) => {
  const { id } = req.params;
  DbApi.getMyPosts(id).then((result) => {
    res.json(result);
  });
});

// logout
app.get('/logout/:id', async (req, res) => {
  const { id } = req.params;
  console.log(`id: ${id} asked to log out`);
  const result = await DbApi.logOut(id);
  if (result) res.send(true);
  else res.send(false);
});


// create post
app.post('/createpost', async (req, res) => {
  const { id } = req.body;
  const { text } = req.body;
  const { picture } = req.body;
  const post = await DbApi.createPost(id, text, picture);
  if (post === false) {
    res.send(false);
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
    res.send(false);
  }
  else {
    res.send(true);
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
    res.send(false);
  }
});


// delete comment
app.post('/removecomment', async (req, res) => {
  const { post } = req.body;
  const { user } = req.body;
  const { comment } = req.body;
  const result = await DbApi.removeCommentFromAPost(user, post, comment);
  if (result) {
    res.send(true);
  }
  else {
    res.send(false);
  }
});

// bump Post
app.post('/addbump', async (req, res) => {
  const { post } = req.body;
  const { user } = req.body;
  const result = await DbApi.addBumpToPost(post, user);
  if (result) {
    res.send(true);
  }
  else {
    res.send(false);
  }
});

// remove bump
app.post('/removebump', async (req, res) => {
  const { post } = req.body;
  const { user } = req.body;
  const result = await DbApi.removeBumpFromAPost(user, post);
  if (result) {
    res.send(true);
  }
  else {
    res.send(false);
  }
});

// save post
app.post('/savepost', async (req, res) => {
  const { post } = req.body;
  const { user } = req.body;
  const result = await DbApi.addSaveToPost(post, user);
  if (result) {
    res.send(true);
  }
  else {
    res.send(false);
  }
});


// remove save
app.post('/removesaved', async (req, res) => {
  const { post } = req.body;
  const { user } = req.body;
  const result = await DbApi.removeSavedPostFromAPost(user, post);
  if (result) {
    res.send(true);
  }
  else {
    res.send(false);
  }
});


// share post
app.post('/sharepost', async (req, res) => {
  const { post } = req.body;
  const { user } = req.body;
  const result = await DbApi.addShareToPost(post, user);
  if (result) {
    res.send(true);
  }
  else {
    res.send(false);
  }
});

// remove share
app.post('/removeshare', async (req, res) => {
  const { post } = req.body;
  const { user } = req.body;
  const { share } = req.body;
  const result = await DbApi.removeShareFromAPost(user, post, share);
  if (result) {
    res.send(true);
  }
  else {
    res.send(false);
  }
});

// remove post
app.post('/removepost', async (req, res) => {
  const { post } = req.body;
  const result = await DbApi.removePost(post);
  res.send(true);
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

// add comment to shared post
app.post('/addcommenttoshare', async (req, res) => {
  const { post } = req.body;
  const { user } = req.body;
  const { text } = req.body;
  const result = await DbApi.addCommentToASharedPost(post, user, text);
  if (result) {
    res.json({ commentid: result._id });
  }
  else {
    res.send(false);
  }
});


// delete comment from shared post
app.post('/removecommentfromshare', async (req, res) => {
  const { post } = req.body;
  const { user } = req.body;
  const { comment } = req.body;
  const result = await DbApi.removeCommentFromASharedPost(user, post, comment);
  if (result) {
    res.send(true);
  }
  else {
    res.send(false);
  }
});

// bump Post from shared post
app.post('/addbumptoshare', async (req, res) => {
  const { post } = req.body;
  const { user } = req.body;
  const result = await DbApi.addBumpToSharedPost(post, user);
  if (result) {
    res.send(true);
  }
  else {
    res.send(false);
  }
});

// remove bump from shared post
app.post('/removebumpfromshare', async (req, res) => {
  const { post } = req.body;
  const { user } = req.body;
  const result = await DbApi.removeBumpFromASharedPost(user, post);
  if (result) {
    res.send(true);
  }
  else {
    res.send(false);
  }
});

// fetch profile
app.post('/profile', async (req, res) => {
  const { profileid, idtocheck } = req.body;

  const [
    user,
    user2,
    postsAUserShared,
    postsOfAUser,
    followers,
    follows,
    iffollows,
    games,
  ] = await Promise.all([
    DbApi.getUserDetails(profileid),
    DbApi.getUserDetails(idtocheck),
    DbApi.getThePostsAUserShared(profileid),
    DbApi.getThePostsOfAUser(profileid),
    DbApi.whoFollowsTheID(profileid),
    DbApi.whoIDFollows(profileid),
    DbApi.ifFollow(idtocheck, profileid),
    DbApi.getUserGameDetailsByPref(profileid),
  ]);

  // eslint-disable-next-line prefer-const
  let posts = postsAUserShared.concat(postsOfAUser);
  posts.sort((a, b) => b.date - a.date);

  await Promise.all(
    posts.map(async (post) => {
      // eslint-disable-next-line no-param-reassign
      post.hasUserBumped = await DbApi.checkIfUserBumpedPost(idtocheck, post._id);
      // eslint-disable-next-line no-param-reassign
      post.hasUserSaved = await DbApi.checkIfUserSavedPost(idtocheck, post._id);
    }),
  );

  const { LOL, RL, VAL } = games;

  res.json({
    user,
    posts,
    followers,
    follows,
    iffollows,
    user2,
    RL,
    VAL,
    LOL,
  });
});



// return the saved post of the user to the front
app.get('/profile/saved/:id', async (req, res) => {
  const { id } = req.params;
  const savedpost = await DbApi.getThePostsAUserSaved(id);

  await Promise.all(
    savedpost.map(async (post) => {
      // eslint-disable-next-line no-param-reassign
      post.hasUserBumped = await DbApi.checkIfUserBumpedPost(id, post._id);
      // eslint-disable-next-line no-param-reassign
      post.hasUserSaved = await DbApi.checkIfUserSavedPost(id, post._id);
    }),
  );

  if (savedpost.length > 0) {
    res.json({ savedpost });
  } else {
    res.send(false);
  }
});

// return the post a user Bumped to the front
app.get('/profile/bumped/:id', async (req, res) => {
  const { id } = req.params;
  const bumpedpost = await DbApi.getThePostsAUserBumped(id);
  for (let index = 0; index < bumpedpost.length; index++) {
    bumpedpost[index].hasUserBumped = await DbApi.checkIfUserBumpedPost(id, bumpedpost[index]._id);
  }
  if (bumpedpost.length > 0) {
    res.json({ bumpedpost });
  } else {
    res.send(false);
  }
});

app.get('/profile/stats/:id', async (req, res) => {
  const { id } = req.params;

  const [
    bumps,
    comments,
    onlinetime,
    matches,
    posts,
  ] = await Promise.all([
    DbApi.countBumpsOnUserID(id),
    DbApi.countCommentsOnUserID(id),
    DbApi.getTimeOnLine(id),
    DbApi.countNumberOfMatch(id),
    DbApi.countNumberOfPost(id),
  ]);

  res.json({
    bumps,
    comments,
    onlinetime,
    matches,
    posts,
  });
});


// remove a user from the db
app.get('/removeuser/:id', async (req, res) => {
  const { id } = req.params;
  const checkansw = await DbApi.removeUser(id);
  if (checkansw) {
    res.send(true);
  }
  else {
    res.send(false);
  }
});

app.post('/search', async (req, res) => {
  const { searchQuery } = req.body;
  const { userId } = req.body;
  const searchresult = await DbApi.searchByGamerTag(searchQuery, userId);
  if (searchresult) {
    res.send(searchresult);
  }
  else {
    res.send(false);
  }
});

app.post('/follows', async (req, res) => {
  const { id1 } = req.body;
  const { id2 } = req.body;
  const followsid = await DbApi.idFollowId(id1, id2);
  if (followsid) {
    res.send(true);
  }
  else {
    res.send(false);
  }
});

app.post('/unfollow', async (req, res) => {
  const { id1 } = req.body;
  const { id2 } = req.body;
  res.send(await DbApi.removeAFollowerFromId(id1, id2));
});


/// ALERT !!! DO NOT USE WITHOUT PERMMISION !!!
app.get('/cleanDataBases', async (req, res) => {
  await DbApi.cleanDataBases();
});


// if passchange or gamertag change is not needed send empty string
app.post('/editprofile', async (req, res) => {
  const { userID } = req.body;
  const { newPass } = req.body;
  const { gamerTag } = req.body;
  const { game1 } = req.body;
  const { game2 } = req.body;
  const { game3 } = req.body;
  const { game4 } = req.body;
  const { game5 } = req.body;
  const { country } = req.body;
  const { language } = req.body;

  res.send(await DbApi.EditProfile(userID, newPass, gamerTag, game1, game2, game3, game4, game5, country, language));
});

app.get('/matchingpage/:id', async (req, res) => {
  const { id } = req.params;
  res.send(await DbApi.getUserGameDetailsByPref(id));
});

app.post('/submitmatchingdetails', async (req, res) => {
  const { userId } = req.body;
  const { language1 } = req.body;
  const { country1 } = req.body;
  const { language2 } = req.body;
  const { country2 } = req.body;
  const { game1 } = req.body;
  const { game2 } = req.body;
  const { game3 } = req.body;
  const { game4 } = req.body;
  const { game5 } = req.body;

  res.send(await DbApi.getPossibeUsersForMatching(userId, language1, country1, game1, game2, game3, game4, game5, language2, country2));
});

app.get('/userdetails/:id', async (req, res) => {
  const { id } = req.params;
  res.send(await DbApi.getUserDetails(id));
});

app.post('/handlematch', async (req, res) => {
  const { userId1 } = req.body;
  const { userId2 } = req.body;
  const { flag } = req.body;
  const res1 = await DbApi.handleMatch(userId1, userId2, flag);
  res.send(res1);
});

app.get('/getnotifications/:id', async (req, res) => {
  const { id } = req.params;
  res.send(await DbApi.getNotification(id));
});


// const routes = [];
// for (const layer of app._router.stack) {
//   if (layer.route) {
//     const { path } = layer.route;
//     const methods = Object.keys(layer.route.methods).join(', ');
//     routes.push({ path, methods });
//   }
// }
// console.log(routes);

app.listen(PORT, () => {
  console.log(`Server has started on port: ${PORT}`);
});

