const User = require('../models/user');
const ErrorNotFound = require('../utils/errorNotFound');
const InvalidError = require('../utils/invalidError');

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(next);
};

module.exports.getUserMe = (req, res, next) => {
  User.findOne({ _id: req.user._id })
    .then((user) => {
      res.send({ data: user });
    })
    .catch(next);
};

module.exports.getUser = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        throw new ErrorNotFound('Нет пользователя с таким id');
      }

      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new InvalidError('Неверный id'));
      }
      next(err);
    });
};

module.exports.updateUser = (req, res, next) => {
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
    .then((user) => {
      if (!user) {
        throw new ErrorNotFound('Нет пользователя с таким id');
      }

      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        let errorMessage = 'Переданны неверные данные: ';
        const errorValues = Object.values(err.errors);
        errorValues.forEach((errVal) => {
          if (typeof errVal === 'object') {
            errorMessage += `Ошибка в поле ${errVal.path}, `;
          }
        });
        next(new InvalidError(errorMessage));
      }
      next(err);
    });
};

module.exports.updateAvatar = (req, res, next) => {
  User.findByIdAndUpdate(
    req.user._id,
    {
      avatar: req.body.avatar,
    },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      if (!user) {
        throw new ErrorNotFound('Нет пользователя с таким id');
      }

      res.send({ data: user });
    })
    .catch((err) => {
      if (err.statusCode === 404) {
        next(new ErrorNotFound('Нет пользователя с таким id'));
      }
      if (err.name === 'ValidationError') {
        let errorMessage = 'Переданны неверные данные: ';
        const errorValues = Object.values(err.errors);
        errorValues.forEach((errVal) => {
          if (typeof errVal === 'object') {
            errorMessage += `Ошибка в поле ${errVal.path}, `;
          }
        });
        next(new InvalidError(errorMessage));
      }
      next(err);
    });
};
