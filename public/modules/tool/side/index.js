var createElement = React.createElement;
var SideComponent = createReactClass({
  getInitialState: function() {
    return {
      infoVisible: false,
      musicVisible: !this.props.admin,
      flagVisible: !this.props.admin
    };
  },
  renderHeader: function() {
    return createElement('div', { className: 'side__header' },
      createElement('div', { className: 'header__title' }, 'Clantu'),
      createElement('div', { className: 'header__info' }, '工作日21:30(周末全天)真人大型直播至深夜！'),
      createElement('div', { className: 'header__info' }, '弹幕都会回，烦请稍等（直播延迟15s左右）'),
      // createElement('div', { className: 'header__info' }, '每晚21:00准时开播，周末连播到爆炸'),
      createElement('div', { className: 'header__highlight' }, '点关注，不迷路')
    );
  },
  renderFooter: function() {
    return createElement('div', { className: 'side__footer' },
      createElement('div', { className: 'footer__contact' }, Config.contact.map(function(item, index) {
        return createElement('dl', { key: index },
          createElement('dt', null, item.plantform),
          createElement('dd', null, item.address)
        );
      }))
    );
  },
  renderAdmin: function() {
    if (!this.props.admin) return undefined;
    return createElement('div', { className: 'side__admin' },
      createElement('button', {
        className: 'music ' + (this.state.musicVisible ? 'active' : ''),
        onClick: function() {
          this.setState(function(prevState) {
            return {
              infoVisible: false,
              musicVisible: !prevState.musicVisible,
              flagVisible: false
            }
          });
        }.bind(this)
      }, '歌单'),
      createElement('button', {
        className: 'info ' + (this.state.infoVisible ? 'active' : ''),
        onClick: function() {
          this.setState(function(prevState) {
            return {
              infoVisible: !prevState.infoVisible,
              musicVisible: false,
              flagVisible: false
            }
          });
        }.bind(this)
      }, '直播间'),
      createElement('button', {
        className: 'flag ' + (this.state.flagVisible ? 'active' : ''),
        onClick: function() {
          this.setState(function(prevState) {
            return {
              infoVisible: false,
              musicVisible: false,
              flagVisible: !prevState.flagVisible
            }
          });
        }.bind(this)
      }, 'Flag')
    );
  },
  renderContent: function() {
    return createElement('div', { className: 'side__content' },
      createElement(SideMusicComponent, {
        visible: this.state.musicVisible,
        socket: this.props.socket,
        admin: this.props.admin
      }),
      createElement(SideFlagComponent, {
        visible: this.state.flagVisible,
        socket: this.props.socket,
        admin: this.props.admin
      }),
      this.state.infoVisible ? createElement(SideInfoComponent, {
        socket: this.props.socket,
        admin: this.props.admin
      }) : null
    );
  },
  render: function() {
    return createElement('div', {
      className: 'tool__side'
    }, this.renderHeader(), this.renderContent(), this.renderFooter(), this.renderAdmin());
  }
});