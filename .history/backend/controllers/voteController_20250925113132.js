import Vote from '../models/Vote.js';
import User from '../models/User.js';

export const castVote = async (req, res) => {
  try {
    const { option } = req.body;
    const { sessionId } = req.user;

    if (!['optionA', 'optionB', 'optionC'].includes(option)) {
      return res.status(400).json({ error: 'Invalid option' });
    }

    // Check if user has already voted
    const user = await User.findOne({ sessionId });
    if (user.hasVoted) {
      return res.status(400).json({ error: 'You have already voted' });
    }

    // Create vote
    const vote = new Vote({
      option,
      username: user.username,
      sessionId
    });

    await vote.save();

    // Update user voting status
    user.hasVoted = true;
    user.votedFor = option;
    await user.save();

    res.json({ 
      message: 'Vote cast successfully', 
      vote: { option, username: user.username }
    });

  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: 'You have already voted' });
    }
    res.status(500).json({ error: 'Server error during voting' });
  }
};