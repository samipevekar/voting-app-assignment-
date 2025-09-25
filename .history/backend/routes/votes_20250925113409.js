import express from 'express';
import { castVote } from '../controllers/voteController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// @route   POST /api/votes/cast
// @desc    Cast a vote
// @access  Private
router.post('/cast', authenticate, castVote);

export default router;