import mongoose from 'mongoose';

const voteSchema = new mongoose.Schema({
  option: {
    type: String,
    required: true,
    enum: ['optionA', 'optionB', 'optionC']
  },
  username: {
    type: String,
    required: true
  },
  sessionId: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});


voteSchema.index({ sessionId: 1 }, { unique: true });

export default mongoose.model('Vote', voteSchema);