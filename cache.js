let redis = require('redis');
let client = redis.createClient();

module.exports = function cache(req, res, next) {

  client.get(`${req.originalUrl}`, function (err, data) {
    if (err) throw err;

    if (data !== null) {
      return res.send(data + `<p>${res.requestCounter}</p>`);
    }

    res.cacheIt = (url, html) => {
      client.setex(url, 60, html);
    };

    return next();
  });
};

