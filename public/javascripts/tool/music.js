function Music() {}

Music.prototype.liveload = function(data) {
  this.playlist(data.playlist);
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
    html = '<li class="empty">暂无歌单，欢迎大家踊跃点歌</li>';
  }
  $('.app__music .music__playlist').html(html);
};