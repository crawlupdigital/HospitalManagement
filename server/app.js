const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const { errorHandler } = require('./middleware/error.middleware');
const { eventCapture } = require('./middleware/eventCapture.middleware');

const routes = require('./routes');

const app = express();

// Middleware
app.use(cors(require('./config/cors')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Static files (uploads)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Analytics Auto-Capture Middleware
app.use(eventCapture());

// API Routes
app.use('/api/v1', routes);

// Error Handling (Must be last)
app.use(errorHandler);

module.exports = app;
