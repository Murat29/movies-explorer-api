require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { celebrate, Joi, errors } = require('celebrate');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const appRouter = require('./routes/index');
const { createUser, login } = require('./controllers/users');
const auth = require('./middlewares/auth');
const { limiter } = require('./middlewares/limiter');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const NotFoundError = require('./errors/not-found-err');
const {
  theRequestedResourceIsNotFound,
  anErrorOccurredOnTheServer,
} = require('./errors/error-messages');

const { PORT = 3000, ADDRESS_DB = 'devdb' } = process.env;
const app = express();

app.use(requestLogger);
app.use(limiter);

const corsOptions = {
  origin: ['http://localhost:3000'],
  credentials: true,
};
app.use('*', cors(corsOptions));
app.use(helmet());

mongoose.connect(`mongodb://localhost:27017/${ADDRESS_DB}`, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(4),
    }),
  }),
  login,
);

app.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      email: Joi.string().required().email(),
      password: Joi.string().required().min(4),
    }),
  }),
  createUser,
);

app.use(auth);
app.use('/', appRouter);

app.use(() => {
  throw new NotFoundError(theRequestedResourceIsNotFound);
});

app.use(errorLogger);
app.use(errors());
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  if (err.name === 'CastError' || err.name === 'ValidationError') {
    return res.status(400).send({ message: err.message });
  }
  const { statusCode = 500, message } = err;
  return res.status(statusCode).send({
    message: statusCode === 500 ? anErrorOccurredOnTheServer : message,
  });
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});
