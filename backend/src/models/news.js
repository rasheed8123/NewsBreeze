import mongoose from 'mongoose';

const newsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  link: {
    type: String,
    required: true,
    unique: true
  },
  pubDate: {
    type: Date,
    required: true
  },
  source: {
    type: String,
    required: true
  },
  summary: {
    type: String
  },
  audioUrl: {
    type: String
  }
}, {
  timestamps: true
});

// Create index for faster queries
newsSchema.index({ pubDate: -1 });
newsSchema.index({ link: 1 }, { unique: true });

export const News = mongoose.model('News', newsSchema); 