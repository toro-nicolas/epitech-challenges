import { Schema, model } from 'mongoose';



const ActivitySchema = new Schema({
  title: {
    type: String,
    required: true
  },
  visible: {
    type: Boolean,
    default: true,
    required: true
  },
  description: {
    type: String,
  },
  challenge: {
    type: Schema.Types.ObjectId,
    ref: 'Challenge',
    required: true
  },

  teachers: [{
    type: Schema.Types.ObjectId,
    ref: 'Account',
  }],
  students: [{
    type: Schema.Types.ObjectId,
    ref: 'Account',
  }],
  room: {
    type: String,
  },

  start_date: {
    type: Date,
  },
  end_date: {
    type: Date,
  },
  duration: {
    type: Number,
  },
}, {
  id: false
});

export const Activity = model('Activity', ActivitySchema);
