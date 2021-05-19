const mongoose = require('mongoose');
const validator = require('validator');
const { incorrectTrailerLink } = require('../errors/error-messages');

const cardSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
      unique: true,
    },
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
      type: Object,
      required: true,
    },
    trailerLink: {
      type: String,
      required: true,
      validate: {
        validator(v) {
          return validator.isURL(v);
        },
        message: incorrectTrailerLink,
      },
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true,
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
