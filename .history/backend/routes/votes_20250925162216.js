import express from 'express';
import { castVote } from '../controllers/voteController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.post('/cast', authenticate, castVote);

export default router;