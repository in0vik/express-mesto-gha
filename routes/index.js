const express = require('express');
const { cardRoutes } = require('./cards');
const { userRoutes } = require('./users');

const routes = express.Router();

routes.use('/users', userRoutes);
routes.use('/cards', cardRoutes);

exports.routes = routes;
