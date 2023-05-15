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
        return User.find({ _id: item.userID1 }, 'GamerTag _id');
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
      var pref1 = await checkIfLOLprefExists(game2, game3, game4, game5);
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
      var pref2 = await checkIfLOLprefExists(game2, game3, game4, game5);
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
        return User.find({ _id: item.userID2 }, 'GamerTag _id');
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
  if(comment){
    return tcomment._id;}
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
  var newshare = new Shares({ postID: tpostid, userID: tuserid});
  var tshare = await newshare.save();
  var share = await Posts.updateOne({ _id: tpostid }, { $push: { shares: tshare._id } });
  return true
}



//The userID is the user that is following the other user and the follows is the user that is being followed.
//The function returns true if the addition is successful, and false if it is not.
async function addAFollowerToId(userID, follows) {
  var newfollow = new Follows({ userID1: userID, userID2: follows });
  var tnewfollow = await newfollow.save();
  if (tnewfollow)
    return tnewfollow._id;
  else
    return false;
}


// Deletes the 'follows from following the 'userID'.
// The function returns the number of followers that were deleted.
async function removeAFollowerFromId(userID, follows) {
  var ans = await Follows.deleteOne({ userID1: userID, userID2: follows });
  return ans.deletedCount;
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
  var toDelete = await Comments.findOne({ _id: commentId , userID: userId, postID: postId});
  if (toDelete === null) {
    return false;
  }
  else
  {
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
  await Shares.deleteMany({ postID: postId });
  await SavedPosts.deleteMany({ postID: postId });
  return true;
}

////change to deleteOne ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ 3times ~~~~~~~~~~~~~~~~~~~~~~ !!!!!!!!!!!!!!!!!!!!!!
async function removeUser(userId) {
  userToDel = await User.findOne({ _id: userId });
  for (let index = 0; index < userToDel.Bumps.length; index++) {
    bump = await Bumps.findOne({ _id: userToDel.Bumps[index] })
    //console.log(`bump: ${bump}`);
    //change to deleteOne
  }
  for (let index = 0; index < userToDel.Comments.length; index++) {
    comment = await Comments.findOne({ _id: userToDel.Comments[index] })
    //console.log(`comment: ${comment}`);
  }
  for (let index = 0; index < userToDel.Shares.length; index++) {
    share = await Shares.findOne({ _id: userToDel.Shares[index] })
    //console.log(`share: ${share}`);
  }
  //await SavedPosts.deleteMany({userID:userId});
  saved = await SavedPosts.find({ userID: userId });
  //console.log(`saved: ${saved}`);
}


//builds an object of a post by a post id 
//with all that is needed for the post
async function makePostForPostId(postId,userIDToCheck) {
  var post = await Posts.findOne({ _id: postId });
  var user = await User.findOne({ _id: post.userID });

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

  var commentsByPostId = await Comments.find({ postID: post._id });
  var comments = [];
  for (let index = 0; index < commentsByPostId.length; index++) {
    var comment = commentsByPostId[index];
    var user1 = await User.findOne({ _id: comment.userID }, { GamerTag: 1, Picture: 1 });
    var comment = {
      _id: comment._id,
      userID:comment.userID,
      GamerTag: user1.GamerTag,
      Picture: user1.Picture,
      date: comment.createdAt,
      text: comment.text,
    }
    comments.push(comment);
  }
  comments.sort((a, b) => b.date - a.date);

  return {
    _id: post._id,
    userID: user._id,
    GamerTag: user.GamerTag,
    userProfilePicture: user.picture,
    date: post.createdAt,
    text: post.text,
    picture: post.picture,
    numOfBumps: post.bumps.length,
    numofshares: post.shares.length,
    hasUserBumped: hasUserBumped,
    hasUserSaved: hasUserSaved,
    comments:comments,
    isShared: false,
    SGamerTag: "",
    Spicture: "",
    Sdate: ""
  }
}

//gets all the posts of a user and sorts them by date.
async function getThePostsOfAUser(userId) {
  var myPosts = await Posts.find({ userID: userId },{_id:1});
  var posts = [];
  for (let index = 0; index < myPosts.length; index++) {
    var post = await makePostForPostId(myPosts[index]._id,userId);
    posts.push(post);
  }
  posts.sort((a, b) => b.date - a.date);

  return posts;
}

//gets all the posts that a user has shared and returns them in a list.
async function getThePostsAUserShared(userId) {
  var mySharedPosts = await Shares.find({ userID: userId }, { postID: 1 });

  var posts = [];
  for (let index = 0; index < mySharedPosts.length; index++) {
    var post = await makePostForPostId(mySharedPosts[index].postID,userId);
    post.isShared = true;
    var user = await User.findOne({ _id: userId }, { GamerTag: 1, Picture: 1 });
    post.SGamerTag = user.GamerTag;
    post.Spicture = user.Picture;
    post.Sdate = post.createdAt;
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
    var post = await makePostForPostId(myLikedPosts[index].postID,userId);
    posts.push(post);
  }
  posts.sort((a, b) => b.date - a.date);

  return posts;
}

//gets all the posts a user has saved.
async function getThePostsAUserSaved(userId) {
  var mySavedPosts = await Bumps.find({ userID: userId }, { postID: 1 });

  var posts = [];
  for (let index = 0; index < mySavedPosts.length; index++) {
    var post = await makePostForPostId(mySavedPosts[index].postID,userId);
    posts.push(post);
  }
  posts.sort((a, b) => b.date - a.date);

  return posts;
}


// this function logs out the user and calculates the time he was logged in (in seconds)
async function logOut(userId){
  const logInData = await LoggedIn.findOne({userID: userId},{createdAt: 1});
  const timeLoggedIn = logInData.createdAt;
  const timeLoggedOut = new Date();
  const timeDifferenceMs = timeLoggedOut - timeLoggedIn;
  const timeDifferenceSecs = Math.round(timeDifferenceMs / 1000 );
  const user = await User.findOne({_id: userId},{TimeLoggedIn: 1});
  const newTotalTime = user.TimeLoggedIn + timeDifferenceSecs;
  var res1 = await User.updateOne({_id: userId}, {TimeLoggedIn: newTotalTime});
  var res2 = await LoggedIn.deleteOne({userID:userId});
  if(res1 && res2){
    return true;
  }
  return false;
}

// returns the gamer tag and picture of a userid 
async function getUserDetails(userId){
  var details = await User.findOne({_id:userId},{GamerTag:1,Picture:1});
  if(details)
  {
  return details
  }
  return false;
}

// Add a comment to a shared post
async function addCommentToASharedPost(tpostid, tuserid, ttext) {
  var newcomment = new Comments({ postID: tpostid, userID: tuserid, text: ttext });
  var tcomment = await newcomment.save();
  var comment = await Shares.updateOne({ _id: tpostid }, { $push: { Scomments: tcomment._id } });
  if(comment){
    return tcomment._id;}
  return false;
}

//remove specific comment from given share id
async function removeCommentFromASharedPost(userId, postId, commentId) {
  var toDelete = await Comments.findOne({ _id: commentId , userID: userId, postID: postId});
  if (toDelete === null) {
    return false;
  }
  else
  {
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
  didIdAlreadyBumpedPost,
  addBumpToPost,
  createPost,
  editPost,
  addCommentToPost,
  editComment,
  addSaveToPost,
  addShareToPost,
  addAFollowerToId,
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
  removeBumpFromASharedPost
};
