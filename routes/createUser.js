const { celebrate, Joi } = require('celebrate');
const createUserRoutes = require('express').Router();
const { createUser } = require('../controllers/users');

createUserRoutes.post('/', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email({ tlds: { allow: false } }),
    password: Joi.string().required(),
  }),
}), createUser);

exports.createUserRoutes = createUserRoutes;
