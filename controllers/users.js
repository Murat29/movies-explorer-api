const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-err');
const ConflictError = require('../errors/conflict-err');
const { noUser, emailIsBusy } = require('../errors/error-messages');

// GET
module.exports.getUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) throw new NotFoundError(noUser);
      return res.send(user);
    })
    .catch(next);
};

// POST
module.exports.createUser = (req, res, next) => {
  const { name, email, password } = req.body;
  User.findOne({ email })
    .then((user) => {
      if (!(user === null)) throw new ConflictError(emailIsBusy);
    })
    .then(() => bcrypt.hash(password, 10))
    .then((hash) => User.create({
      name,
      email,
      password: hash,
    }))
    .then((user) => {
      res.send({
        name: user.name,
        email: user.email,
      });
    })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  const { JWT_SECRET = 'dev-key' } = process.env;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: '7d',
      });
      return res.send({ token });
    })
    .catch(next);
};

// PATCH
module.exports.updateNameAndEmail = (req, res, next) => {
  const { name, email } = req.body;
  User.findOne({ email })
    .then((user) => {
      if (user) throw new ConflictError(emailIsBusy);
      return User.findByIdAndUpdate(
        req.user._id,
        { name, email },
        {
          new: true,
          runValidators: true,
        },
      );
    })
    .then((user) => {
      if (!user) throw new NotFoundError(noUser);
      return res.send(user);
    })
    .catch(next);
};
