import { ObjectId } from 'mongodb';
import mongoose from 'mongoose';
const Schema= mongoose.Schema;
const commentsschemma=new Schema({
    postID:{type:ObjectId,required:true},
    userID:{type:ObjectId,required:true},
    text: {type: String, required: true },
},{timestamps:true});
const Comments=mongoose.model('Comments',commentsschemma);
export default Comments;