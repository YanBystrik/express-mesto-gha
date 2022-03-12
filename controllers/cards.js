/* eslint-disable no-underscore-dangle */
const Card = require('../models/card');
const ErrorNotFound = require('../utils/errorNotFound');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports.createCard = (req, res) => {
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
        res.status(400).send({ message: errorMessage });
      } else {
        res.status(500).send({ message: `Непредвиденная ошибка: ${err.message}` });
      }
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail(() => {
      throw new ErrorNotFound(`Карточка с id:${req.params.cardId} не существует`);
    })
    .then((card) => {
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: `Переданы некорректные данные: '${err.value}' вместо ${err.path}` });
        return;
      }
      if (err.statusCode === 404) {
        res.status(404).send({ message: err.errorMessage });
      } else {
        res.status(500).send({ message: `Непредвиденная ошибка: ${err.message}` });
      }
    });
};

// eslint-disable-next-line no-unused-vars
module.exports.likeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } },
  { new: true, runValidators: true },
)
  .orFail(() => {
    throw new ErrorNotFound(`Карточка с id:${req.params.cardId} не существует`);
  })
  .then((card) => res.send({ data: card }))
  .catch((err) => {
    if (err.name === 'CastError') {
      res.status(400).send({ message: `Переданы некорректные данные: '${err.value}' вместо ${err.path}` });
      return;
    }
    if (err.statusCode === 404) {
      res.status(404).send({ message: err.errorMessage });
    } else {
      res.status(500).send({ message: `Непредвиденная ошибка: ${err.message}` });
    }
  });

// eslint-disable-next-line no-unused-vars
module.exports.dislikeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } },
  { new: true, runValidators: true },
)
  .orFail(() => {
    throw new ErrorNotFound(`Карточка с id:${req.params.cardId} не существует`);
  })
  .then((card) => res.send({ data: card }))
  .catch((err) => {
    if (err.name === 'CastError') {
      res.status(400).send({ message: `Переданы некорректные данные: '${err.value}' вместо ${err.path}` });
      return;
    }
    if (err.statusCode === 404) {
      res.status(404).send({ message: err.errorMessage });
    } else {
      res.status(500).send({ message: `Непредвиденная ошибка: ${err.message}` });
    }
  });
