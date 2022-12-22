const express = require('express');
const { cardRoutes } = require('./cards');
const { userRoutes } = require('./users');
const { loginRoutes } = require('./login');
const { createUserRoutes } = require('./createUser');
const auth = require('../middlewares/auth');

const routes = express.Router();

routes.use('/signin', loginRoutes);
routes.use('/signout', loginRoutes);
routes.use('/signup', createUserRoutes);

routes.use('/users', auth, userRoutes);
routes.use('/cards', auth, cardRoutes);

exports.routes = routes;
