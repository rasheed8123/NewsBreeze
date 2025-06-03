import { HfInference } from '@huggingface/inference';
import { News } from '../models/news.js';

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

export const synthesizeVoice = async (req, res) => {
  try {
    const { articleId, voiceId } = req.body;

    // Get article from database
    const article = await News.findById(articleId);
    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }

    // Use summary if available, otherwise use title
    const textToSynthesize = article.summary || article.title;

    // Generate audio using Coqui XTTS-v2
    const audio = await hf.textToSpeech({
      model: 'coqui/xtts-v2',
      inputs: textToSynthesize,
      parameters: {
        voice_preset: voiceId,
        language: 'en'
      }
    });

    // Convert audio to base64
    const audioBase64 = Buffer.from(audio).toString('base64');

    // Update article with audio URL (in a real app, you'd upload this to a storage service)
    article.audioUrl = `data:audio/mpeg;base64,${audioBase64}`;
    await article.save();

    res.json({ audioUrl: article.audioUrl });
  } catch (error) {
    console.error('Error synthesizing voice:', error);
    res.status(500).json({ error: 'Failed to synthesize voice' });
  }
}; 