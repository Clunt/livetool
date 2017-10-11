var App = createReactClass({
  getInitialState: function() {
    return {
      // socket: io('/admin'),
      // socket: io('/'),
      socket: io(),
      state: 0, // 0 初始状态 1 Socket连接 2 弹幕连接
      side: {},
      danmu: {},
    };
  },
  componentDidMount: function() {
    this.createSocket();
  },
  createSocket: function() {
    var socket = this.state.socket;
    this.onState();
    socket.on('music', this.onFlag);
    socket.on('flag', this.onMusic);
    socket.on('danmu', this.onDanmu);
  },
  onState: function() {
    var self = this;
    var socket = this.state.socket;
    io('/admin').on('connect', function() {
      console.log('client admin')
    })
    socket.on('connect', function() {
      self.setState({
        state: 1
      });
    });
    socket.on('reconnect', function() {
      self.setState({
        state: 1
      });
    });
    socket.on('login', function() {
      console.log('login')
      self.setState({
        state: 2
      });
    });
    socket.on('disconnect', function() {
      self.setState({
        state: 0
      });
    });
  },
  onFlag: function() {
    console.log('onFlag', arguments)
  },
  onMusic: function() {
    console.log('onMusic', arguments)
  },
  onDanmu: function() {
    console.log('onDanmu', arguments)
  },
  render: function() {
    return React.createElement('div', {
        className: 'tool'
      },
      React.createElement(SideComponent, {
        state: this.state.state,
        data: {
          music: this.state.music,
          flag: this.state.flag
        }
      }),
      React.createElement('div', {
        className: 'tool__main'
      }),
      React.createElement(DanmuComponent, {
        state: this.state.state,
        data: this.state.danmu
      })
    );
  }
});

$(function() {
  ReactDOM.render(
    React.createElement(App),
    document.getElementById('app')
  );
});
