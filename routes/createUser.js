const { celebrate, Joi } = require('celebrate');
const createUserRoutes = require('express').Router();
const { createUser } = require('../controllers/users');

createUserRoutes.post('/', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email({ tlds: { allow: false } }),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    // eslint-disable-next-line no-useless-escape
    avatar: Joi.string().min(2).regex(/https?:\/\/(www.)?[\da-z-._~:\/?#[\]@!$&'()*+,;=]*/),
  }),
}), createUser);

exports.createUserRoutes = createUserRoutes;
