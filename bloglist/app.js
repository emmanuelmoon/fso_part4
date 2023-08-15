const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const config = require('./utils/config');
require('express-async-errors');

const app = express();
app.use(cors());
app.use(express.json());

const loginRouter = require('./controllers/login');
const blogsRouter = require('./controllers/blog');
const usersRouter = require('./controllers/user');
const middleware = require('./utils/middleware');
const logger = require('./utils/logger');

mongoose.connect(config.MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDB');
  })
  .catch((error) => {
    logger.error('error connecting to MongoDB:', error.message);
  });

app.use(middleware.tokenExtractor);
app.use(middleware.userExtractor);

mongoose.set('strictQuery', false);
app.use('/api/login', loginRouter);
app.use('/api/users', usersRouter);
app.use('/api/blogs', blogsRouter);

if (process.env.NODE_ENV === 'test') {
  // eslint-disable-next-line global-require
  const testingRouter = require('./controllers/testing');
  app.use('/api/testing', testingRouter);
}

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
