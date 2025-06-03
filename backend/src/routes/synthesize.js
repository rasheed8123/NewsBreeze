import express from 'express';
import { synthesizeVoice } from '../controllers/synthesizeController.js';

const router = express.Router();

// Synthesize voice
router.post('/', synthesizeVoice);

export const synthesizeRoutes = router; 