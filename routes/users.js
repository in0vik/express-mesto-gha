const userRoutes = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getUsers,
  getUserById,
  updateUser,
  updateAvatar,
  getCurrentUser,
} = require('../controllers/users');

userRoutes.get('/', getUsers);
userRoutes.get('/me', getCurrentUser);
userRoutes.get('/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().required().length(24),
  }),
}), getUserById);
userRoutes.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), updateUser);
userRoutes.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    // eslint-disable-next-line no-useless-escape
    avatar: Joi.string().min(2).regex(/https?:\/\/(www.)?[\da-z-._~:\/?#[\]@!$&'()*+,;=]*/),
  }),
}), updateAvatar);

exports.userRoutes = userRoutes;
