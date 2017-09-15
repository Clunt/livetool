function Welcome() {}

Welcome.prototype.liveload = function(data) {
  var welcome = data.welcome || [];
  for (var i = 0; i < welcome.length; i++) {
    this.welcome(welcome[i]);
  }
};

Welcome.prototype.welcome = function(welcome) {
  var $welcome = $('.app__welcome');
  welcome = (welcome || '').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  var text = '欢迎<b>' + welcome + '</b>来到直播间';
  var $nickname = $('<li>' + text + '</li>')
  $nickname.css({
    bottom: Math.round(Math.random() * 10) * 24 + 12,
  });
  $nickname.appendTo($welcome);
  $nickname.animate({
    left: -$nickname.outerWidth() - 200
  }, 10000, function() {
    $nickname.remove();
  });
};