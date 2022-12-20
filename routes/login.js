const { celebrate, Joi } = require('celebrate');
const loginRoutes = require('express').Router();
const { login } = require('../controllers/users');

loginRoutes.post('/', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email({ tlds: { allow: false } }),
    password: Joi.string().required(),
  }),
}), login);

exports.loginRoutes = loginRoutes;
