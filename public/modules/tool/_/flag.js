function Flag() {}

Flag.prototype.liveload = function(data) {
  this.flaglist(data.flaglist);
};

Flag.prototype.flaglist = function(flags) {
  flags = flags || {};
  var flaglist = [];
  for (var flag in flags) {
    flaglist.push({
      flag: flag,
      count: flags[flag]
    });
  }
  flaglist.sort(function(a, b) {
    return b.count - a.count;
  });
  var html = '';
  for (var i = 0; i < flaglist.length; i++) {
    html += '<tr><td>' + flaglist[i].flag + '</td><td class="count">' + flaglist[i].count + '</td></tr>';
  }
  $('.app__flag .flag__list').html(html);
};