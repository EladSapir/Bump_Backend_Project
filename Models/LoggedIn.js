const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');
const Schema= mongoose.Schema;
const LoggedInSchema=new Schema({
    userID:{type:ObjectId,required:true}
});

const LoggedIn=mongoose.model('LoggedIn',LoggedInSchema);
module.exports=LoggedIn;