const express = require('express');
const { createShortUrl, redirectToLongUrl, getUrlStats } = require('../controllers/urlController');

const router = express.Router();

// API routes - namespaced under /api/urls so they never collide with a short code
router.post('/api/urls', createShortUrl);
router.get('/api/urls/:code/stats', getUrlStats);

// Public redirect route - this MUST be registered after /api routes
router.get('/:code', redirectToLongUrl);

module.exports = router;
