import React, { useState, useEffect } from 'react';
import { Container, Grid, Paper, Typography, CircularProgress, Box } from '@mui/material';
import { AudioPlayer } from 'react-audio-player';
import axios from 'axios';

function App() {
  const [newsItems, setNewsItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedNews, setSelectedNews] = useState(null);
  const [summary, setSummary] = useState('');
  const [audioUrl, setAudioUrl] = useState('');

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/news');
      setNewsItems(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching news:', error);
      setLoading(false);
    }
  };

  const handleNewsClick = async (newsItem) => {
    setSelectedNews(newsItem);
    
    // Generate summary
    try {
      const summaryResponse = await axios.post('http://localhost:5000/api/summarize', {
        text: newsItem.title + (newsItem.content || '')
      });
      setSummary(summaryResponse.data.summary);
      
      // Generate audio
      try {
        const audioResponse = await axios.post('http://localhost:5000/api/generate-audio', {
          text: summaryResponse.data.summary,
          voiceId: 'celebrity1' // TODO: Implement voice selection
        });
        setAudioUrl(audioResponse.data.audioUrl);
      } catch (error) {
        console.error('Error generating audio:', error);
      }
    } catch (error) {
      console.error('Error generating summary:', error);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom>
        NewsBreeze
      </Typography>

      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h5" gutterBottom>
                Latest News
              </Typography>
              {newsItems.map((item) => (
                <Paper
                  key={item.guid}
                  sx={{ p: 2, mb: 2, cursor: 'pointer' }}
                  onClick={() => handleNewsClick(item)}
                >
                  <Typography variant="h6" gutterBottom>
                    {item.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {new Date(item.pubDate).toLocaleDateString()}
                  </Typography>
                </Paper>
              ))}
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            {selectedNews && (
              <Paper sx={{ p: 2, height: '100%' }}>
                <Typography variant="h5" gutterBottom>
                  {selectedNews.title}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {summary || 'Generating summary...'}
                </Typography>
                {audioUrl && (
                  <Box mt={2}>
                    <AudioPlayer
                      src={audioUrl}
                      title="News Summary"
                      autoPlay={false}
                    />
                  </Box>
                )}
              </Paper>
            )}
          </Grid>
        </Grid>
      )}
    </Container>
  );
}

export default App;
