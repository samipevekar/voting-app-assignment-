import User from '../models/User.js';

export const authenticate = async (req, res, next) => {
  try {
    const sessionId = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!sessionId) {
      return res.status(401).json({ error: 'No session token provided' });
    }

    const user = await User.findOne({ sessionId });
    if (!user) {
      return res.status(401).json({ error: 'Invalid session token' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({ error: 'Authentication error' });
  }
};