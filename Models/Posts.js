const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');
const Schema= mongoose.Schema;
const PostSchema=new Schema({
    userID:{type:ObjectId,required:true},
    text: {type: String, required: true },
    picture: {type: String, required: true },
    comments:{type:[ObjectId], required:true},
    bumps:{type:[ObjectId], required:true},
    shares:{type:[ObjectId], required:true}
},{timestamps:true});

const Post=mongoose.model('Post',PostSchema);
module.exports=Post;