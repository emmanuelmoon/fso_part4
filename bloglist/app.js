const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const config = require('./utils/config');
require('express-async-errors');

const app = express();
app.use(express.json());

const blogsRouter = require('./controllers/blog');
const usersRouter = require('./controllers/user');
const middleware = require('./utils/middleware');
const logger = require('./utils/logger');

mongoose.set('strictQuery', false);
app.use('/api/users', usersRouter);
app.use('/api/blogs', blogsRouter);

mongoose.connect(config.MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDB');
  })
  .catch((error) => {
    logger.error('error connecting to MongoDB:', error.message);
  });

app.use(cors());
app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
