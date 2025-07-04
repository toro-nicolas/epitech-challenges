import { Schema, model } from 'mongoose';



const ChallengeSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
  },
  language: {
    type: String,
    required: true
  },
  working_files: [{
    filename: { type: String, required: true },
    path: { type: String, required: true }
  }],
  tester: {
    type: String, // path to the tester.zip file
    required: true
  }
}, {
  id: false
});

export const Challenge = model('Challenge', ChallengeSchema);
