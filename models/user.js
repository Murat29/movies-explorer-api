const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const validator = require('validator');
const UnauthorizedError = require('../errors/unauthorized-err');
const { invalidEmail, incorrectEmailOrPassword } = require('../errors/error-messages');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 30,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      minlength: 2,
      maxlength: 30,
      validate: {
        validator(v) {
          return validator.isEmail(v);
        },
        message: invalidEmail,
      },
    },
    password: {
      type: String,
      required: true,
      minlength: 4,
      select: false,
    },
  },
  { versionKey: false },
);

userSchema.statics.findUserByCredentials = function findUserByCredentials(email, password) {
  return this.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) throw new UnauthorizedError(incorrectEmailOrPassword);

      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) throw new UnauthorizedError(incorrectEmailOrPassword);
        return user;
      });
    });
};

module.exports = mongoose.model('user', userSchema);
