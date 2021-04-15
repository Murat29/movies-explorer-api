const Card = require('../models/card');
const ConflictError = require('../errors/conflict-err');
const NotFoundError = require('../errors/not-found-err');

// GET
module.exports.getCards = (req, res, next) => {
  Card.find({}).populate('user')
    .then((cards) => res.send(cards))
    .catch(next);
};

// POST
module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send(card))
    .catch(next);
};

// DELETE
module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (String(card.owner) !== req.user._id) throw new ConflictError('Нельзя удалить чужую карточку');
      return Card.findByIdAndRemove(req.params.cardId);
    })
    .then((card) => {
      if (!card) throw new NotFoundError('Такой карточки нет');
      return res.send(card);
    })
    .catch(next);
};

module.exports.deleteLike = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) throw new NotFoundError('Такой карточки нет');
      return res.send(card);
    })
    .catch(next);
};

// PUT
module.exports.createLike = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) throw new NotFoundError('Такой карточки нет');
      return res.send(card);
    })
    .catch(next);
};
