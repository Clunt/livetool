var createElement = React.createElement;
var SideComponent = createReactClass({
  renderHeader: function() {
    return createElement('div', { className: 'side__header' },
      createElement('div', { className: 'header__title' }, 'Clantu'),
      createElement('div', { className: 'header__info' }, '每晚21:00准时开播，周末连播到爆炸'),
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
  renderContent: function() {
    return createElement('div', { className: 'side__content' },
      createElement(SideMusicComponent, {
        socket: this.props.socket,
        admin: this.props.admin
      }),
      createElement(SideFlagComponent, {
        socket: this.props.socket,
        admin: this.props.admin
      })
    );
  },
  render: function() {
    return createElement('div', {
      className: 'tool__side'
    }, this.renderHeader(), this.renderContent(), this.renderFooter());
  }
});