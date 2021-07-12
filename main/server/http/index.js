const http = require('http');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const router = require('./router');
const emitter = require('./emitter');

exports = module.exports = function createHttpServer(port) {
  const app = express();

  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'ejs');
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(router);
  app.use((req, res, next) => next(new Error('Not Found')));
  app.use((err, req, res, next) => res.render('error'));

  const server = http.createServer(app);
  server.listen(port);

  return { server, emitter };
};
