const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');
const Schema= mongoose.Schema;
const ValorantSchema=new Schema({
    Server:{type:String,required:true},
    Rank:{type:String,required:true},
    Role:{type:String,required:true}
});

const Valorant=mongoose.model('Valorant',ValorantSchema);
module.exports=Valorant;