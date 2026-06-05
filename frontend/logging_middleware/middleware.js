const logger = require('./logger');

/**
 * Frontend API request logging middleware (for Express-based SSR / API proxy)
 */
const loggingMiddleware = (req, res, next) => {
  const startTime = Date.now();
  logger.info(`[FE] --> ${req.method} ${req.url}`);

  res.on('finish', () => {
    const duration = Date.now() - startTime;
    logger.info(`[FE] <-- ${req.method} ${req.url} ${res.statusCode} (${duration}ms)`);
  });

  next();
};

const errorLoggingMiddleware = (err, req, res, next) => {
  logger.error(`[FE] Error on ${req.method} ${req.url}: ${err.message}`);
  next(err);
};

module.exports = { loggingMiddleware, errorLoggingMiddleware };
