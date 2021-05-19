const { celebrate, Joi } = require('celebrate');
const movieRouter = require('express').Router();
const { getMovies, createMovie, deleteMovie } = require('../controllers/movie');

movieRouter.get('/movies', getMovies);
movieRouter.post(
  '/movies',
  celebrate({
    body: Joi.object()
      .keys({
        id: Joi.number().required(),
        country: Joi.string().required(),
        director: Joi.string().required(),
        duration: Joi.number().required(),
        year: Joi.string().required(),
        description: Joi.string().required(),
        image: Joi.object().required(),
        trailerLink: Joi.string().required(),
        nameRU: Joi.string().required(),
        nameEN: Joi.string().required(),
      })
      .unknown(true),
  }),
  createMovie,
);
movieRouter.delete(
  '/movies/:id',
  celebrate({
    params: Joi.object().keys({
      id: Joi.number(),
    }),
  }),
  deleteMovie,
);

module.exports = movieRouter;
