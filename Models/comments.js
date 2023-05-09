const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');
const Schema= mongoose.Schema;
const commentsschemma=new Schema({
    postID:{type:ObjectId,required:true},
    userID:{type:ObjectId,required:true},
    text: {type: String, required: true },
},{timestamps:true});
const Comments=mongoose.model('Comments',commentsschemma);
module.exports=Comments;