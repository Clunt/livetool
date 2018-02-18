var createElement = React.createElement;
var SideFlagComponent = createReactClass({
  getInitialState: function() {
    return {
      data: {}
    };
  },
  componentDidMount: function() {
    this.props.socket.on('flag', function(data) {
      this.setState({
        data: data || {}
      });
    }.bind(this));
    setInterval(function () {
      this.props.socket.emit('getFlag');
    }.bind(this), 5000);
  },
  renderFlaglist: function() {
    var flags = this.state.data.flaglist || {};
    var flaglist = [];
    for (var flag in flags) {
      flaglist.push({
        flag: flag,
        count: flags[flag]
      });
    }
    flaglist.sort(function(a, b) {
      return b.count - a.count;
    });

    return createElement('ul', {
        className: 'flag__list'
      },
      flaglist.map(function(item, index) {
        return createElement('li', {
          key: index
        }, createElement('div', null, item.flag), createElement('span', null, item.count))
      })
    );
  },
  render: function() {
    return createElement('div', {
        className: 'content__box content__flag ' + (this.props.admin && !this.props.visible ? 'content__box--hide' : '')
      },
      createElement('div', null,
        createElement('div', { className: 'content__box__title' }, '致命文案征集'),
        createElement('ul', {
            className: 'content__box__code'
          },
          createElement('li', null, '#Flag 致命文案#')
        ),
        createElement('div', { className: 'content__box__main' }, this.renderFlaglist())
      )
    );
  }
});