var createElement = React.createElement;
// var location = (window || {}).location || {}
var App = createReactClass({
  getInitialState: function() {
    return {
      admin: false,
      // admin: location.hash === '#admin',

      socket: io('/'),
      state: 0, // 0 初始状态 1 Socket连接 2 弹幕连接
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
  render: function() {
    var isAdmin = this.state.admin;
    return React.createElement('div', {
        className: 'tool tool--' + (isAdmin ? 'admin' : 'user')
      },
      createElement('div', { className: 'tool__main' }),
      createElement(SideComponent, {
        socket: this.state.socket,
        admin: this.state.admin,
      }),
      createElement(DanmuComponent, {
        socket: this.state.socket,
        admin: this.state.admin,
        state: this.state.state
      })
    );
  }
});

$(function() {
  ReactDOM.render( createElement(App), document.getElementById('app') );
});
