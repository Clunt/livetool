var LIVELOAD_DURATION = 5000;

function Music() {
  this.liveload();
}
Music.prototype.liveload = function() {
  Util.ajax({
    url: '/music'
  }, function(err, data) {
    setTimeout(this.liveload.bind(this), LIVELOAD_DURATION);
    if (err || !data) return;
    this.playlist(data.playlist);
  }.bind(this));
};
Music.prototype.playlist = function(playlist) {
  playlist = playlist || [];
  var $li = $('li');
  var html = '';
  for (var i = 0; i < playlist.length; i++) {
    var text = [(i + 1), playlist[i]].join('. ');
    text = text.replace(/</g, '&lt;').replace(/>/g, '&gt;')
    html += '<li>' + text + '</li>';
  }
  if (!html) {
    html = '<li class="empty">欢迎大家踊跃点歌</li>';
  }
  $('.app__music .music__playlist').html(html);
};