const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');
const Schema= mongoose.Schema;
const FollowsSchema=new Schema({
    userID1:{type:ObjectId,required:true},
    userID2:{type:ObjectId,required:true}
});

const Follows=mongoose.model('Follows',FollowsSchema);
module.exports=Follows;