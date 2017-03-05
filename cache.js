let redis = require('redis');
let client = redis.createClient();

module.exports = function cache(req, res, next) {

  client.get(`${req.originalUrl}`, function (err, data) {
    if (err) throw err;

    if (data !== null) {
      res.send(data);
    } else {
      res.render('api/index', (err, html) => {
        client.setex(`${req.originalUrl}`, 60, `${html}`);
      });
      next();
    }
  });
};