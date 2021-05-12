const mongoose = require('mongoose');
const validator = require('validator');
const {
  incorrectPosterLink,
  incorrectMiniPosterLink,
  incorrectTrailerLink,
} = require('../errors/error-messages');

const cardSchema = new mongoose.Schema(
  {
    country: {
      type: String,
      required: true,
    },
    director: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    year: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
      validate: {
        validator(v) {
          return validator.isURL(v);
        },
        message: incorrectPosterLink,
      },
    },
    trailer: {
      type: String,
      required: true,
      validate: {
        validator(v) {
          return validator.isURL(v);
        },
        message: incorrectTrailerLink,
      },
    },
    thumbnail: {
      type: String,
      required: true,
      validate: {
        validator(v) {
          return validator.isURL(v);
        },
        message: incorrectMiniPosterLink,
      },
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    movieId: {
      type: String,
      required: true,
      unique: true,
    },
    nameRU: {
      type: String,
      required: true,
    },
    nameEN: {
      type: String,
      required: true,
    },
  },
  { versionKey: false },
);

module.exports = mongoose.model('movie', cardSchema);
