import { Schema, model } from 'mongoose';



const AccountSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  level: {
    type: Number,
    default: 0
  }
}, { id: false });

export const Account = model('Account', AccountSchema);
