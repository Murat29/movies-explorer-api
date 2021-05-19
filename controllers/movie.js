const Movie = require('../models/movie');
const ConflictError = require('../errors/conflict-err');
const NotFoundError = require('../errors/not-found-err');
const { noMovie, deletingNotYourOwnMovie } = require('../errors/error-messages');

// GET
module.exports.getMovies = (req, res, next) => {
  const owner = req.user._id;
  Movie.find({ owner })
    .populate('user')
    .then((movies) => res.send(movies))
    .catch(next);
};

// POST
module.exports.createMovie = (req, res, next) => {
  const {
    id,
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
  } = req.body;
  Movie.create({
    id,
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    owner: req.user._id,
  })
    .then((movie) => res.send(movie))
    .catch(next);
};

// DELETE
module.exports.deleteMovie = (req, res, next) => {
  Movie.findOne({ id: req.params.id })
    .then((movie) => {
      if (!movie) throw new NotFoundError(noMovie);
      if (String(movie.owner) !== req.user._id) {
        throw new ConflictError(deletingNotYourOwnMovie);
      }
      return Movie.findOneAndDelete({ id: req.params.id });
    })
    .then((movie) => res.send(movie))
    .catch(next);
};
