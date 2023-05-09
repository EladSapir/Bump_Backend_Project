const Bumps = require('./Models/bumps');
const Comments = require('./Models/comments');
const Follows = require('./Models/Follows');
const LeagueOfLegends = require('./Models/LeagueOfLegends');
const LoggedIn = require('./Models/LoggedIn');
const Matches = require('./Models/matches');
const Posts = require('./Models/Posts');
const RocketLeague = require('./Models/RocketLeague');
const SavedPosts = require('./Models/SavedPosts');
const Shares = require('./Models/shares');
const User = require('./Models/user');
const UserPref = require('./Models/userPref');
const Valorant = require('./Models/Valorant');

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
async function signIn(TEmail, Tpassword) {
  id = await User.findOne({ Email: TEmail, Password: Tpassword }, { _id: 1 });
  if (id) {
    res = LoggedIn.findOne({ _id: id })
    if (!res) { }
    const newLoggedIn = new LoggedIn({ userID: result._id });
    newLoggedIn.save();
    return id;
  }
  else {
    return false;
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
async function signUp(TEmail, TgamerTag, Tpassword, Tgender, TDoB, game1, game2, game3, game4, game5, TDiscord, Tcountry, Tlanguage, Tpicture) {
  if (await checkIfEmailExistsInUsers(TEmail)) {
    console.log("email exists");
    return 1;
  }
  if (await checkIfGamerTagExistsInUsers(TgamerTag)) {
    console.log("gamerTag exists");
    return 2;
  }
  switch (game1) {
    case 0:
      //LOL
      pref = await checkIfLOLprefExists(game2, game3, game4, game5);
      if (!pref) {
        const newLOL = new LeagueOfLegends({ Region: game2, Mode: game3, Role: game4, Rank: game5 });
        pref = await newLOL.save().then((res) => { return res._id });
      }
      const newUser0 = new User({
        Email: TEmail,
        GamerTag: TgamerTag,
        Password: Tpassword,
        Gender: Tgender,
        DoB: TDoB,
        LoLpref: pref, // replace with valid ObjectId
        Discord: TDiscord,
        Country: Tcountry,
        Language: Tlanguage,
        Picture: Tpicture
      });
      id = await newUser0.save().then((res) => { return res._id });
      await addPrefToUser(id, 0, pref);
      await signIn(TEmail, Tpassword);
      return id;
    case 1:
      //RL
      pref = await checkIfLOLprefExists(game2, game3, game4, game5);
      if (!pref) {
        const newRocket = new RocketLeague({ Region: game2, Mode: game3, Rank: game4 });
        pref = await newRocket.save().then((res) => { return res._id });
      }
      const newUser1 = new User({
        Email: TEmail,
        GamerTag: TgamerTag,
        Password: Tpassword,
        Gender: Tgender,
        DoB: TDoB,
        RLpref: pref, // replace with valid ObjectId
        Discord: TDiscord,
        Country: Tcountry,
        Language: Tlanguage,
        Picture: Tpicture
      });
      id = await newUser1.save().then((res) => { return res._id });
      await addPrefToUser(id, 1, pref);
      await signIn(TEmail, Tpassword);
      return id;
    case 2:
      //VAL
      pref = await checkIfLOLprefExists(game2, game3, game4, game5);
      if (!pref) {
        const newVal = new Valorant({ Server: game2, Rank: game3, Role: game4 });
        pref = await newVal.save().then((res) => { return res._id });
      }
      const newUser2 = new User({
        Email: TEmail,
        GamerTag: TgamerTag,
        Password: Tpassword,
        Gender: Tgender,
        DoB: TDoB,
        Valpref: pref, // replace with valid ObjectId
        Discord: TDiscord,
        Country: Tcountry,
        Language: Tlanguage,
        Picture: Tpicture
      });
      id = await newUser2.save().then((res) => { return res._id });
      await addPrefToUser(id, 2, pref);
      await signIn(TEmail, Tpassword);
      return id;
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
    gamepref = await UserPref.findOne({ userID: Tuserid, game: Tgame });
  }
  else {
    gamepref = await UserPref.find({ userID: Tuserid });
  }
  return gamepref;
}

//if the user already has a pref to this game it will be updated to the new pref.
//otherwise will be added to the database.
async function addPrefToUser(Tuserid, Tgame, Tprefid) {
  res = await searchUserPref(Tuserid, Tgame);
  console.log(res);
  if (res) {
    await UserPref.updateOne({ _id: res._id }, { prefID: Tprefid });
  }
  else {
    newUserPref = new UserPref({ userID: Tuserid, game: Tgame, prefID: Tprefid })
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
  bump = await Bumps.findOne({ postID: postid, userID: userid });
  if (!bump) {
    return false;
  }
  return true;
}

//returns true after a new bump added
//if already bumped this post, will return false
async function addBumpToPost(postid, userid) {
  bool = await didIdAlreadyBumpedPost(userid, postid);
  if (bool == false) {
    newbump = new Bumps({ postID: postid, userID: userid });
    bump = await newbump.save();
    await Posts.updateOne({ _id: postid }, { $push: { bumps: bump._id } })
    return true;
  }
  return false;
}

//create post receive the userid of the creator of the post the text of the post and a picture if there is one
//return the id of the post if the post was created,false if there was an error
//if there is no picture receive null
async function createPost(tuserid, ttext, tpicture) {
  if (tpicture == null) {
    const newPost = new Posts({ userID: tuserid, text: ttext, picture: 'null' });
    pref = await newPost.save().then((res) => { return res._id });
  }
  else {
    const newPost = new Posts({ userID: tuserid, text: ttext, picture: tpicture });
    pref = await newPost.save().then((res) => { return res._id });
  }
  if (pref != null) {
    return pref;
  }
  return false;
}

//edit the post , the function receive the id of the post and the updated text
//return true or false depending if the update happened or not
//cant update picture
async function editPost(tpostid, ttext) {
  post = await Posts.updateOne({ _id: tpostid }, { text: ttext });
  if (post == 0) {
    return false;
  }
  return true;
}


//add a comment to the post
//receive the id of the post the id of the user and the text
//return true if the comment was added or false if not
async function addCommentToPost(tpostid, tuserid, ttext) {
  newcomment = new Comments({ postID: tpostid, userID: tuserid, text: ttext });
  tcomment = await newcomment.save();
  comment = await Posts.updateOne({ _id: tpostid }, { $push: { comments: tcomment._id } });
  return comment.acknowledged;
}

//edit comment that already exists
//receive the id of the comment, and the new text
//return true if the comment was edited or false if not
async function editComment(tcommentid, ttext) {
  comment = await Comments.updateOne({ _id: tcommentid }, { text: ttext });
  if (comment == 0) {
    return false;
  }
  return true;
}

//create a save post
//receive the id of the post the id of the user
//return true if the post was saved and false if not
async function addSaveToPost(tpostid, tuserid) {
  newsavepost = new SavedPosts({ postID: tpostid, userID: tuserid });
  tnewsavepost = await newsavepost.save();
  if (tnewsavepost) {
    return true;
  }
  return false;
}

//create a new share post and return if the shares was created
//receive post id and user id
async function addShareToPost(tpostid, tuserid) {
  newshare = new Shares({ postID: tpostid, userID: tuserid });
  tshare = await newshare.save();
  share = await Posts.updateOne({ _id: tpostid }, { $push: { shares: tshare._id } });
  return share.acknowledged;
}



//The userID is the user that is following the other user and the follows is the user that is being followed.
//The function returns true if the addition is successful, and false if it is not.
async function addAFollowerToId(userID, follows) {
  newfollow = new Follows({ userID1: userID, userID2: follows });
  tnewfollow = await newfollow.save();
  if (tnewfollow)
    return tnewfollow._id;
  else
    return false;
}


// Deletes the 'follows from following the 'userID'.
// The function returns the number of followers that were deleted.
async function removeAFollowerFromId(userID, follows) {
  ans = await Follows.deleteOne({ userID1: userID, userID2: follows });
  return ans.deletedCount;
}

// remove a given bump from a given post id 
async function removeBumpFromAPost(userId, postId) {
  toDelete = await Bumps.findOne({ userID: userId, postID: postId });

  if (toDelete) {
    ans = await Posts.updateOne({ _id: postId }, { $pull: { bumps: toDelete._id } });
    await Bumps.deleteOne({ _id: toDelete._id });

    return ans.acknowledged;
  } 
  else
    return false;
}

//remove specific comment from given post id
async function removeCommentFromAPost(userId, postId, commentId) {
  toDelete = await Comments.findOne({ _id:commentId, userID: userId, postID: postId });
  if (toDelete) {
    ans = await Posts.updateOne({ _id: postId }, { $pull: { comments: toDelete._id } });
    await Comments.deleteOne({ _id: toDelete._id });
    return ans.acknowledged;
  } 
  else
    return false;
}


//remove specific share from given post id
async function removeShareFromAPost(userId, postId, sharedId) {
  toDelete = await Shares.findOne({ _id:sharedId, userID: userId, postID: postId });
  if (toDelete) {
    ans = await Posts.updateOne({ _id: postId }, { $pull: { shares: toDelete._id } });
    await Shares.deleteOne({ _id: toDelete._id });
    return ans.acknowledged;
  } 
  else
    return false;
}

//remove specific comment from given post id
async function removeSavedPostFromAPost(userId, postId) {
  toDelete = await SavedPosts.findOne({userID: userId, postID: postId });
  if (toDelete) {
    await SavedPosts.deleteOne({ _id: toDelete._id });
    return ans.acknowledged;
  } 
  else
    return false;
}

//remove a post by id
async function removePost(postId){
  postToDel = await Posts.deleteOne({_id:postId});
  bumpsToDel = await Bumps.deleteMany({postID:postId});
  commentsToDel = await Comments.deleteMany({postID:postId});
  sharesToDel= await Shares.deleteMany({postID:postId});
  savedToDel= await SavedPosts.deleteMany({postID:postId});
  return true;
}

////change to deleteOne ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ 3times ~~~~~~~~~~~~~~~~~~~~~~ !!!!!!!!!!!!!!!!!!!!!!
async function removeUser(userId){
  userToDel = await User.findOne({_id:userId});
  for (let index = 0; index < userToDel.Bumps.length; index++) {
    bump = await Bumps.findOne({_id:userToDel.Bumps[index]})
    //console.log(`bump: ${bump}`);
    //change to deleteOne
  }
  for (let index = 0; index < userToDel.Comments.length; index++) {
    comment = await Comments.findOne({_id:userToDel.Comments[index]})
    //console.log(`comment: ${comment}`);
  }
  for (let index = 0; index < userToDel.Shares.length; index++) {
    share = await Shares.findOne({_id:userToDel.Shares[index]})
    //console.log(`share: ${share}`);
  }
  //await SavedPosts.deleteMany({userID:userId});
  saved = await SavedPosts.find({userID:userId});
  //console.log(`saved: ${saved}`);
}


module.exports.checkIfEmailExistsInUsers = checkIfEmailExistsInUsers;
module.exports.checkIfGamerTagExistsInUsers = checkIfGamerTagExistsInUsers;
module.exports.whoFollowsTheID = whoFollowsTheID;
module.exports.signIn = signIn;
module.exports.signUp = signUp;
module.exports.checkIfRLprefExists = checkIfRLprefExists;
module.exports.checkIfLOLprefExists = checkIfLOLprefExists;
module.exports.checkIfValprefExists = checkIfValprefExists;
module.exports.whoIDFollows = whoIDFollows;
module.exports.searchUserPref = searchUserPref;
module.exports.addPrefToUser = addPrefToUser;
module.exports.checkIfUserIDExistsInUsers = checkIfUserIDExistsInUsers;
module.exports.countBumpsOnUserID = countBumpsOnUserID;
module.exports.countSharesOnUserID = countSharesOnUserID;
module.exports.countCommentsOnUserID = countCommentsOnUserID;
module.exports.countSavedPostOnUserID = countSavedPostOnUserID;
module.exports.didIdAlreadyBumpedPost = didIdAlreadyBumpedPost;
module.exports.addBumpToPost = addBumpToPost;
module.exports.createPost = createPost;
module.exports.editPost = editPost;
module.exports.addCommentToPost = addCommentToPost;
module.exports.editComment = editComment;
module.exports.addSaveToPost = addSaveToPost;
module.exports.addShareToPost = addShareToPost;
module.exports.addAFollowerToId = addAFollowerToId;
module.exports.removeAFollowerFromId = removeAFollowerFromId;
module.exports.removeBumpFromAPost = removeBumpFromAPost;
module.exports.removeCommentFromAPost=removeCommentFromAPost;
module.exports.removeShareFromAPost=removeShareFromAPost;
module.exports.removeSavedPostFromAPost=removeSavedPostFromAPost;
module.exports.removePost=removePost;
