import mongoose from 'mongoose';

const { Schema } = mongoose;
const LeagueOfLegendsSchema = new Schema({
  Region: { type: String, required: true },
  Mode: { type: String, required: true },
  Role: { type: String, required: true },
  Rank: { type: String, required: true },
});

const LeagueOfLegends = mongoose.model('LeagueOfLegends', LeagueOfLegendsSchema);
export default LeagueOfLegends;
