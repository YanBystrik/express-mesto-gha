const jwt = require('jsonwebtoken');
const AuthError = require('../utils/authError');

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;
  let payload;

  try {
    payload = jwt.verify(token, 'ctrhtnysqrkxrjnjhsqnsythfpuflftimybrjulf');
  } catch (err) {
    throw new AuthError({ message: 'Необходима авторизация' });
  }
  req.user = payload;
  next();
};
