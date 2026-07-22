const { nanoid } = require('nanoid');

const CODE_LENGTH = Number(process.env.CODE_LENGTH) || 7;

function generateShortCode() {
  return nanoid(CODE_LENGTH);
}

function isValidUrl(candidate) {
  try {
    const parsed = new URL(candidate);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch (err) {
    return false;
  }
}

function classifyDevice(userAgentString = '') {
  const ua = userAgentString.toLowerCase();
  if (!ua) return 'unknown';
  if (/bot|crawler|spider|curl|wget/.test(ua)) return 'bot';
  if (/mobile|android|iphone/.test(ua)) return 'mobile';
  if (/tablet|ipad/.test(ua)) return 'tablet';
  return 'desktop';
}

module.exports = { generateShortCode, isValidUrl, classifyDevice };