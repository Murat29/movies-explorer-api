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
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
    owner: req.user._id,
  })
    .then((movie) => res.send(movie))
    .catch(next);
};

// DELETE
module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .then((movie) => {
      if (!movie) throw new NotFoundError(noMovie);
      if (String(movie.owner) !== req.user._id) {
        throw new ConflictError(deletingNotYourOwnMovie);
      }
      return Movie.findByIdAndRemove(req.params.movieId);
    })
    .then((movie) => res.send(movie))
    .catch(next);
};
