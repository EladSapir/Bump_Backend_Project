import { ObjectId } from 'mongodb';
import mongoose from 'mongoose';
const Schema= mongoose.Schema;
const FollowsSchema=new Schema({
    userID1:{type:ObjectId,required:true},
    userID2:{type:ObjectId,required:true}
});

const Follows=mongoose.model('Follows',FollowsSchema);
export default Follows;