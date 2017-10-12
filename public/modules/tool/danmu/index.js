// TODO:
// 1. 进场提示
// 2. 语音欢迎
var DANMU_USER_PERMISSION = {
  4: '房管',
  5: '主播'
};
var DanmuComponent = createReactClass({
  getInitialState: function() {
    return {
      welcomes: [],
      messages: [],
      gifts: [],
      logs: [],
    };
  },
  componentDidMount: function() {
    this.props.socket.on('danmu', function(data) {
      var type = data.type;
      switch (data.type) {
        case 'welcome':
          this.welcome(data);
          break;
        case 'chat':
          this.chat(data);
          break;
        case 'gift':
          this.gift(data);
          break;
        case 'log':
          this.log(data);
          break;
      }
    }.bind(this));
  },
  welcome: function(data) {
    var user = data.user;
    var response = data.response;
    var body = response.body;
    var nickname = body.nn;
    if (user) {
      var names = user.names;
      if (names.indexOf(nickname) < 0) {
        nickname += '(' + names[names.length - 1] + ')';
      }
    }
    // TODO: 横幅滚屏
    this.setState(function(prevState) {
      var messages = Util.copy(prevState.messages) || [];
      messages.push({
        type: 'welcome',
        nickname: nickname,
        body: body,
        user: user,
        raw: response.raw
      });
      return {
        messages: this.props.admin ? messages : messages.slice(messages.length - 20)
      };
    });
  },
  gift: function(data) {
    var response = data.response;
    var body = response.body;
    // TODO: 横幅滚屏
    this.setState(function(prevState) {
      var gifts = Util.copy(prevState.gifts);
      gifts.push({
        nickname: body.nn,
        body: body,
        raw: response.raw
      });
      return {
        messages: this.props.admin ? messages : messages.slice(messages.length - 20)
      };
    });
  },
  chat: function(data) {
    var response = data.response;
    var body = response.body;
    this.setState(function(prevState) {
      var messages = Util.copy(prevState.messages);
      messages.push({
        type: 'chat',
        nickname: body.nn,
        danmu: body.txt,
        nameplate: body.bnn,
        permission: body.rg,
        body: body,
        raw: response.raw
      });
      return {
        messages: this.props.admin ? messages : messages.slice(messages.length - 20)
      };
    });
  },
  log: function(data) {
    var response = data.response;
    var body = response.body;
    var message = [body.type.trim()].join(' ');
    this.setState(function(prevState) {
      var logs = Util.copy(prevState.logs);
      logs.push(message);
      return {
        logs: logs.slice(logs.length - 20)
      };
    });
  },
  renderWelcomes: function() {
    // TODO
    return createElement('div', {
      className: 'danmu__welcomes'
    });
  },
  renderGifts: function() {
    return createElement('div', {
      className: 'danmu__gifts'
    }, this.state.gifts.map(function(item, index) {
      var message = ['感谢 ', item.nickname, ' 送的礼物'].join('');
      return React.createElement('li', {
        key: index,
        className: 'gifts__item'
      }, message);
    }));
  },
  renderMessages: function() {
    return createElement('div', {
      className: 'danmu__messages'
    }, this.state.messages.map(function(item, index) {
      var message = '';
      switch (item.type) {
        case 'welcome':
          message = ['欢迎 ', item.nickname, ' ', (item.user ? '回' : '来'), '到直播间'].join('');
          break;
        case 'chat':
          var nickname = item.nickname;
          var danmu = item.danmu;
          var nameplate = item.nameplate ? '[' + item.nameplate + ']' : '';
          var permission = DANMU_USER_PERMISSION[item.permission]
          if (permission) {
            permission = '[' + permission + ']';
          }
          message = [permission, nameplate, ' ', nickname, ': ', danmu].join('');
          break;
        default:
          return;
      }
      return React.createElement('li', {
        key: index,
        className: 'messages__item messages__item--' + item.type
      }, message);
    }));
  },
  renderLogs: function() {
    return createElement('div', {
      className: 'danmu__logs'
    }, this.state.logs.map(function(msg, index) {
      return React.createElement('li', {
        key: index,
        className: 'logs__item'
      }, msg);
    }));
  },
  render: function() {
    return React.createElement('div', {
        className: 'tool__danmu'
      },
      this.renderWelcomes(),
      this.renderGifts(),
      this.renderMessages(),
      this.renderLogs(),
      createElement('div', {
        className: 'danmu__state danmu__state--' + this.props.state
      }, ['离线', '连接中', '在线'][this.props.state])
    );
  }
});