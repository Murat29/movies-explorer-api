const { celebrate, Joi } = require('celebrate');
const router = require('express').Router();
const { getMovies, createMovie, deleteMovie } = require('../controllers/movie');

router.get('/movies', getMovies);
router.post(
  '/movies',
  celebrate({
    body: Joi.object().keys({
      country: Joi.string().required(),
      director: Joi.string().required(),
      duration: Joi.number().required(),
      year: Joi.string().required(),
      description: Joi.string().required(),
      image: Joi.string()
        .required()
        .regex(/^(http|https):\/\/\S/),
      trailer: Joi.string()
        .required()
        .regex(/^(http|https):\/\/\S/),
      thumbnail: Joi.string()
        .required()
        .regex(/^(http|https):\/\/\S/),
      movieId: Joi.string().required(),
      nameRU: Joi.string().required(),
      nameEN: Joi.string().required(),
    }),
  }),
  createMovie,
);
router.delete(
  '/movies/:movieId',
  celebrate({
    params: Joi.object().keys({
      movieId: Joi.string().hex().length(24),
    }),
  }),
  deleteMovie,
);

module.exports = router;
