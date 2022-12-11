const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { routes } = require('./routes');
const STATUS_CODE = require('./errors/errorCodes');

const app = express();

const { PORT = 3000 } = process.env;

app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use((req, res, next) => {
  req.user = {
    _id: '639471880a1df3192f0ed715',
  };
  next();
});

app.use(routes);
app.use('*', (req, res) => {
  res.status(STATUS_CODE.notFound).send({ message: 'Страница не найдена' });
});

app.listen(PORT, () => {
  console.log(`App is listening port: ${PORT}`);
});