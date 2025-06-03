import Parser from 'rss-parser';
import { News } from '../models/news.js';

const parser = new Parser();

export const fetchNews = async (req, res) => {
  try {
    // Fetch news from multiple RSS feeds
    const feeds = [
      'https://news.google.com/rss',
      'https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml',
      // Add more RSS feeds as needed
    ];

    const newsItems = [];
    
    for (const feed of feeds) {
      const feedData = await parser.parseURL(feed);
      const items = feedData.items.map(item => ({
        title: item.title,
        content: item.content,
        link: item.link,
        pubDate: item.pubDate,
        source: feedData.title
      }));
      newsItems.push(...items);
    }

    // Use bulkWrite with upsert to handle duplicates
    const bulkOps = newsItems.map(item => ({
      updateOne: {
        filter: { link: item.link },
        update: { $set: item },
        upsert: true
      }
    }));

    await News.bulkWrite(bulkOps);

    // Return latest news
    const latestNews = await News.find()
      .sort({ pubDate: -1 })
      .limit(20);

    res.json(latestNews);
  } catch (error) {
    console.error('Error fetching news:', error);
    res.status(500).json({ error: 'Failed to fetch news' });
  }
};

export const getNewsById = async (req, res) => {
  try {
    const news = await News.findById(req.params.id);
    if (!news) {
      return res.status(404).json({ error: 'News article not found' });
    }
    res.json(news);
  } catch (error) {
    console.error('Error fetching news article:', error);
    res.status(500).json({ error: 'Failed to fetch news article' });
  }
}; 