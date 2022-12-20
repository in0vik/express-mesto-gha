const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors: celebrateErrors, isCelebrateError } = require('celebrate');
const { routes } = require('./routes');
const STATUS_CODE = require('./errors/errorCodes');
const NotFoundError = require('./errors/NotFoundError');

const app = express();

const { PORT = 3000 } = process.env;

app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(routes);

app.use('*', (req, res, next) => {
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
  console.log(`App is listening port: ${PORT}`);
});
