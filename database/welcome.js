var NICKNAME_LIST = [];

exports = module.exports = {
  write: function(nickname) {
    if (!nickname) return;
    NICKNAME_LIST.push(nickname);
  },
  read: function() {
    var nickname_list = JSON.parse(JSON.stringify(NICKNAME_LIST));
    NICKNAME_LIST = [];
    return nickname_list;
  }
};