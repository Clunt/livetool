exports = module.exports = function(response) {
  var keys = [
    '巨乳',
  ];
  var txt = '';
  response.body.txt.replace(/\s/g, '').split('').forEach(function(item) {
    txt += encodeURIComponent(item).replace(/%7F/ig, '');
  });
  for (var i = 0; i < keys.length; i++) {
    if (txt.match(new RegExp(encodeURIComponent(keys[i])))) return true;
  }
};

exports.song = function(song) {};
