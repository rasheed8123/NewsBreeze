import express from 'express';
import { fetchNews, getNewsById } from '../controllers/newsController.js';

const router = express.Router();

// Get all news
router.get('/', fetchNews);

// Get specific news article
router.get('/:id', getNewsById);

export const newsRoutes = router; 