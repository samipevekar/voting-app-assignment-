import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 2,
    maxlength: 50
  },
  sessionId: {
    type: String,
    required: true,
    unique: true
  },
  hasVoted: {
    type: Boolean,
    default: false
  },
  votedFor: {
    type: String,
    enum: ['optionA', 'optionB', 'optionC', null],
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 86400 // 24 hours in seconds
  }
});

export default mongoose.model('User', userSchema);