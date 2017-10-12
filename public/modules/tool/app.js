var App = createReactClass({
  getInitialState: function() {
    return {
      admin: false,

      socket: io('/'),
      state: 0, // 0 初始状态 1 Socket连接 2 弹幕连接
      data: {}
    };
  },
  componentDidMount: function() {
    this.onState();
  },
  onState: function() {
    var self = this;
    var socket = this.state.socket;
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
    var socket = this.state.socket;
    socket.on('flag', function(data) {
    }.bind(this));
  },
  onMusic: function() {
    var socket = this.state.socket;
    socket.on('music', function(data) {
    }.bind(this));
  },
  render: function() {
    return React.createElement('div', {
        className: ['tool', this.state.admin ? 'tool--admin' : ''].join(' ')
      },
      React.createElement('div', {
        className: 'tool__main'
      }),
      React.createElement(SideComponent, {
        socket: this.state.socket,
        admin: this.state.admin,
        state: this.state.state
      }),
      React.createElement(DanmuComponent, {
        socket: this.state.socket,
        admin: this.state.admin,
        state: this.state.state
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
