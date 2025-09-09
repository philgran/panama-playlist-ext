# Spotify API Skeleton App

A Node.js skeleton application for integrating with the Spotify Web API. This app demonstrates proper authentication handling using the Client Credentials flow and includes example endpoints for searching and retrieving music data.

## Features

- ✅ Automatic Spotify API authentication with token refresh
- ✅ Search functionality for tracks, artists, albums, and playlists
- ✅ Individual resource endpoints (tracks, artists)
- ✅ Error handling and validation
- ✅ Environment-based configuration
- ✅ Security middleware (Helmet, CORS)
- ✅ Request logging

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Spotify Developer Account

## Setup

### 1. Get Spotify API Credentials

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Log in or create an account
3. Click "Create App"
4. Fill in app details (name, description)
5. Accept terms and create the app
6. Copy your **Client ID** and **Client Secret**

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Copy the example environment file and add your credentials:

```bash
cp .env.example .env
```

Edit `.env` and add your Spotify credentials:

```
SPOTIFY_CLIENT_ID=your_actual_client_id
SPOTIFY_CLIENT_SECRET=your_actual_client_secret
PORT=3000
NODE_ENV=development
```

### 4. Start the Application

**Development mode (with auto-restart):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will start on `http://localhost:3000` (or your configured PORT).

## API Endpoints

### Health Check
- **GET** `/health` - Server health status

### Search
- **GET** `/api/search?q=query&type=track&limit=20` - Search Spotify catalog
  - **Parameters:**
    - `q` (required): Search query
    - `type` (optional): `track`, `artist`, `album`, `playlist` (default: `track`)
    - `limit` (optional): Number of results (1-50, default: 20)
    - `offset` (optional): Pagination offset (default: 0)
    - `market` (optional): Market code (default: 'US')

### Individual Resources
- **GET** `/api/search/track/:id` - Get track by Spotify ID
- **GET** `/api/search/artist/:id` - Get artist by Spotify ID
- **GET** `/api/search/artist/:id/top-tracks` - Get artist's top tracks

## Example Usage

### Search for tracks
```bash
curl "http://localhost:3000/api/search?q=bohemian%20rhapsody&type=track&limit=5"
```

### Search for artists
```bash
curl "http://localhost:3000/api/search?q=queen&type=artist"
```

### Get specific track
```bash
curl "http://localhost:3000/api/search/track/4u7EnebtmKWzUH433cf5Qv"
```

### Response Format
```json
{
  "success": true,
  "query": "bohemian rhapsody",
  "type": "track",
  "results": {
    "tracks": {
      "items": [...],
      "total": 1000,
      "limit": 20,
      "offset": 0
    }
  }
}
```

## Project Structure

```
├── src/
│   ├── services/
│   │   └── spotifyClient.js    # Spotify API client with auth handling
│   ├── routes/
│   │   └── search.js           # Search and resource endpoints
│   └── server.js               # Express server setup
├── .env.example                # Environment variables template
├── package.json
└── README.md
```

## Key Components

### SpotifyClient (`src/services/spotifyClient.js`)
- Handles Client Credentials authentication flow
- Automatic token refresh when expired
- Makes authenticated requests to Spotify API
- Provides convenient methods for common operations

### Authentication Flow
The app uses Spotify's Client Credentials flow, which is suitable for:
- Server-to-server authentication
- Accessing public data (search, track info, etc.)
- No user authentication required

**Note:** This flow doesn't provide access to user-specific data. For user authentication, you'd need to implement the Authorization Code flow.

## Error Handling

The application includes comprehensive error handling:
- Invalid API credentials
- Malformed requests
- Spotify API errors
- Network issues
- Token expiration (automatic retry)

## Development

### Adding New Endpoints
1. Create new route handlers in `src/routes/`
2. Use `req.app.locals.spotifyClient` to access the authenticated client
3. Add routes to `src/server.js`

### Environment Variables
- `SPOTIFY_CLIENT_ID`: Your Spotify app's client ID
- `SPOTIFY_CLIENT_SECRET`: Your Spotify app's client secret
- `PORT`: Server port (default: 3000)
- `NODE_ENV`: Environment (development/production)

## Troubleshooting

### "Failed to authenticate with Spotify API"
- Verify your client ID and secret are correct
- Ensure your Spotify app is not in development mode restrictions
- Check your internet connection

### "Invalid client" error
- Double-check your credentials in `.env`
- Make sure there are no extra spaces or characters
- Verify the app exists in your Spotify Developer Dashboard

## Next Steps

This skeleton provides a solid foundation. Consider adding:

- Rate limiting middleware
- Database integration for caching
- User authentication (Authorization Code flow)
- Additional Spotify endpoints
- Tests
- API documentation (Swagger/OpenAPI)
- Logging improvements

## Resources

- [Spotify Web API Documentation](https://developer.spotify.com/documentation/web-api/)
- [Spotify App Settings](https://developer.spotify.com/dashboard)
- [Client Credentials Flow Guide](https://developer.spotify.com/documentation/general/guides/authorization/client-credentials/)

## License

MIT