/* eslint-disable no-useless-escape */
/* eslint-disable no-unused-vars */
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const { errors, celebrate, Joi } = require('celebrate');
const cors = require('cors');
const { createUser } = require('./controllers/createUser');
const { login } = require('./controllers/login');
const auth = require('./middlewares/auth');
const ErrorNotFound = require('./utils/errorNotFound');
const { requestLogger, errLogger } = require('./middlewares/logger');
require('dotenv').config();

const corsAllowed = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://mesto.yanbyst.nomoreparties.sbs',
  'https://mesto.yanbyst.nomoreparties.sbs',
];

const corsOptions = {
  origin: corsAllowed,
  optionsSuccessStatus: 200,
  credentials: true,
};

const { PORT = 3000 } = process.env;

const app = express();
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

app.use(requestLogger);

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(/[-a-zA-Z0-9@:%_\+.~#?&\/=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&\/=]*)?/i),
  }),
}), createUser);

app.use(auth);

app.use(require('./routes/users'));
app.use(require('./routes/cards'));

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.use(errLogger);

app.use((req, res, next) => {
  next(new ErrorNotFound('404 такой страницы нет'));
});

app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
});
