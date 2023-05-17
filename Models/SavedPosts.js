/* eslint-disable import/no-extraneous-dependencies */
import { ObjectId } from 'mongodb';

import mongoose from 'mongoose';

const { Schema } = mongoose;
const savedpostsSchema = new Schema({
  postID: { type: ObjectId, required: true },
  userID: { type: ObjectId, required: true },
});
const Savedposts = mongoose.model('Savedposts', savedpostsSchema);
export default Savedposts;
