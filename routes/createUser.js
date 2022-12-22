const { celebrate, Joi } = require('celebrate');
const createUserRoutes = require('express').Router();
const { regex } = require('../config/constants');
const { createUser } = require('../controllers/users');

createUserRoutes.post('/', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email({ tlds: { allow: false } }),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().min(2).regex(regex.link),
  }),
}), createUser);

exports.createUserRoutes = createUserRoutes;
