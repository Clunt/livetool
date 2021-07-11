const fs = require('fs');
const path = require('path');

const uids = ['111622460'];

exports = module.exports = function(response) {
  if (uids.indexOf(response.body.uid) > -1) return true;
  var keys = [
    '巨乳',
  ];
  var txt = '';
  response.body.txt.replace(/\s/g, '').split('').forEach(function(item) {
    try {
      txt += encodeURIComponent(item).replace(/%7F/ig, '');
    } catch (e) {}
  });
  for (var i = 0; i < keys.length; i++) {
    if (txt.match(new RegExp(encodeURIComponent(keys[i])))) return true;
  }
};

exports.song = function(song) {};
exports.friend = function(response) {
  const filename = path.resolve(__dirname, 'friend.json');
  const file = fs.readFileSync(filename, 'utf8');
  const friend = JSON.parse(file);
  return friend.includes(response.body.uid);
};
