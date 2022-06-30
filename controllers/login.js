const jwt = require('jsonwebtoken');
const User = require('../models/user');
const AuthError = require('../utils/authError');

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      if (!user) {
        throw new AuthError('Такого пользователя не существует');
      }
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
      res
        .cookie('jwt', token, {
          httpOnly: true,
          maxAge: 3600000 * 24 * 7,
          sameSite: 'none',
          secure: true,
        })
        .send({ message: 'Вы успешно вошли' });
    })
    .catch(next);
};
