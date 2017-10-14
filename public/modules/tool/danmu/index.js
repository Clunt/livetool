// TODO:
// 1. 进场提示
// 2. 语音欢迎
var createElement = React.createElement;
var DanmuComponent = createReactClass({
  getInitialState: function() {
    return {
      voiceWelcome: false,
      voiceChat: false,
      messagesLocked: false,
      giftsLocked: false,
      logsLocked: false,
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
  componentDidUpdate: function() {
    var giftNode = this.refs.gift;
    var messageNode = this.refs.message;
    var logNode = this.refs.log;
    if (!this.state.messagesLocked) {
      messageNode.scrollTop = messageNode.scrollHeight;
    }
    if (!this.state.giftsLocked) {
      giftNode.scrollTop = giftNode.scrollHeight;
    }
    if (!this.state.logsLocked) {
      logNode.scrollTop = logNode.scrollHeight;
    }
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
        gifts: this.props.admin ? gifts : gifts.slice(gifts.length - 20)
      };
    });
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
    if (this.state.voiceWelcome) {
      this.speak('欢迎' + nickname + '来到直播间');
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
  chat: function(data) {
    var response = data.response;
    var body = response.body;
    if (this.state.voiceChat) {
      this.speak(body.txt);
    }
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
        logs: this.props.admin ? logs : logs.slice(logs.length - 20)
      };
    });
  },
  speak: function(text) {
    var msg = new SpeechSynthesisUtterance(text);
    msg.lang = 'zh';
    msg.voice = speechSynthesis.getVoices().filter(function(voice) {
      return voice.name == 'Whisper';
    })[0];
    speechSynthesis.speak(msg);
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
    },
      createElement('div', {
        className: 'gifts__inner',
        ref: 'gift'
      },
        this.state.gifts.map(function(item, index) {
          return React.createElement('li', {
            key: index,
            className: 'gifts__item'
          }, '感谢', createElement('span', {
            className: 'item__nickname'
          }, item.nickname), '送的礼物');
        })
      )
    );
  },
  renderMessageWelcom: function(item, index) {
    return React.createElement('div', {
      key: index,
      className: 'messages__item messages__item--' + item.type
    }, '欢迎', createElement('span', {
      className: 'item__nickname'
    }, item.nickname), (item.user ? '回' : '来') + '到直播间');
  },
  renderMessageChat: function(item, index) {
    var permission = Config.danmu.permissions[item.permission];
    var nickname = item.nickname;
    var nameplate = item.nameplate;
    var permissionNode = permission ? createElement('span', {
      className: 'item__permission'
    } , '[' + permission + ']') : null;
    var nameplateNode = nameplate ? createElement('span', {
      className: 'item__nameplate' + (Number(item.body.brid) === Config.room ? ' item__nameplate--family' : '')
    }, '[' + nameplate + ']') : null;
    var nicknameNode = createElement('span', {
      className: 'item__nickname'
    } , nickname + ':');
    var danmuNode = item.danmu.split(/(\[emot:[^\]]+\])/).map(function(item, index) {
      if (/^\[emot\:dy\d+\]$/.test(item)) {
        var id = item.match(/dy\d+/)[0];
        return createElement('img', {
          key: index,
          src: Config.danmu.emojis(id)
        });
      }
      return item;
    });
    return React.createElement('div', {
      key: index,
      className: 'messages__item messages__item--' + item.type
    }, permissionNode, nameplateNode, nicknameNode, danmuNode);
  },
  renderMessages: function() {
    return createElement('div', {
      className: 'danmu__messages'
    },
      createElement('div', {
        className: 'messages__inner',
        ref: 'message'
      },
        this.state.messages.map(function(item, index) {
          var message = '';
          switch (item.type) {
            case 'welcome':
              return this.renderMessageWelcom(item, index);
            case 'chat':
              return this.renderMessageChat(item, index);
              break;
          }
        }.bind(this))
      )
    );
  },
  renderLogs: function() {
    return createElement('div', {
      className: 'danmu__logs'
    },
      createElement('ul', {
        ref: 'log'
      }, this.state.logs.map(function(msg, index) {
        return React.createElement('li', {
          key: index,
          className: 'logs__item'
        }, msg);
      }))
    );
  },
  renderAdmin: function() {
    if (!this.props.admin) return null;
    return createElement('div', {
      className: 'danmu__admin'
    },
      createElement('button', {
        className: this.state.voiceWelcome ? 'acitve' : '',
        onClick: function() {
          this.setState(function(prevState) {
            return {
              voiceWelcome: !prevState.voiceWelcome
            }
          });
        }.bind(this)
      }, (this.state.voiceWelcome ? '关闭' : '开启') + '欢迎语音'),
      createElement('button', {
        className: this.state.voiceChat ? 'acitve' : '',
        onClick: function() {
          this.setState(function(prevState) {
            return {
              voiceChat: !prevState.voiceChat
            }
          });
        }.bind(this)
      }, (this.state.voiceChat ? '关闭' : '开启') + '弹幕语音'),
      createElement('button', {
        className: this.state.messagesLocked ? 'acitve' : '',
        onClick: function() {
          this.setState(function(prevState) {
            return {
              messagesLocked: !prevState.messagesLocked
            }
          });
        }.bind(this)
      }, (this.state.messagesLocked ? '解锁' : '锁定') + '弹幕'),
      createElement('button', {
        className: this.state.giftsLocked ? 'acitve' : '',
        onClick: function() {
          this.setState(function(prevState) {
            return {
              giftsLocked: !prevState.giftsLocked
            }
          });
        }.bind(this)
      }, (this.state.giftsLocked ? '解锁' : '锁定') + '礼物'),
      createElement('button', {
        className: this.state.logsLocked ? 'acitve' : '',
        onClick: function() {
          this.setState(function(prevState) {
            return {
              logsLocked: !prevState.logsLocked
            }
          });
        }.bind(this)
      }, (this.state.logsLocked ? '解锁' : '锁定') + '日志')
    );
  },
  render: function() {
    return createElement('div', {
        className: 'tool__danmu'
      },
      this.renderWelcomes(),
      this.renderGifts(),
      this.renderMessages(),
      this.renderLogs(),
      this.renderAdmin(),
      createElement('div', {
        className: 'danmu__state danmu__state--' + this.props.state
      }, ['离线', '连接中', '在线'][this.props.state])
    );
  }
});
