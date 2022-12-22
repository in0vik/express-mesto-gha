const { celebrate, Joi } = require('celebrate');
const loginRoutes = require('express').Router();
const { login, logOut } = require('../controllers/users');

loginRoutes.post('/', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email({ tlds: { allow: false } }),
    password: Joi.string().required(),
  }),
}), login);

loginRoutes.get('/', logOut);

exports.loginRoutes = loginRoutes;
