# Logging Middleware

A reusable Express.js logging middleware built with [Winston](https://github.com/winstonjs/winston) that provides structured, multi-transport request/response logging.

## Features

- 📋 Logs every incoming HTTP request with method, URL, IP, and User-Agent
- ✅ Logs every response with status code and duration
- 🎨 Color-coded console output by log level
- 📁 Persistent file logging (error.log, combined.log, exceptions.log)
- ❌ Dedicated error logging middleware
- ⚙️ Configurable log level via `LOG_LEVEL` environment variable

## Installation

```bash
cd logging_middleware
npm install
```

## Usage

```js
const express = require('express');
const { loggingMiddleware, errorLoggingMiddleware } = require('./middleware');

const app = express();

// Register logging middleware BEFORE routes
app.use(loggingMiddleware);

// Your routes here
app.get('/', (req, res) => res.send('Hello World'));

// Register error logging AFTER routes
app.use(errorLoggingMiddleware);
```

## File Structure

```
logging_middleware/
├── package.json       # Dependencies and scripts
├── logger.js          # Winston logger configuration
├── middleware.js      # Express middleware functions
└── README.md          # This file
```

## Environment Variables

| Variable    | Default | Description               |
|-------------|---------|---------------------------|
| `LOG_LEVEL` | `info`  | Minimum log level to emit |

## Log Levels

| Level   | Use case                        |
|---------|---------------------------------|
| `error` | Runtime errors (5xx responses)  |
| `warn`  | Client errors (4xx responses)   |
| `info`  | Standard requests               |
| `debug` | Detailed debugging information  |
