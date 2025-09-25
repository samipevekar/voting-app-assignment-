import express from 'express';
import { getResults } from '../controllers/resultController.js';

const router = express.Router();

// @route   GET /api/results
// @desc    Get voting results
// @access  Public
router.get('/', getResults);

export default router;