/* eslint-disable import/no-extraneous-dependencies */
import { ObjectId } from 'mongodb';

import mongoose from 'mongoose';

const { Schema } = mongoose;
const LoggedInSchema = new Schema({
  userID: { type: ObjectId, required: true },
}, { timestamps: true });
const LoggedIn = mongoose.model('LoggedIn', LoggedInSchema);
export default LoggedIn;
