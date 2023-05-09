const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');
const Schema= mongoose.Schema;
const LeagueOfLegendsSchema=new Schema({
    Region:{type:String,required:true},
    Mode:{type:String,required:true},
    Role:{type:String,required:true},
    Rank:{type:String,required:true}
});

const LeagueOfLegends=mongoose.model('LeagueOfLegends',LeagueOfLegendsSchema);
module.exports=LeagueOfLegends;