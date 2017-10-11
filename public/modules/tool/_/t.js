var LIVELOAD_DURATION = 5000;

$(function() {
  var music = new Music();
  var flag = new Flag();
  function liveload() {
    Util.ajax({
      url: '/api'
    }, function(err, data) {
      setTimeout(liveload, LIVELOAD_DURATION);
      if (err || !data) return;
      music.liveload(data);
      welcome.liveload(data);
      flag.liveload(data);
    });
  }

  liveload();
});