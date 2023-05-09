import { ObjectId } from 'mongodb';
import mongoose from 'mongoose';
const Schema= mongoose.Schema;
const UserSchema=new Schema({
    Email: {type: String, required: true },
    GamerTag: {type: String, required: true },
    Password: {type: String, required: true },
    Gender: {type: String, required: true },
    DoB: {type: Date, required: true},
    RLpref: ObjectId,
    LoLpref: ObjectId,
    Valpref: ObjectId,
    TimeLoggedIn: {type:Number, default:0},
    Discord:{type: String, required: true },
    Country:{type: String, required: true },
    Language:{type: String, required: true },
    Picture:{type: String, required: true }
},{timestamps:true});

const User=mongoose.model('User',UserSchema);
export default User;