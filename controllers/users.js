const STATUS_CODE = require('../errors/errorCodes');
const NotFoundError = require('../errors/NotFoundError');
const Users = require('../models/user');

module.exports.getUsers = (req, res) => {
  Users.find({})
    .then((users) => res.status(200).send(users))
    .catch((err) => res.status(STATUS_CODE.serverError)
      .send({ message: `Произошла ошибка на сервере: ${err.message}` }));
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  Users.create({ name, about, avatar })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(STATUS_CODE.badRequest).send({
          message: 'Переданы некорректные данные при создании пользователя.',
        });
      } else {
        res
          .status(STATUS_CODE.serverError)
          .send({ message: `Произошла ошибка на сервере: ${err.message}` });
      }
    });
};

module.exports.getUserById = (req, res) => {
  Users.findById(req.params.id)
    .orFail(() => {
      throw new NotFoundError('Пользователь по указанному _id не найден');
    })
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'notFound') {
        res.status(STATUS_CODE.notFound).send({ message: err.message });
      } else if (err.name === 'castError') {
        res
          .status(STATUS_CODE.badRequest)
          .send({ message: 'Пользователь по указанному _id не найден' });
      } else {
        res
          .status(STATUS_CODE.serverError)
          .send({ message: `Произошла ошибка на сервере: ${err}` });
      }
    });
};

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;
  Users.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true,
      runValidators: true,
    },
  )
    .orFail(() => {
      throw new NotFoundError('Пользователь с указанным _id не найден.');
    })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'notFound') {
        res.status(STATUS_CODE.notFound).send({ message: err.message });
      } else if (err.name === 'ValidationError') {
        res.status(STATUS_CODE.badRequest).send({
          message: 'Переданы некорректные данные при создании пользователя.',
        });
      } else {
        res
          .status(STATUS_CODE.serverError)
          .send({ message: `Произошла ошибка на сервере: ${err}` });
      }
    });
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  Users.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true,
      runValidators: true,
    },
  )
    .orFail(() => {
      throw new NotFoundError('Пользователь с указанным _id не найден.');
    })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'notFound') {
        res.status(STATUS_CODE.notFound).send({ message: err.message });
      } else if (err.name === 'ValidationError') {
        res.status(STATUS_CODE.badRequest).send({
          message: 'Переданы некорректные данные при создании пользователя.',
        });
      } else {
        res
          .status(STATUS_CODE.serverError)
          .send({ message: `Произошла ошибка на сервере: ${err}` });
      }
    });
};
