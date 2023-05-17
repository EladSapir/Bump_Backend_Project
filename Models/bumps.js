/* eslint-disable import/no-extraneous-dependencies */
import { ObjectId } from 'mongodb';

import mongoose from 'mongoose';

const { Schema } = mongoose;
const BumpsSchema = new Schema({
  postID: { type: ObjectId, required: true },
  userID: { type: ObjectId, required: true },
});
const Bumps = mongoose.model('Bumps', BumpsSchema);
export default Bumps;
