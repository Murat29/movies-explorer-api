const appRouter = require('express').Router();
const routeMovies = require('./movie');
const routeUsers = require('./users');

appRouter.use('/', routeMovies);
appRouter.use('/', routeUsers);

module.exports = appRouter;
