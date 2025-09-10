require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

const SpotifyClient = require('./services/spotifyClient');
const YouTubeClient = require('./services/youtubeClient');
const searchRoutes = require('./routes/search');
const youtubeRoutes = require('./routes/youtube');

const app = express();
const PORT = process.env.PORT || 3000;

// Validate required environment variables
if (!process.env.SPOTIFY_CLIENT_ID || !process.env.SPOTIFY_CLIENT_SECRET) {
  console.error('Error: Missing required Spotify environment variables.');
  console.error('Please set SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET in your .env file');
  process.exit(1);
}

if (!process.env.YOUTUBE_API_KEY) {
  console.error('Error: Missing required YouTube environment variable.');
  console.error('Please set YOUTUBE_API_KEY in your .env file');
  process.exit(1);
}

// Initialize Spotify client
const spotifyClient = new SpotifyClient(
  process.env.SPOTIFY_CLIENT_ID,
  process.env.SPOTIFY_CLIENT_SECRET
);

// Initialize YouTube client
const youtubeClient = new YouTubeClient(
  process.env.YOUTUBE_API_KEY
);

// Make clients available to all routes
app.locals.spotifyClient = spotifyClient;
app.locals.youtubeClient = youtubeClient;

// Middleware
app.use(helmet()); // Security headers
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0'
  });
});

// API routes
app.use('/api/search', searchRoutes);
app.use('/api/youtube', youtubeRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Spotify API Skeleton Server',
    endpoints: {
      health: 'GET /health',
      search: 'GET /api/search?q=query&type=track',
      track: 'GET /api/search/track/:id',
      artist: 'GET /api/search/artist/:id',
      artistTopTracks: 'GET /api/search/artist/:id/top-tracks',
      youtubeSearch: 'GET /api/youtube/search?q=query&type=video',
      youtubeVideo: 'GET /api/youtube/video/:id',
      youtubeChannel: 'GET /api/youtube/channel/:id',
      youtubePlaylist: 'GET /api/youtube/playlist/:id'
    },
    documentation: 'https://developer.spotify.com/documentation/web-api/'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Not found',
    path: req.path,
    method: req.method
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// Initialize Spotify client on startup
async function initializeSpotifyClient() {
  try {
    console.log('Initializing Spotify API client...');
    await spotifyClient.initialize();
    console.log('✅ Successfully initialized Spotify API client');
  } catch (error) {
    console.error('❌ Failed to initialize Spotify API client:', error.message);
    console.error('Please check your SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET');
    process.exit(1); // Exit if we can't initialize Spotify client
  }
}

// Start server
async function startServer() {
  // Initialize Spotify client first
  await initializeSpotifyClient();
  
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔗 API Base URL: http://localhost:${PORT}`);
  });
}

startServer().catch(error => {
  console.error('Failed to start server:', error);
  process.exit(1);
});

module.exports = app;
