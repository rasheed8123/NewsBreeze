require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const Parser = require('rss-parser');
const parser = new Parser();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Hugging Face API endpoint
const HF_API_URL = 'https://api-inference.huggingface.co/models/Falconsai/text_summarization';

// News sources
const NEWS_SOURCES = [
  'https://rssfeeds.cnn.com/rss/edition.rss',
  'https://feeds.bbci.co.uk/news/rss.xml',
  'https://rssfeeds.usatoday.com/UsatodaycomRSSFeed',
];

// Get news headlines
app.get('/api/news', async (req, res) => {
  try {
    const newsItems = [];
    for (const source of NEWS_SOURCES) {
      const feed = await parser.parseURL(source);
      newsItems.push(...feed.items);
    }
    res.json(newsItems);
  } catch (error) {
    console.error('Error fetching news:', error);
    res.status(500).json({ error: 'Failed to fetch news' });
  }
});

// Summarize text
app.post('/api/summarize', async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    const response = await axios.post(HF_API_URL, {
      inputs: text
    }, {
      headers: {
        Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`
      }
    });

    res.json({ summary: response.data[0].summary_text });
  } catch (error) {
    console.error('Error summarizing text:', error);
    res.status(500).json({ error: 'Failed to summarize text' });
  }
});

// Generate audio
app.post('/api/generate-audio', async (req, res) => {
  try {
    const { text, voiceId } = req.body;
    if (!text || !voiceId) {
      return res.status(400).json({ error: 'Text and voice ID are required' });
    }

    // TODO: Implement voice cloning using Coqui TTS
    // This will require setting up the TTS model and generating audio
    res.json({
      audioUrl: 'https://example.com/audio.mp3',
      voiceId
    });
  } catch (error) {
    console.error('Error generating audio:', error);
    res.status(500).json({ error: 'Failed to generate audio' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
