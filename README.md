# NewsBreeze - Celebrity-Powered Audio News Reader

A modern news aggregation app that fetches latest headlines, summarizes them, and reads them in celebrity voices.

## Features

- Real-time news aggregation from multiple sources
- AI-powered text summarization
- Celebrity voice synthesis using voice cloning
- Clean, modern UI with audio playback

## Tech Stack

- Frontend: React.js, Tailwind CSS
- Backend: Node.js, Express
- AI Models: Hugging Face (Summarization), Coqui TTS (Voice Cloning)
- APIs: RSS Feeds for news aggregation

## Setup Instructions

1. Clone the repository
2. Install frontend dependencies:
   ```bash
   cd client
   npm install
   ```
3. Install backend dependencies:
   ```bash
   cd server
   npm install
   ```
4. Create a `.env` file in the server directory with your API keys:
   ```
   HUGGINGFACE_API_KEY=your_key_here
   ```
5. Start the development servers:
   ```bash
   # Start backend server
   cd server
   npm run dev

   # Start frontend in a new terminal
   cd client
   npm start
   ```

## Project Structure

```
newsbreeze/
├── client/           # React frontend
├── server/           # Node.js backend
└── README.md
```
