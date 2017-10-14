var createElement = React.createElement;
var SideMusicComponent = createReactClass({
  getInitialState: function() {
    return {
      music: '',
      data: {}
    };
  },
  componentDidMount: function() {
    this.props.socket.on('music', function(data) {
      this.setState({
        data: data
      });
    }.bind(this));
    setInterval(function () {
      this.props.socket.emit('getMusic');
    }.bind(this), 5000);
  },
  renderPlaylist: function() {
    var playlist = this.state.data.playlist || [];
    var playlistNodes = playlist.map(function(item, index) {
      return createElement('li', {
        key: index
      }, [index + 1, item].join('. '));
    });
    if (playlistNodes.length < 2) {
      playlistNodes.push(
        createElement('li', {
          className: 'empty',
          key: 'empty'
        }, '欢迎大家踊跃点歌～～～')
      )
    }
    return createElement('ul', {
      className: 'music__playlist'
    }, playlistNodes);
  },
  renderAdmin: function() {
    if (!this.props.admin) return undefined;
    return createElement('div', {
      className: 'music__admin'
    }, createElement('input', {
      type: 'text',
      value: this.state.music,
      onChange: function(event) {
        this.setState({
          music: event.target.value
        });
      }.bind(this)
    }), createElement('button', {
      onClick: function() {
        var music = this.state.music;
        if (!music) return;
        this.props.socket.emit('addMusic', music);
        this.setState({
          music: ''
        });
      }.bind(this)
    }, '点歌'), createElement('button', {
      onClick: function() {
        this.props.socket.emit('cutMusic');
      }.bind(this)
    }, '切歌'));
  },
  render: function() {
    return createElement('div', {
        className: 'content__box content__music ' + (this.props.admin && !this.props.visible ? 'content__box--hide' : '')
      },
      createElement('div', null,
        createElement('div', { className: 'content__box__title' }, '点歌'),
        createElement('ul', {
            className: 'content__box__code'
          },
          createElement('li', null, '#点歌 歌名/歌手#'),
          createElement('li', null, '#切歌#')
        ),
        createElement('div', { className: 'content__box__main' }, this.renderPlaylist()),
        this.renderAdmin()
      )
    );
  }
});