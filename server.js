const express = require('express');
const bodyParser = require('body-parser');
const handlebars = require('express-handlebars');

const cache = require('./cache');

const redis = require('redis');
let client = redis.createClient();

const { slow } = require('./routes');

const app = express();
const PORT = 8080;

app.engine('.hbs', handlebars({extname: '.hbs', defaultLayout: 'main'}));
app.set('view engine', '.hbs');

app.use(bodyParser.json());

app.use((req, res, next) => {
  client.incr(`${req.originalUrl}counter`);
  client.get(`${req.originalUrl}counter`, (err, data) => {
    res.requestCounter = data;
    });
  next();
});

app.use(cache);

app.use('/slow', slow);

app.get('/', (req, res) => {
  res.render('index', (err, html) => {
    res.cacheIt(`${req.originalUrl}`, html);
    res.send(html + `<p>${res.requestCounter}</p>`);
  });
});

app.listen(PORT, () => {
  process.stdout.write(`server listening on port ${PORT}`);
});
