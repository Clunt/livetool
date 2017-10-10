const path = require('path');
const mkdirp = require('mkdirp');
const bunyan = require('bunyan');

const loggers = {};

exports = module.exports = function createLogger(category) {
  if (loggers[category]) return loggers[category];
  mkdirp.sync(path.join(__dirname, 'logs'));
  const logger = bunyan.createLogger({
    name: category,
    streams: [{
      path: path.join(__dirname, 'logs', category + '.log')
    }]
  });
  loggers[category] = logger;
  return logger;
}