/* eslint-disable */
import Bumps from '../Models/bumps.js';
import Comments from '../Models/comments.js';
import Follows from '../Models/Follows.js';
import LeagueOfLegends from '../Models/LeagueOfLegends.js';
import LoggedIn from '../Models/LoggedIn.js';
import Matches from '../Models/matches.js';
import Posts from '../Models/Posts.js';
import RocketLeague from '../Models/RocketLeague.js';
import SavedPosts from '../Models/SavedPosts.js';
import Shares from '../Models/shares.js';
import User from '../Models/user.js';
import UserPref from '../Models/userPref.js';
import Valorant from '../Models/Valorant.js';


//if exists the object is returned , otherwise false
function checkIfEmailExistsInUsers(TEmail) {
  return User.findOne({ Email: TEmail }).then((result) => {
    if (result) {
      return result;
    } else {
      return false;
    }
  })
    .catch((err) => console.log(err));
}

//if exists the object is returned , otherwise false
function checkIfGamerTagExistsInUsers(TgamerTag) {
  return User.findOne({ GamerTag: TgamerTag }).then((result) => {
    if (result) {
      return result;
    } else {
      return false;
    }
  })
    .catch((err) => console.log(err));
}


function whoFollowsTheID(ID) {
  return Follows.find({ userID2: ID }, 'userID1')
    .then((result) => {
      const promises = result.map((item) => {
        return User.find({ _id: item.userID1 }, 'GamerTag _id Picture');
      });
      return Promise.all(promises);
    })
    .then((result2) => {
      const IdWithgamerTag = result2.map((item) => item[0]);
      return IdWithgamerTag;
    })
    .catch((err) => console.log(err));
}

// returns id of the user if signed in correctly, if already signed in returns false.
// returns 2 if already signed in 
//returns 1 if email/password not right
async function signIn(TEmail, Tpassword) {
  const id = await User.findOne({ Email: TEmail, Password: Tpassword }, { _id: 1 });
  if (id) {
    const res = await LoggedIn.findOne({ userID: id })
    if (res == null) {
      const newLoggedIn = new LoggedIn({ userID: id });
      newLoggedIn.save();
      return id._id;
    }
    else {
      return 2
    }
  }
  else {
    return 1;
  }

}

function checkIfValprefExists(server, rank, role) {
  return Valorant.findOne({ Server: server, Rank: rank, Role: role }).then((result) => {
    if (result) {
      return result._id;
    } else {
      return false;
    }
  })
    .catch((err) => console.log(err));
}
function checkIfLOLprefExists(region, mode, role, rank) {
  return LeagueOfLegends.findOne({ Region: region, Mode: mode, Role: role, Rank: rank }).then((result) => {
    if (result) {
      return result._id;
    } else {
      return false;
    }
  })
    .catch((err) => console.log(err));
}
function checkIfRLprefExists(region, mode, rank) {
  return RocketLeague.findOne({ Region: region, Mode: mode, Rank: rank }).then((result) => {
    if (result) {
      return result._id;
    } else {
      return false;
    }
  })
    .catch((err) => console.log(err));
}

//sign up 
//returns 1 if email exists in the system
//returns 2 if gamertag exists in the system
//else the id of the new user is returned
// SEND ALL THE PARAMETERS (EVEN THE ONE THAT ARE NOT USED SEND THEM AS NULL)
async function signUp(TEmail, TgamerTag, Tpassword, Tgender, TDoB, game1, game2, game3, game4, game5, TDiscord, Tcountry, Tlanguage, Tpicture) {
  if (await checkIfEmailExistsInUsers(TEmail)) {
    return 1;
  }
  if (await checkIfGamerTagExistsInUsers(TgamerTag)) {
    return 2;
  }
  switch (game1) {
    case "0":
      //LOL
      var pref0 = await checkIfLOLprefExists(game2, game3, game4, game5);
      if (!pref0) {
        const newLOL = new LeagueOfLegends({ Region: game2, Mode: game3, Role: game4, Rank: game5 });
        pref0 = await newLOL.save().then((res) => { return res._id });
      }
      const newUser0 = new User({
        Email: TEmail,
        GamerTag: TgamerTag,
        Password: Tpassword,
        Gender: Tgender,
        DoB: TDoB,
        RLpref: null,
        LoLpref: pref0, // replace with valid ObjectId
        Valpref: null,
        Discord: TDiscord,
        Country: Tcountry,
        Language: Tlanguage,
        Picture: Tpicture
      });
      const id0 = await newUser0.save().then((res) => { return res._id });
      await addPrefToUser(id0, 0, pref0);
      await signIn(TEmail, Tpassword);
      return id0;
    case "1":
      //RL
      var pref1 = await checkIfRLprefExists(game2, game3, game4);
      if (!pref1) {
        const newRocket = new RocketLeague({ Region: game2, Mode: game3, Rank: game4 });
        pref1 = await newRocket.save().then((res) => { return res._id });
      }
      const newUser1 = new User({
        Email: TEmail,
        GamerTag: TgamerTag,
        Password: Tpassword,
        Gender: Tgender,
        DoB: TDoB,
        RLpref: pref1, // replace with valid ObjectId
        LoLpref: null,
        Valpref: null,
        Discord: TDiscord,
        Country: Tcountry,
        Language: Tlanguage,
        Picture: Tpicture
      });
      const id1 = await newUser1.save().then((res) => { return res._id });
      await addPrefToUser(id1, 1, pref1);
      await signIn(TEmail, Tpassword);
      return id1;
    case "2":
      //VAL
      var pref2 = await checkIfValprefExists(game2, game3, game4);
      if (!pref2) {
        const newVal = new Valorant({ Server: game2, Rank: game3, Role: game4 });
        pref2 = await newVal.save().then((res) => { return res._id });
      }
      const newUser2 = new User({
        Email: TEmail,
        GamerTag: TgamerTag,
        Password: Tpassword,
        Gender: Tgender,
        DoB: TDoB,
        RLpref: null,
        LoLpref: null,
        Valpref: pref2, // replace with valid ObjectId
        Discord: TDiscord,
        Country: Tcountry,
        Language: Tlanguage,
        Picture: Tpicture
      });
      const id2 = await newUser2.save().then((res) => { return res._id });
      await addPrefToUser(id2, 2, pref2);
      await signIn(TEmail, Tpassword);
      return id2;
  }
}

function whoIDFollows(ID) {
  return Follows.find({ userID1: ID }, 'userID2')
    .then((result) => {
      const promises = result.map((item) => {
        return User.find({ _id: item.userID2 }, 'GamerTag _id Picture');
      });
      return Promise.all(promises);
    })
    .then((result2) => {
      const IdWithgamerTag = result2.map((item) => item[0]);
      return IdWithgamerTag;
    })
    .catch((err) => console.log(err));
}

//search user pref by his id or a specific pref by id and game
// if only by id enter null to Tgame
async function searchUserPref(Tuserid, Tgame) {
  if (Tgame != null) {
    var gamepref = await UserPref.findOne({ userID: Tuserid, game: Tgame });
  }
  else {
    var gamepref = await UserPref.find({ userID: Tuserid });
  }
  return gamepref;
}

//if the user already has a pref to this game it will be updated to the new pref.
//otherwise will be added to the database.
async function addPrefToUser(Tuserid, Tgame, Tprefid) {
  var res = await searchUserPref(Tuserid, Tgame);
  if (res) {
    await UserPref.updateOne({ _id: res._id }, { prefID: Tprefid });
  }
  else {
    var newUserPref = new UserPref({ userID: Tuserid, game: Tgame, prefID: Tprefid })
    await newUserPref.save();
  }
  return true;
}

//if exists the object is returned , otherwise false
function checkIfUserIDExistsInUsers(id) {
  return User.findOne({ _id: id }).then((result) => {
    if (result) {
      return result;
    } else {
      return false;
    }
  })
    .catch((err) => console.log(err));
}

//count number of bumps the user did
async function countBumpsOnUserID(id) {
  return await Bumps.countDocuments({ userID: id });
}

//count number of shares the user did
async function countSharesOnUserID(id) {
  return await Shares.countDocuments({ userID: id });
}

//count number of comments the user did
async function countCommentsOnUserID(id) {
  return await Comments.countDocuments({ userID: id });
}

//count number of saved posts the user saved
async function countSavedPostOnUserID(id) {
  return await SavedPosts.countDocuments({ userID: id });
}

//return time the user was online
async function getTimeOnLine(id) {
  return (await User.findOne({ _id: id }, { TimeLoggedIn: 1 })).TimeLoggedIn;
}

//count the number of posts a user wrote
async function countNumberOfPost(id) {
  return await Posts.countDocuments({ userID: id });
}

// return the number of matches of a user
async function countNumberOfMatch(id) {
  return (await User.findOne({ _id: id }, { CountMatches: 1 })).CountMatches;
}

//check if given id already bumped a given post id
async function didIdAlreadyBumpedPost(userid, postid) {
  var bump = await Bumps.findOne({ postID: postid, userID: userid });
  if (!bump) {
    return false;
  }
  return true;
}

//returns true after a new bump added
//if already bumped this post, will return false
async function addBumpToPost(postid, userid) {
  var bool = await didIdAlreadyBumpedPost(userid, postid);
  if (bool == false) {
    var newbump = new Bumps({ postID: postid, userID: userid });
    var bump = await newbump.save();
    await Posts.updateOne({ _id: postid }, { $push: { bumps: bump._id } })
    return true;
  }
  return false;
}

//create post receive the userid of the creator of the post the text of the post and a picture if there is one
//return the id of the post if the post was created,false if there was an error
//if there is no picture receive null
async function createPost(tuserid, ttext, tpicture) {
  var pref;
  if (tpicture == null) {
    const newPost = new Posts({ userID: tuserid, text: ttext, picture: 'null' });
    pref = await newPost.save();
  }
  else {
    const newPost = new Posts({ userID: tuserid, text: ttext, picture: tpicture });
    pref = await newPost.save();
  }
  if (pref != null) {
    return pref._id;
  }
  return false;
}

//edit the post , the function receive the id of the post and the updated text
//return true or false depending if the update happened or not
//cant update picture
async function editPost(tpostid, ttext) {
  var post = await Posts.updateOne({ _id: tpostid }, { text: ttext });
  if (post == 0) {
    return false;
  }
  return true;
}


//add a comment to the post
//receive the id of the post the id of the user and the text
//return true if the comment was added or false if not
async function addCommentToPost(tpostid, tuserid, ttext) {
  var newcomment = new Comments({ postID: tpostid, userID: tuserid, text: ttext });
  var tcomment = await newcomment.save();
  var comment = await Posts.updateOne({ _id: tpostid }, { $push: { comments: tcomment._id } });
  if (comment) {
    return tcomment._id;
  }
  return false;
}

//edit comment that already exists
//receive the id of the comment, and the new text
//return true if the comment was edited or false if not
async function editComment(tcommentid, ttext) {
  var comment = await Comments.updateOne({ _id: tcommentid }, { text: ttext });
  if (comment == 0) {
    return false;
  }
  return true;
}

//create a save post
//receive the id of the post the id of the user
//return true if the post was saved and false if not
async function addSaveToPost(tpostid, tuserid) {
  var newsavepost = new SavedPosts({ postID: tpostid, userID: tuserid });
  var tnewsavepost = await newsavepost.save();
  if (tnewsavepost) {
    return true;
  }
  return false;
}

//create a new share post and return if the shares was created
//receive post id and user id
async function addShareToPost(tpostid, tuserid) {
  var newshare = new Shares({ postID: tpostid, userID: tuserid });
  var tshare = await newshare.save();
  var share = await Posts.updateOne({ _id: tpostid }, { $push: { shares: tshare._id } });
  return true
}


// Deletes the 'follows from following the 'userID'.
// The function returns the number of followers that were deleted.
async function removeAFollowerFromId(userID, follows) {
  await Follows.deleteOne({ userID1: userID, userID2: follows });
  return true;
}

// remove a given bump from a given post id 
async function removeBumpFromAPost(userId, postId) {
  var toDelete = await Bumps.findOne({ userID: userId, postID: postId });

  if (toDelete) {
    var ans = await Posts.updateOne({ _id: postId }, { $pull: { bumps: toDelete._id } });
    await Bumps.deleteOne({ _id: toDelete._id });

    return ans.acknowledged;
  }
  else
    return false;
}

//remove specific comment from given post id
async function removeCommentFromAPost(userId, postId, commentId) {
  var toDelete = await Comments.findOne({ _id: commentId, userID: userId, postID: postId });
  if (toDelete === null) {
    return false;
  }
  else {
    await Posts.updateOne({ _id: postId }, { $pull: { comments: commentId } });
    await Comments.deleteOne({ _id: toDelete._id });
    return true;
  }

}


//remove specific share from given post id
async function removeShareFromAPost(userId, postId, sharedId) {
  var toDelete = await Shares.findOne({ _id: sharedId, userID: userId, postID: postId });
  if (toDelete) {
    var ans = await Posts.updateOne({ _id: postId }, { $pull: { shares: toDelete._id } });
    await Bumps.deleteMany({ postID: sharedId });
    await Comments.deleteMany({ postID: sharedId });
    await Shares.deleteOne({ _id: toDelete._id });
    return true;
  }
  else
    return false;
}

//remove specific comment from given post id
async function removeSavedPostFromAPost(userId, postId) {
  var toDelete = await SavedPosts.findOne({ userID: userId, postID: postId });
  if (toDelete) {
    await SavedPosts.deleteOne({ _id: toDelete._id });
    return true;
  }
  else
    return false;
}

//remove a post by id
async function removePost(postId) {
  await Posts.deleteOne({ _id: postId });
  await Bumps.deleteMany({ postID: postId });
  await Comments.deleteMany({ postID: postId });
  let bumpedshares = await Shares.find({ postID: postId }, { _id: 1 });
  for (let index = 0; index < bumpedshares.length; index++) {
    await Bumps.deleteMany({ postID: bumpedshares[index]._id });
    await Comments.deleteMany({ postID: bumpedshares[index]._id });
  }
  await Shares.deleteMany({ postID: postId });
  await Shares.deleteMany({ _id: postId });
  await SavedPosts.deleteMany({ postID: postId });
  return true;
}

////change to deleteOne ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ 3times ~~~~~~~~~~~~~~~~~~~~~~ !!!!!!!!!!!!!!!!!!!!!!
async function removeUser(userId) {
  var posts = [];
  posts = posts.concat(await Posts.find({ userID: userId }));
  for (let index = 0; index < posts.length; index++) {
    await removePost(posts[index]._id);
  }
  var bumps = []
  bumps = bumps.concat(await Bumps.find({ userID: userId }));
  for (let index = 0; index < bumps.length; index++) {
    await removeBumpFromAPost(userId, bumps[index].postID);
  }
  var comments = []
  comments = comments.concat(await Comments.find({ userID: userId }));
  for (let index = 0; index < comments.length; index++) {
    await removeCommentFromAPost(userId, comments[index].postID, comments[index]._id);
  }
  var share = []
  share = share.concat(await Shares.find({ userID: userId }));
  for (let index = 0; index < share.length; index++) {
    await removeShareFromAPost(userId, share[index].postID, share[index]._id);
  }
  await SavedPosts.deleteMany({ userID: userId });
  await Follows.deleteMany({
    $or: [
      { userID1: userId },
      { userID2: userId }
    ]
  });
  await UserPref.deleteMany({ userID: userId });
  await LoggedIn.deleteOne({ userID: userId });
  // await Matches.deleteMany({
  //   $or: [
  //     { userID1: userId },
  //     { userID2: userId}
  //   ]
  // });
  await User.deleteOne({ _id: userId });
  return true;
}


//builds an object of a post by a post id 
//with all that is needed for the post
async function makePostForPostId(postId, userIDToCheck, isSharedFlag) {
  var post = await Posts.findOne({ _id: postId });
  var user;

  if (post) {
    user = await User.findOne({ _id: post.userID });
    var ifUserBumped = await Bumps.findOne({ userID: userIDToCheck, postID: post._id });
    var hasUserBumped = false;
    if (ifUserBumped !== null) {
      hasUserBumped = true;
    }

    var ifUserSaved = await SavedPosts.findOne({ userID: userIDToCheck, postID: post._id });
    var hasUserSaved = false;
    if (ifUserSaved !== null) {
      hasUserSaved = true;
    }
  }
  else {
    var sharedPostOfAUser = await Shares.findOne({ _id: postId });
    user = await User.findOne({ _id: sharedPostOfAUser.userID });
    post = await Posts.findOne({ _id: sharedPostOfAUser.postID });
    var user2 = await User.findOne({ _id: post.userID });
  }

  var commentsByPostId = await Comments.find({ postID: postId });
  var comments = [];
  for (let index = 0; index < commentsByPostId.length; index++) {
    var comment = commentsByPostId[index];
    var user1 = await User.findOne({ _id: comment.userID }, { GamerTag: 1, Picture: 1 });
    var comment = {
      _id: comment._id,
      userID: comment.userID,
      GamerTag: user1.GamerTag,
      Picture: user1.Picture,
      date: comment.createdAt,
      text: comment.text,
    }
    comments.push(comment);
  }
  comments.sort((a, b) => b.date - a.date);

  var newPost = {
    _id: post._id,
    userID: user._id,
    GamerTag: user.GamerTag,
    userProfilePicture: user.Picture,
    date: post.createdAt,
    text: post.text,
    picture: post.picture,
    numOfBumps: '',
    numofshares: '',
    hasUserBumped: '',
    hasUserSaved: '',
    comments: comments,
    isShared: false,
    Sid: "",
    SGamerTag: "",
    Spicture: "",
    Sdate: "",
    Suserid: "",
  }

  if (isSharedFlag) {
    newPost.isShared = true;

    var sharedPost = await Shares.findOne({ _id: postId });
    var userDetails = await getUserDetails(sharedPost.userID);

    var ifUserBumpedShare = await Bumps.findOne({ userID: userIDToCheck, postID: sharedPost._id });
    var hasUserBumpedShare = false;
    if (ifUserBumpedShare !== null) {
      hasUserBumpedShare = true;
    }
    newPost.hasUserBumped = hasUserBumpedShare;

    newPost.Sid = newPost._id;
    newPost.Suserid = user2._id;
    newPost.SGamerTag = user2.GamerTag;
    newPost.Spicture = user2.Picture;
    newPost.Sdate = newPost.date;
    newPost.numOfBumps = sharedPost.Sbumps.length;

    newPost._id = sharedPost._id;
    newPost.GamerTag = userDetails.GamerTag;
    newPost.userProfilePicture = userDetails.Picture;
    newPost.date = sharedPost.createdAt;
    newPost.userID = sharedPost.userID;
  }
  else {
    newPost.numOfBumps = post.bumps.length;
    newPost.numofshares = post.shares.length;
    newPost.hasUserBumped = hasUserBumped;
    newPost.hasUserSaved = hasUserSaved;
  }

  return newPost;
}

//gets all the posts of a user and sorts them by date.
async function getThePostsOfAUser(userId) {
  var myPosts = await Posts.find({ userID: userId }, { _id: 1 });
  var posts = [];
  for (let index = 0; index < myPosts.length; index++) {
    var post = await makePostForPostId(myPosts[index]._id, userId, false);

    posts.push(post);
  }
  posts.sort((a, b) => b.date - a.date);

  return posts;
}

//gets all the posts that a user has shared and returns them in a list.
async function getThePostsAUserShared(userId) {
  var mySharedPosts = await Shares.find({ userID: userId });

  var posts = [];
  for (let index = 0; index < mySharedPosts.length; index++) {
    var post = await makePostForPostId(mySharedPosts[index]._id, userId, true);

    posts.push(post);
  }
  posts.sort((a, b) => b.date - a.date);

  return posts;
}

//returns all the posts that the user has bumped.
async function getThePostsAUserBumped(userId) {
  var myLikedPosts = await Bumps.find({ userID: userId }, { postID: 1 });

  var posts = [];
  for (let index = 0; index < myLikedPosts.length; index++) {
    var sharedPost = await Shares.findOne({ _id: myLikedPosts[index].postID });
    var post;
    if (!sharedPost) {
      post = await makePostForPostId(myLikedPosts[index].postID, userId, false);
      posts.push(post);
    }
    else {
      post = await makePostForPostId(myLikedPosts[index].postID, userId, true);
      posts.push(post);
    }
    var ifUserSaved = await SavedPosts.findOne({ userID: userId, postID: post._id });
    var hasUserSaved = false;
    if (ifUserSaved !== null) {
      hasUserSaved = true;
    }
    post.hasUserSaved = hasUserSaved;
  }
  posts.sort((a, b) => b.date - a.date);

  return posts;
}

//gets all the posts a user has saved.
async function getThePostsAUserSaved(userId) {
  var mySavedPosts = await SavedPosts.find({ userID: userId }, { postID: 1 });
  var posts = [];
  for (let index = 0; index < mySavedPosts.length; index++) {
    var post = await makePostForPostId(mySavedPosts[index].postID, userId, false);
    posts.push(post);
  }
  posts.sort((a, b) => b.date - a.date);

  return posts;
}


// this function logs out the user and calculates the time he was logged in (in seconds)
async function logOut(userId) {
  const logInData = await LoggedIn.findOne({ userID: userId }, { createdAt: 1 });
  const timeLoggedIn = logInData.createdAt;
  const timeLoggedOut = new Date();
  const timeDifferenceMs = timeLoggedOut - timeLoggedIn;
  const timeDifferenceSecs = Math.round(timeDifferenceMs / 1000);
  const user = await User.findOne({ _id: userId }, { TimeLoggedIn: 1 });
  const newTotalTime = user.TimeLoggedIn + timeDifferenceSecs;
  var res1 = await User.updateOne({ _id: userId }, { TimeLoggedIn: newTotalTime });
  var res2 = await LoggedIn.deleteOne({ userID: userId });
  if (res1 && res2) {
    return true;
  }
  return false;
}

// returns the gamer tag and picture of a userid 
async function getUserDetails(userId) {
  var details = await User.findOne({ _id: userId }, 'GamerTag Picture Gender Language Country Discord');
  if (details) {
    return details
  }
  return false;
}

// Add a comment to a shared post
async function addCommentToASharedPost(tpostid, tuserid, ttext) {
  var newcomment = new Comments({ postID: tpostid, userID: tuserid, text: ttext });
  var tcomment = await newcomment.save();
  var comment = await Shares.updateOne({ _id: tpostid }, { $push: { Scomments: tcomment._id } });
  if (comment) {
    return tcomment._id;
  }
  return false;
}

//remove specific comment from given share id
async function removeCommentFromASharedPost(userId, postId, commentId) {
  var toDelete = await Comments.findOne({ _id: commentId, userID: userId, postID: postId });
  if (toDelete === null) {
    return false;
  }
  else {
    await Shares.updateOne({ _id: postId }, { $pull: { Scomments: commentId } });
    await Comments.deleteOne({ _id: toDelete._id });
    return true;
  }

}

// add bump to a given shared post (id)
async function addBumpToSharedPost(postid, userid) {
  var bool = await didIdAlreadyBumpedPost(userid, postid);
  if (bool == false) {
    var newbump = new Bumps({ postID: postid, userID: userid });
    var bump = await newbump.save();
    await Shares.updateOne({ _id: postid }, { $push: { Sbumps: bump._id } })
    return true;
  }
  return false;
}

// remove a given bump from a given shared post id 
async function removeBumpFromASharedPost(userId, postId) {
  var toDelete = await Bumps.findOne({ userID: userId, postID: postId });

  if (toDelete) {
    var ans = await Shares.updateOne({ _id: postId }, { $pull: { Sbumps: toDelete._id } });
    await Bumps.deleteOne({ _id: toDelete._id });

    return ans.acknowledged;
  }
  else
    return false;
}

//search function to navbar
async function searchByGamerTag(name, searchid) {
  try {
    const regex = new RegExp('^' + name, 'i');
    const result = await User.find({ GamerTag: regex }, { _id: 1, GamerTag: 1, Picture: 1 });
    var arr = [];
    if (result) {
      var follows = [];
      var nonfollows = [];
      for (let index = 0; index < result.length; index++) {
        var searchfollow = await Follows.findOne({ userID1: searchid, userID2: result[index]._id })
        if (searchfollow) {
          console.log(searchfollow);
          follows.push(result[index]);
        }
        else {
          nonfollows.push(result[index]);
        }
      }
      arr = arr.concat(follows);
      arr = arr.concat(nonfollows);
    }
    if (arr.length == 0) {
      return false;
    }
    return arr;
  } catch (error) {
    return false;
  }
}



//add follow from id to id 
async function idFollowId(id1, id2) {
  const newFollow = new Follows({ userID1: id1, userID2: id2 });
  const res = await newFollow.save();
  if (res) {
    return true;
  }
  return false;
}

//check if id follows id
async function ifFollow(id1, id2) {
  const res = await Follows.findOne({ userID1: id1, userID2: id2 });
  if (res) {
    return true;
  }
  return false;
}

async function cleanDataBases() {
  await Bumps.deleteMany({});
  await Comments.deleteMany({});
  await Follows.deleteMany({});
  await LeagueOfLegends.deleteMany({});
  await LoggedIn.deleteMany({});
  await Matches.deleteMany({});
  await Posts.deleteMany({});
  await RocketLeague.deleteMany({});
  await SavedPosts.deleteMany({});
  await Shares.deleteMany({});
  await User.deleteMany({});
  await UserPref.deleteMany({});
  await Valorant.deleteMany({});
  return true;
}

async function checkIfUserBumpedPost(userIDToCheck, postIDToCheck) {
  var ifUserBumped = await Bumps.findOne({ userID: userIDToCheck, postID: postIDToCheck });
  var hasUserBumped = false;
  if (ifUserBumped !== null) {
    hasUserBumped = true;
  }
  return hasUserBumped;
}

async function checkIfUserSavedPost(userIDToCheck, postIDToCheck) {
  var ifUserSaved = await SavedPosts.findOne({ userID: userIDToCheck, postID: postIDToCheck });
  var hasUserSaved = false;
  if (ifUserSaved !== null) {
    hasUserSaved = true;
  }
  return hasUserSaved;
}

async function editUserPref(userID, game1, game2, game3, game4, game5) {
  switch (game1) {
    case "0":
      //LOL
      var pref0 = await checkIfLOLprefExists(game2, game3, game4, game5);
      if (!pref0) {
        const newLOL = new LeagueOfLegends({ Region: game2, Mode: game3, Role: game4, Rank: game5 });
        pref0 = await newLOL.save().then((res) => { return res._id });
      }

      await addPrefToUser(userID, 0, pref0);
      await User.updateOne({ _id: userID }, { LoLpref: pref0._id });

      return userID;
    case "1":
      //RL
      var pref1 = await checkIfRLprefExists(game2, game3, game4);
      if (!pref1) {
        const newRocket = new RocketLeague({ Region: game2, Mode: game3, Rank: game4 });
        pref1 = await newRocket.save().then((res) => { return res._id });
      }

      await addPrefToUser(userID, 1, pref1);
      await User.updateOne({ _id: userID }, { RLpref: pref1._id });

      return userID;
    case "2":
      //VAL
      var pref2 = await checkIfValprefExists(game2, game3, game4);
      if (!pref2) {
        const newVal = new Valorant({ Server: game2, Rank: game3, Role: game4 });
        pref2 = await newVal.save().then((res) => { return res._id });
      }

      await addPrefToUser(userID, 2, pref2);
      await User.updateOne({ _id: userID }, { Valpref: pref2._id });

      return userID;
  }

}

async function EditProfile(userID, newPass, Gamertag, game1, game2, game3, game4, game5, country, language) {
  if (await checkIfGamerTagExistsInUsers(Gamertag)) return false;
  if (Gamertag) await User.updateOne({ _id: userID }, { GamerTag: Gamertag });
  if (newPass) await User.updateOne({ _id: userID }, { Password: newPass });
  if (country) await User.updateOne({ _id: userID }, { Country: country });
  if (language) await User.updateOne({ _id: userID }, { Language: language });
  if (game1 == 1 || game1 == 2 || game1 == 3) {
    await editUserPref(userID, game1, game2, game3, game4, game5);
  }
  return true;
}

async function getUserGameDetailsByPref(userId) {
  let lolPref = await UserPref.findOne({ userID: userId, game: 0 });
  let rlPref = await UserPref.findOne({ userID: userId, game: 1 });
  let valPref = await UserPref.findOne({ userID: userId, game: 2 });
  let lolPref1, rlPref1, valPref1;

  if (lolPref) {
    lolPref1 = await LeagueOfLegends.findOne({ _id: lolPref.prefID }, '_id Region Mode Role Rank');
  }
  if (rlPref) {
    rlPref1 = await RocketLeague.findOne({ _id: rlPref.prefID }, '_id Region Mode Rank');
  }
  if (valPref) {
    valPref1 = await Valorant.findOne({ _id: valPref.prefID }, '_id Server Rank Role');
  }

  let userCountryLang = await User.findOne({ _id: userId }, 'Country Language');

  return { LOL: lolPref1, RL: rlPref1, VAL: valPref1, Country: userCountryLang.Country, Language: userCountryLang.Language };
}


async function getPossibeUsersForMatching(userId, language1, country1, game1, game2, game3, game4, game5, language2, country2) {
  if (language1 && country1) {
    await User.updateOne({ _id: userId }, { Language: language1, Country: country1 });
  }

  else if (country1) {
    await User.updateOne({ _id: userId }, { Country: country1 });
  }

  else if (language1) {
    await User.updateOne({ _id: userId }, { Language: language1 });
  }

  let pref, possibleUsers, usersToRemove1, usersToRemove2, usersToRemove;
  //כל מה שהופיע כבר ליוזר והוא הגיב לו (חיובי או שלילי) לא יופיע יותר
  usersToRemove1 = await Matches.find({ userID1: userId }, 'userID2');
  usersToRemove1 = usersToRemove1.map(obj => { return obj.userID2.toString() });
  console.log(usersToRemove1);
  // אם היוזר הופיע למישהו אחר והוא הגיב חיובי או שלילי או שהיוזר כבר הגיב בשלילה אז הוא לא יופיע ליוזר, 
  usersToRemove2 = await Matches.find({ $or: [{ userID2: userId, check21: false }, { userID2: userId, check21: true }, { userID2: userId, check12: false }] }, 'userID1');
  usersToRemove2 = usersToRemove2.map(obj => { return obj.userID1.toString() });
  console.log(usersToRemove);

  usersToRemove = usersToRemove1.concat(usersToRemove2);

  switch (game1) {
    case "0":
      pref = await LeagueOfLegends.findOne({ Region: game2, Mode: game3, Role: game4, Rank: game5 }, '_id');
      possibleUsers = await User.find({ LoLpref: pref._id, Country: country2, Language: language2 }, '_id');
      break;
    case "1":
      console.log(game2, game3, game4);
      pref = await RocketLeague.findOne({ Region: game2, Mode: game3, Rank: game4 });
      console.log(pref);
      possibleUsers = await User.find({ RLpref: pref._id, Country: country2, Language: language2 }, '_id');
      break;
    case "2":
      pref = await Valorant.findOne({ Server: game2, Rank: game3, Role: game4 }, '_id');
      possibleUsers = await User.find({ Valpref: pref._id, Country: country2, Language: language2 }, '_id');
      break;
  }
  const useridString = userId.toString();
  let loggedin = await LoggedIn.find({}, 'userID');
  loggedin = loggedin.map(obj => { return obj.userID.toString() });
  console.log(loggedin);
  let filteredArray = possibleUsers.filter((element) => !usersToRemove.includes(element._id.toString()) && element._id.toString() != (useridString));
  filteredArray = filteredArray.map(obj => { return obj._id.toString() });
  console.log(filteredArray);
  let filterLoggedIn = filteredArray.filter((element) => loggedin.includes(element));
  console.log(filterLoggedIn);
  return filterLoggedIn;
}

// gets two users and a decision, if both users decided yes, returns true, else false
async function handleMatch(userid1, userid2, decision) {
  let match = await Matches.findOne({ userID1: userid2, userID2: userid1 });
  if (match) {
    await Matches.updateOne({ userID1: userid2, userID2: userid1 }, { check21: decision });
    if (decision && match.check12) {
      await User.updateOne({ _id: userid1 }, { $inc: { CountMatches: 1 } });
      await User.updateOne({ _id: userid2 }, { $inc: { CountMatches: 1 } });
      return true;
    }
    else return false;
  } else {
    let newMatch = new Matches({ userID1: userid1, userID2: userid2, check12: decision });
    await newMatch.save().then((res) => { return res._id });
    return false;
  }
}


async function getNotification(userId) {
  let matches = await Matches.find({ $or: [{ userID1: userId, check21: true, check12: true }, { userID2: userId, check21: true, check12: true }] }, 'userID1 userID2 updatedAt');
  matches.sort((a, b) => b.updatedAt - a.updatedAt);

  let users = [];
  userId = userId.toString();
  let user;
  for (let index = 0; index < matches.length; index++) {
    if (userId == matches[index].userID1.toString()) {
      user = await getUserDetails(matches[index].userID2.toString());
      user.updatedAt = matches[index].updatedAt;
      users.push(user);
    }
    else {
      user = await getUserDetails(matches[index].userID1.toString());
      user.updatedAt = matches[index].updatedAt;
      users.push(user);
    }
  }
  if (users.length == 0) {
    return false;
  }
  return users;
}




export default {
  checkIfEmailExistsInUsers,
  checkIfGamerTagExistsInUsers,
  whoFollowsTheID,
  signIn,
  signUp,
  checkIfRLprefExists,
  checkIfLOLprefExists,
  checkIfValprefExists,
  whoIDFollows,
  searchUserPref,
  addPrefToUser,
  checkIfUserIDExistsInUsers,
  countBumpsOnUserID,
  countSharesOnUserID,
  countCommentsOnUserID,
  countSavedPostOnUserID,
  countNumberOfMatch,
  countNumberOfPost,
  didIdAlreadyBumpedPost,
  addBumpToPost,
  createPost,
  editPost,
  addCommentToPost,
  editComment,
  addSaveToPost,
  addShareToPost,
  removeAFollowerFromId,
  removeBumpFromAPost,
  removeCommentFromAPost,
  removeShareFromAPost,
  removeSavedPostFromAPost,
  removePost,
  makePostForPostId,
  getThePostsOfAUser,
  getThePostsAUserShared,
  getThePostsAUserBumped,
  getThePostsAUserSaved,
  logOut,
  getUserDetails,
  addCommentToASharedPost,
  removeCommentFromASharedPost,
  addBumpToSharedPost,
  removeBumpFromASharedPost,
  getTimeOnLine,
  removeUser,
  searchByGamerTag,
  idFollowId,
  ifFollow,
  cleanDataBases,
  checkIfUserBumpedPost,
  checkIfUserSavedPost,
  EditProfile,
  getUserGameDetailsByPref,
  getPossibeUsersForMatching,
  handleMatch,
  getNotification
};
