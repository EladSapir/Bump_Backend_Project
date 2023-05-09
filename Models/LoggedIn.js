import { ObjectId } from 'mongodb';
import mongoose from 'mongoose';
const Schema= mongoose.Schema;
const LoggedInSchema=new Schema({
    userID:{type:ObjectId,required:true}
});

const LoggedIn=mongoose.model('LoggedIn',LoggedInSchema);
export default LoggedIn;