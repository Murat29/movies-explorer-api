const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const validator = require('validator');
const UnauthorizedError = require('../errors/unauthorized-err');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: 'Жак-Ив Кусто',
      minlength: 2,
      maxlength: 30,
    },
    about: {
      type: String,
      default: 'Исследователь',
      minlength: 2,
      maxlength: 30,
    },
    avatar: {
      type: String,
      default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
      validate: {
        validator(v) {
          return validator.isURL(v);
        },
        message: 'Не правильная ссылка на аватарку!',
      },
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
        message: 'Не валидный email!',
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
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) throw new UnauthorizedError('Неправильные почта или пароль');

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) throw new UnauthorizedError('Неправильные почта или пароль');
          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
