import { ObjectId } from 'mongodb';
import mongoose from 'mongoose';
const Schema= mongoose.Schema;
const matchesSchema=new Schema({
    userID1:{type:ObjectId,required:true},
    userID2:{type:ObjectId,required:true},
    check12:{type:Boolean,default:true},
    check21:Boolean
},{timestamps:true});

const Matches=mongoose.model('Matches',matchesSchema);
export default Matches;