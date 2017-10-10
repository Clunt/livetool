// TODO:
// 1. 进场提示
// 2. 语音欢迎
function App() {
  var App = createReactClass({
    getInitialState: function() {
      return {
        login: false,
        online: false,
        welcomes: [],
        messages: [],
        gifts: [],
        logs: [],
      };
    },
    componentDidMount: function() {
      this.createSocket();
    },
    createSocket: function() {
      var socket = io('/danmu');
      socket.on('connect', this.online);
      socket.on('reconnect', this.online);
      socket.on('disconnect', this.offline);

      socket.on('douyu', this.login);
      socket.on('welcome', this.welcome);
      socket.on('chat', this.chat);
      socket.on('gift', this.gift);
      socket.on('log', this.log);
    },
    online: function() {
      this.setState({
        online: true
      });
    },
    offline: function() {
      this.setState({
        online: false
      });
    },
    login: function() {
      this.setState({
        login: true
      });
    },
    welcome: function(response, exist) {
      var body = response.body;
      var message = ['欢迎 ', (body.bnn ? '[' + body.bnn + ']' : ''), body.nn, ' ', (exist ? '回' : '来'), '到直播间'].join('');
      // TODO: 横幅滚屏
      this.setState(function(prevState) {
        var messages = Util.copy(prevState.messages);
        messages.push(message);
        return {
          messages: messages.slice(messages.length - 20)
        };
      });
    },
    gift: function(response) {
      var body = response.body;
      // TODO: 横幅滚屏
      var message = ['感谢 ', body.nn, ' 送的礼物'].join('');
      this.setState(function(prevState) {
        var gifts = Util.copy(prevState.gifts);
        gifts.push(message);
        return {
          gifts: gifts.slice(gifts.length - 20)
        };
      });
    },
    chat: function(response) {
      var body = response.body;
      var message = [body.nn.trim(), body.txt.trim()].join(': ');
      this.setState(function(prevState) {
        var messages = Util.copy(prevState.messages);
        messages.push(message);
        return {
          messages: messages.slice(messages.length - 20)
        };
      });
    },
    log: function(response) {
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
    render: function() {
      var messageNode = React.createElement('ul', {
        className: 'danmu__messages'
      }, this.state.messages.map(function(msg, index) {
        return React.createElement('li', {
          key: index,
          className: 'messages__item'
        }, msg);
      }));
      var welcomeNode = React.createElement('ul', {
        className: 'danmu__welcome'
      }, this.state.welcomes.map(function(msg, index) {
        return React.createElement('li', {
          key: index,
          className: 'welcome__item'
        }, msg);
      }));
      var giftNode = React.createElement('ul', {
        className: 'danmu__gifts'
      }, this.state.gifts.map(function(msg, index) {
        return React.createElement('li', {
          key: index,
          className: 'gifts__item'
        }, msg);
      }));
      var logNode = React.createElement('ul', {
        className: 'danmu__logs'
      }, this.state.logs.map(function(msg, index) {
        return React.createElement('li', {
          key: index,
          className: 'logs__item'
        }, msg);
      }));
      var stateNode = React.createElement('span', {
        className: [
          'danmu__state',
          this.state.online ? (this.state.login ? 'danmu__state--login' : 'danmu__state--online') : 'danmu__state--offline'
        ].join(' ')
      }, this.state.online ? (this.state.login ? '在线' : '离开') : '离线');
      return React.createElement('div', {
        className: 'danmu'
      }, messageNode, welcomeNode, giftNode, logNode, stateNode);
    }
  });

  ReactDOM.render(React.createElement(App), document.getElementById('app'));
}
