const createUserRoutes = require('express').Router();
const { createUser } = require('../controllers/users');

createUserRoutes.post('/', createUser);

exports.createUserRoutes = createUserRoutes;
