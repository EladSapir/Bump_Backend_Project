/* eslint-disable import/no-extraneous-dependencies */
import { ObjectId } from 'mongodb';

import mongoose from 'mongoose';

const { Schema } = mongoose;
const PostSchema = new Schema({
  userID: { type: ObjectId, required: true },
  text: { type: String, required: true },
  picture: { type: String, required: true },
  comments: { type: [ObjectId], required: true },
  bumps: { type: [ObjectId], required: true },
  shares: { type: [ObjectId], required: true },
}, { timestamps: true });

const Post = mongoose.model('Post', PostSchema);
export default Post;
