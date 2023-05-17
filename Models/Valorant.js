import mongoose from 'mongoose';

const { Schema } = mongoose;
const ValorantSchema = new Schema({
  Server: { type: String, required: true },
  Rank: { type: String, required: true },
  Role: { type: String, required: true },
});

const Valorant = mongoose.model('Valorant', ValorantSchema);
export default Valorant;
