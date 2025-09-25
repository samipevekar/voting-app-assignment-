import User from '../models/User.js';
import { v4 as uuidv4 } from 'uuid';

export const login = async (req, res) => {
  try {
    const { username } = req.body;

    if (!username || username.trim().length < 2) {
      return res.status(400).json({ error: 'Username must be at least 2 characters long' });
    }

    const sessionId = uuidv4();
    
    // Check if username already exists
    const existingUser = await User.findOne({ username: username.trim() });
    if (existingUser) {
      return res.status(400).json({ error: 'Username already taken' });
    }

    const user = new User({
      username: username.trim(),
      sessionId
    });

    await user.save();

    res.json({
      message: 'Login successful',
      user: {
        username: user.username,
        sessionId: user.sessionId,
        hasVoted: user.hasVoted
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error during login' });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await User.findOne({ sessionId: req.user.sessionId });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      username: user.username,
      hasVoted: user.hasVoted,
      votedFor: user.votedFor
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};