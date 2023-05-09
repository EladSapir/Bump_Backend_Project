import { ObjectId } from 'mongodb';
import mongoose from 'mongoose';
const Schema= mongoose.Schema;
const userPrefSchema=new Schema({
    userID:{type:ObjectId,required:true},
    game:{type:Number,emun:[0,1,2]},
    prefID:{type:ObjectId,required:true},
},{timestamps:true});

const UserPref=mongoose.model('UserPref',userPrefSchema);
export default UserPref;