
const express = require('express');

const sleep = require('../services/sleep');

const router = express.Router();

router.route('/')
  .get((req, res, next) => {
    return sleep(5000)
      .then(_ => res.render('api/index', (err, html) => {
        res.cacheIt(`${req.originalUrl}`, html);
        res.send(html + `<p>${res.requestCounter}</p>`);
      }));
  });

module.exports = router;
