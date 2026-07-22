# URL Shortener

A web-based service that shortens long URLs, redirects visitors, and tracks click
analytics (device type, referrer, timestamps) per link. Built with
Node, Express, and MongoDB.

## Why this project

Most beginner URL shortener tutorials stop at "generate a code, save it, redirect."
This one also handles:
- **Custom aliases** (`/my-link` instead of a random code), with collision checks
- **Link expiry** (links can auto-expire after N days)
- **Click analytics** stored as separate events, not just a counter, so you can
  break down clicks by device type and see recent activity
- **Non-blocking analytics logging** - the redirect doesn't wait on the analytics
  write, so click tracking never slows down the actual redirect

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Create a .env file and Add:
   ```bash
   PORT=5000
   BASE_URL=http://localhost:5000
   CODE_LENGTH=7
   MONGO_URI=[mongo_uri_here]
   ```
   You can use a local MongoDB instance or a free
   [MongoDB Atlas](https://www.mongodb.com/atlas) cluster.
3. Run the server:
   ```bash
   npm run dev
   # or
   npm start
   ```
4. Go to your browser and open `http://localhost:5000`.

## Project structure
```
public/
  index.html       Basic HTML Page
  script.js        Form Validation Script
  style.css        Styling used in HTML Page
src/
  config/db.js          MongoDB connection
  models/Url.js          Short URL schema
  models/Click.js        Individual click event schema
  controllers/           Route handlers / business logic
  routes/                Express route definitions
  middleware/             Centralized error handling
  utils/urlUtils.js       Short code generation, URL validation, UA parsing
server.js                 Entry point
```

## Ideas to extend this further
- Add authentication so users can manage only their own links
- Add rate limiting on `/api/urls` to prevent abuse (pairs well with a
  custom token-bucket rate limiter as its own project)
- Add a cron job to hard-delete expired links after a grace period
- Add geo-IP lookup on clicks for a location breakdown