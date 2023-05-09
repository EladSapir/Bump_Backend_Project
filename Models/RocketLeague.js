const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');
const Schema= mongoose.Schema;
const RocketLeagueSchema=new Schema({
    Region:{type:String,required:true},
    Mode:{type:String,required:true},
    Rank:{type:String,required:true}
});

const RocketLeague=mongoose.model('RocketLeague',RocketLeagueSchema);
module.exports=RocketLeague;