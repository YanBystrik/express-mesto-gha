/* eslint-disable no-constant-condition */
/* eslint-disable no-underscore-dangle */
const User = require('../models/user');
const ErrorNotFound = require('../utils/errorNotFound');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports.getUser = (req, res) => {
  User.findById(req.params.userId)
    .orFail(() => {
      throw new ErrorNotFound(`Пользователь с id:${req.params.userId} не найден`);
    })
    .then((user) => res.send({ data: user }))
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
module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
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

module.exports.updateUser = (req, res) => {
  User.findByIdAndUpdate(
    req.user._id,
    {
      name: req.body.name,
      about: req.body.about,
    },
    {
      new: true,
      runValidators: true,
    },
  )
    .orFail(() => {
      throw new ErrorNotFound(`Пользователь с id:${req.user._id} не найден`);
    })
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.statusCode === 404) {
        res.status(404).send({ message: err.errorMessage });
        return;
      }
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

module.exports.updateAvatar = (req, res) => {
  User.findByIdAndUpdate(
    // eslint-disable-next-line no-underscore-dangle
    req.user._id,
    {
      avatar: req.body.avatar,
    },
    {
      new: true,
      runValidators: true,
    },
  )
    .orFail(() => {
      throw new ErrorNotFound(`Пользователь с id:${req.user._id} не найден`);
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.statusCode === 404) {
        res.status(404).send({ message: err.errorMessage });
        return;
      }
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
