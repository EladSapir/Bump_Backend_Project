/* eslint-disable import/no-extraneous-dependencies */
import { ObjectId } from 'mongodb';

import mongoose from 'mongoose';

const { Schema } = mongoose;
const SharesSchema = new Schema({
  postID: { type: ObjectId, required: true },
  userID: { type: ObjectId, required: true },
  Scomments: { type: [ObjectId], required: true },
  Sbumps: { type: [ObjectId], required: true },
}, { timestamps: true });
const Shares = mongoose.model('Shares', SharesSchema);
export default Shares;
