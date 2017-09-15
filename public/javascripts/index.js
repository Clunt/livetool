var LIVELOAD_DURATION = 5000;

$(function() {
  var music = new Music();
  var welcome = new Welcome();
  function liveload() {
    Util.ajax({
      url: '/api'
    }, function(err, data) {
      setTimeout(liveload, LIVELOAD_DURATION);
      if (err || !data) return;
      music.liveload(data);
      welcome.liveload(data);
    });
  }

  liveload();
});