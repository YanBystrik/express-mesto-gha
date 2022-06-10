const bcrypt = require('bcryptjs');
const validator = require('validator');
const User = require('../models/user');
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
      if (validator.isEmail(user.email)) {
        res.send({
          email: user.email, name: user.name, about: user.about, avatar: user.avatar,
        });
      } else {
        throw new InvalidError({ message: 'Введены некорректные данные, попробуйте еще раз' });
      }
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
        throw new InvalidError({ message: errorMessage });
      }
      if (err.code === 11000) {
        res.status(409).send({ message: 'Пользователь с таким email уже зарегистрирован' });
        return;
      }
      next(err);
    });
};
