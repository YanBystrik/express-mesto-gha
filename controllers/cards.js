const Card = require('../models/card');
const ErrorNotFound = require('../utils/errorNotFound');
const InvalidError = require('../utils/invalidError');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const owner = req.user._id;
  const { name, link } = req.body;

  Card.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        let errorMessage = 'Переданны неверные данные: ';
        const errorValues = Object.values(err.errors);
        errorValues.forEach((errVal) => {
          if (typeof errVal === 'object') {
            errorMessage += `Ошибка в поле ${errVal.path}, `;
          }
        });
        throw new InvalidError({ message: errorMessage });
      }
      next(err);
    });
};

module.exports.deleteCard = (req, res, next) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new ErrorNotFound('Карточка не существует');
      }
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new InvalidError({ message: `Переданы некорректные данные: '${err.value}' вместо ${err.path}` });
      }
      next(err);
    });
};

module.exports.likeCard = (req, res, next) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } },
  { new: true, runValidators: true },
)
  .then((card) => {
    if (!card) {
      throw new ErrorNotFound('Карточка не существует');
    }
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      throw new InvalidError({ message: `Переданы некорректные данные: '${err.value}' вместо ${err.path}` });
    }
    next(err);
  });

module.exports.dislikeCard = (req, res, next) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } },
  { new: true, runValidators: true },
)
  .then((card) => {
    if (!card) {
      throw new ErrorNotFound('Карточка не существует');
    }
    res.send({ data: card });
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      throw new InvalidError({ message: `Переданы некорректные данные: '${err.value}' вместо ${err.path}` });
    }
    next(err);
  });
