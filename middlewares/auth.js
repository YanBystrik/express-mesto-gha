const jwt = require('jsonwebtoken');
const AuthError = require('../utils/authError');

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;
  let payload;

  try {
    payload = jwt.verify(token, 'eb28135ebcfc17578f96d4d65b6c7871f2c803be4180c165061d5c2db621c51b');
  } catch (err) {
    throw new AuthError({ message: 'Необходима авторизация' });
  }
  req.user = payload;
  next();
};
