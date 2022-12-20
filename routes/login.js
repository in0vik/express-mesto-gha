const loginRoutes = require('express').Router();
const { login } = require('../controllers/users');

loginRoutes.post('/', login);

exports.loginRoutes = loginRoutes;
