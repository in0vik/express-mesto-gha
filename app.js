const express = require('express');
const helmet = require('helmet');
const ms = require('ms');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const { errors: celebrateErrors } = require('celebrate');
const { routes } = require('./routes');
const STATUS_CODE = require('./errors/errorCodes');
const NotFoundError = require('./errors/NotFoundError');
const auth = require('./middlewares/auth');

const app = express();

const { PORT = 3000 } = process.env;

const limiter = rateLimit({
  windowMs: ms('15m'),
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);
app.use(helmet());
app.use(bodyParser.json());
app.use(cookieParser());

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(routes);

app.use('*', auth, (req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});

app.use(celebrateErrors());

app.use((err, req, res, next) => {
  if (err.statusCode) {
    res.status(err.statusCode).send({ message: err.message });
  } else {
    res.status(STATUS_CODE.serverError).send({ message: 'Произошла ошибка на сервере' });
  }
  next();
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App is listening port: ${PORT}`);
});
