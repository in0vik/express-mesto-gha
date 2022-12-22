const jwt = require('jsonwebtoken');
const ms = require('ms');
const bcrypt = require('bcrypt');
const NotFoundError = require('../errors/NotFoundError');
const Users = require('../models/user');
const BadRequestError = require('../errors/BadRequestError');
const UnauthorizedError = require('../errors/UnauthorizedError');
const ConflictError = require('../errors/ConflictError');

module.exports.getUsers = (req, res, next) => {
  Users.find({})
    .then((users) => res.send(users))
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => Users.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => res.status(201).send({
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      email: user.email,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при создании пользователя.'));
      } else if (err.code === 11000) {
        next(new ConflictError('Такой пользователь уже есть'));
      } else {
        next(err);
      }
    });
};

module.exports.getUserById = (req, res, next) => {
  Users.findById(req.params.id)
    .orFail(() => {
      next(new NotFoundError('Пользователь по указанному _id не найден'));
    })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Пользователь по указанному _id не найден'));
      } else {
        next(err);
      }
    });
};

module.exports.getCurrentUser = (req, res, next) => {
  Users.findById(req.user._id)
    .orFail(() => {
      next(new NotFoundError('Пользователь по указанному _id не найден'));
    })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Пользователь по указанному _id не найден'));
      } else {
        next(err);
      }
    });
};

module.exports.updateUser = (req, res, next) => {
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
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при обновлении пользователя.'));
      } else {
        next(err);
      }
    });
};

module.exports.updateAvatar = (req, res, next) => {
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
      next(new NotFoundError('Пользователь по указанному _id не найден'));
    })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при обновлении аватара.'));
      } else {
        next(err);
      }
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  Users.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return next(new UnauthorizedError('Непрвильная почта или пароль'));
      }
      return bcrypt.compare(password, user.password)
        // eslint-disable-next-line consistent-return
        .then((matched) => {
          if (!matched) {
            return next(new UnauthorizedError('Непрвильная почта или пароль'));
          }
          const token = jwt.sign({ _id: user._id }, 'secret-key', { expiresIn: '7d' });
          res.cookie('jwt', token, {
            maxAge: ms('7d'),
            httpOnly: true,
          });
          res.send({ token });
        });
    })
    .catch((err) => {
      next(new UnauthorizedError(err.message));
    });
};

module.exports.logOut = (req, res, next) => {
  res.clearCookie('jwt').send({ message: 'Выход' })
    .catch(next);
};
