const { celebrate, Joi } = require('celebrate');
const userRouter = require('express').Router();
const { getUser, updateNameAndEmail } = require('../controllers/users');

userRouter.get('/users/me', getUser);
userRouter.patch(
  '/users/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      email: Joi.string().required().email(),
    }),
  }),
  updateNameAndEmail,
);

module.exports = userRouter;
