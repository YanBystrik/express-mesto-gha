// Массив доменов, с которых разрешены кросс-доменные запросы
const allowedCors = [
  'https://mesto.yanbyst.nomoreparties.sbs',
  'http://mesto.yanbyst.nomoreparties.sbs',
  'localhost:3005',
];

module.exports = (req, res, next) => {
  const origin = req.headers; // Сохраняем источник запроса в переменную origin
  // проверяем, что источник запроса есть среди разрешённых
  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  const { method } = req; // Сохраняем тип запроса (HTTP-метод) в соответствующую переменную
  if (method === 'OPTIONS' && allowedCors.includes(origin)) {
    const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';
    const requestHeaders = req.headers['access-control-request-headers'];
    res.header('Access-Control-Allow-Origin', origin);
    // разрешаем кросс-доменные запросы любых типов (по умолчанию)
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
    // разрешаем кросс-доменные запросы с этими заголовками
    res.header('Access-Control-Allow-Headers', requestHeaders);

    return res.end();
  }
  next();
};
