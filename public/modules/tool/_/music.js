function Music() {}

Music.prototype.liveload = function(data) {
  this.playlist(data.playlist);
};

Music.prototype.playlist = function(playlist) {
  playlist = playlist || [];
  var html = '';
  for (var i = 0; i < playlist.length; i++) {
    var text = [(i + 1), playlist[i]].join('. ');
    text = text.replace(/</g, '&lt;').replace(/>/g, '&gt;')
    html += '<li>' + text + '</li>';
  }
  if (playlist.length < 2) {
    html += '<li class="empty">欢迎大家踊跃点歌～～～</li>';
  }
  $('.app__music .music__playlist').html(html);
};