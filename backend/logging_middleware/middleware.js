const logger = require('./logger');

/**
 * HTTP Request/Response logging middleware for Express
 * Logs method, URL, status code, response time, and IP address
 */
const loggingMiddleware = (req, res, next) => {
  const startTime = Date.now();
  const { method, url, ip, headers } = req;

  // Log incoming request
  logger.info(`Incoming Request - Method: ${method} | URL: ${url} | IP: ${ip} | User-Agent: ${headers['user-agent']}`);

  // Override res.end to capture response details
  const originalEnd = res.end.bind(res);
  res.end = (...args) => {
    const duration = Date.now() - startTime;
    const { statusCode } = res;

    const logLevel = statusCode >= 500 ? 'error' : statusCode >= 400 ? 'warn' : 'info';

    logger[logLevel](
      `Response - Method: ${method} | URL: ${url} | Status: ${statusCode} | Duration: ${duration}ms | IP: ${ip}`
    );

    return originalEnd(...args);
  };

  next();
};

/**
 * Error logging middleware
 * Must be registered AFTER routes to catch errors
 */
const errorLoggingMiddleware = (err, req, res, next) => {
  logger.error(`Error - ${err.message}`, { stack: err.stack, url: req.url, method: req.method });
  next(err);
};

module.exports = { loggingMiddleware, errorLoggingMiddleware };
