/* eslint-disable import/no-extraneous-dependencies */
import { ObjectId } from 'mongodb';

import mongoose from 'mongoose';

const { Schema } = mongoose;
const matchesSchema = new Schema({
  userID1: { type: ObjectId, required: true },
  userID2: { type: ObjectId, required: true },
  check12: Boolean,
  check21: Boolean,
}, { timestamps: true });

const Matches = mongoose.model('Matches', matchesSchema);
export default Matches;
