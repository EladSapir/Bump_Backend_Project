const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');
const Schema= mongoose.Schema;
const BumpsSchema=new Schema({
    postID:{type:ObjectId,required:true},
    userID:{type:ObjectId,required:true}
});
const Bumps=mongoose.model('Bumps',BumpsSchema);
module.exports=Bumps;