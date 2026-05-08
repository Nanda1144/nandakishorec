'use strict';

const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 600 }); // Default 10 minutes

/**
 * Cache middleware to store API responses.
 * @param {number} duration - Cache duration in seconds.
 */
const cacheMiddleware = (duration) => (req, res, next) => {
  // Only cache GET requests
  if (req.method !== 'GET') {
    return next();
  }

  const key = req.originalUrl || req.url;
  const cachedResponse = cache.get(key);

  if (cachedResponse) {
    return res.status(200).send(cachedResponse);
  }

  // Intercept the response to store it in cache
  res.sendResponse = res.send;
  res.send = (body) => {
    cache.set(key, body, duration);
    res.sendResponse(body);
  };

  next();
};

/**
 * Clear specific cache key.
 */
const clearCache = (key) => {
  cache.del(key);
};

module.exports = { cacheMiddleware, clearCache };
