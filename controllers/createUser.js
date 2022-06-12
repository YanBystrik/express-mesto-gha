const bcrypt = require('bcryptjs');
const User = require('../models/user');
const ConflictError = require('../utils/conflict');
const InvalidError = require('../utils/invalidError');

module.exports.createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      name: req.body.name,
      about: req.body.about,
      avatar: req.body.avatar,
      email: req.body.email,
      password: hash,
    }))
    .then((user) => {
      if (!user) {
        throw new InvalidError('Введены некорректные данные, попробуйте еще раз');
      }
      res.send({
        email: user.email, name: user.name, about: user.about, avatar: user.avatar,
      });
    })
    .catch((err) => {
      if (err.email === 'ValidationError') {
        let errorMessage = 'Переданны неверные данные: ';
        const errorValues = Object.values(err.errors);
        errorValues.forEach((errVal) => {
          if (typeof errVal === 'object') {
            errorMessage += `Ошибка в поле ${errVal.path}, `;
          }
        });
        next(new InvalidError(errorMessage));
      }
      if (err.code === 11000) {
        next(new ConflictError('Пользователь с таким email уже зарегистрирован'));
        return;
      }
      next(err);
    });
};
