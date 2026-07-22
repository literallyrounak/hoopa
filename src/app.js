require('express-async-errors');
const path = require('path');
const express = require('express');
const urlRoutes = require('./routes/urlRoutes');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

function createApp() {
  const app = express();

  app.use(express.json());

  app.get('/health', (req, res) => res.json({ status: 'ok' }));

  app.use(express.static(path.join(__dirname, '..', 'public')));

  app.use('/', urlRoutes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

module.exports = createApp;
