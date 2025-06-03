import { HfInference } from '@huggingface/inference';
import { News } from '../models/news.js';

// Initialize without API key for free models
const hf = new HfInference();

export const summarizeArticle = async (req, res) => {
  try {
    const { articleId } = req.body;

    // Get article from database
    const article = await News.findById(articleId);
    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }

    console.log('Attempting to summarize with t5-small model...');
    
    // Use t5-small model which is free and doesn't require authentication
    const result = await hf.textGeneration({
      model: 't5-small',
      inputs: `summarize: ${article.content}`,
      parameters: {
        max_length: 150,
        min_length: 30,
        do_sample: false,
        temperature: 0.7
      }
    });

    if (!result || !result.generated_text) {
      throw new Error('Failed to generate summary');
    }

    // Update article with summary
    article.summary = result.generated_text;
    await article.save();

    console.log('Successfully generated summary');
    res.json({ summary: article.summary });
  } catch (error) {
    console.error('Error summarizing article:', error);
    res.status(500).json({ 
      error: 'Failed to summarize article',
      details: error.message
    });
  }
}; 