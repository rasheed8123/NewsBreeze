import express from 'express';
import { summarizeArticle } from '../controllers/summarizeController.js';

const router = express.Router();

// Summarize article
router.post('/', summarizeArticle);

export const summarizeRoutes = router; 