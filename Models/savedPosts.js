import { ObjectId } from 'mongodb';
import mongoose from 'mongoose';
const Schema= mongoose.Schema;
const savedpostsSchema=new Schema({
    postID:{type:ObjectId,required:true},
    userID:{type:ObjectId,required:true}
});
const Savedposts=mongoose.model('Savedposts',savedpostsSchema);
export default Savedposts;

