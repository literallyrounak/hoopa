const Url = require('../models/Url');
const Click = require('../models/Click');
const { generateShortCode, isValidUrl, classifyDevice } = require('../utils/urlUtils');

const BASE_URL = process.env.BASE_URL || 'http://localhost:5000';


async function createShortUrl(req, res) {
  const { longUrl, customAlias, expiresInDays } = req.body;

  if (!longUrl || !isValidUrl(longUrl)) {
    return res.status(400).json({ error: 'A valid longUrl (http/https) is required.' });
  }

  let shortCode = customAlias ? customAlias.trim() : generateShortCode();

  if (customAlias) {
    const aliasTaken = await Url.findOne({ shortCode });
    if (aliasTaken) {
      return res.status(409).json({ error: `Alias "${shortCode}" is already taken.` });
    }
  } else {
    let attempts = 0;
    while (await Url.findOne({ shortCode })) {
      shortCode = generateShortCode();
      attempts++;
      if (attempts > 5) {
        return res.status(500).json({ error: 'Could not generate a unique short code, try again.' });
      }
    }
  }

  const expiresAt = expiresInDays
    ? new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000)
    : null;

  const url = await Url.create({
    shortCode,
    longUrl,
    isCustomAlias: Boolean(customAlias),
    expiresAt,
  });

  return res.status(201).json({
    shortUrl: `${BASE_URL}/${url.shortCode}`,
    shortCode: url.shortCode,
    longUrl: url.longUrl,
    expiresAt: url.expiresAt,
    createdAt: url.createdAt,
  });
}


async function redirectToLongUrl(req, res) {
  const { code } = req.params;

  const url = await Url.findOne({ shortCode: code });

  if (!url) {
    return res.status(404).json({ error: 'Short URL not found.' });
  }

  if (url.isExpired()) {
    return res.status(410).json({ error: 'This short URL has expired.' });
  }


  logClick(url, req).catch((err) => console.error('Failed to log click:', err));

  Url.updateOne({ _id: url._id }, { $inc: { clickCount: 1 } }).catch((err) =>
    console.error('Failed to increment click count:', err)
  );

  return res.redirect(302, url.longUrl);
}

async function logClick(url, req) {
  await Click.create({
    url: url._id,
    referrer: req.get('referer') || null,
    userAgent: req.get('user-agent') || null,
    deviceType: classifyDevice(req.get('user-agent')),
  });
}

async function getUrlStats(req, res) {
  const { code } = req.params;

  const url = await Url.findOne({ shortCode: code });
  if (!url) {
    return res.status(404).json({ error: 'Short URL not found.' });
  }

  const clicks = await Click.find({ url: url._id }).sort({ timestamp: -1 }).limit(1000);

  const deviceBreakdown = clicks.reduce((acc, click) => {
    acc[click.deviceType] = (acc[click.deviceType] || 0) + 1;
    return acc;
  }, {});

  return res.json({
    shortCode: url.shortCode,
    longUrl: url.longUrl,
    totalClicks: url.clickCount,
    createdAt: url.createdAt,
    expiresAt: url.expiresAt,
    deviceBreakdown,
    recentClicks: clicks.slice(0, 20).map((c) => ({
      timestamp: c.timestamp,
      referrer: c.referrer,
      deviceType: c.deviceType,
    })),
  });
}

module.exports = { createShortUrl, redirectToLongUrl, getUrlStats };
