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

    if (flaglist.length === 0) {
      return createElement('li', {
        key: 0
      }, '小cc好厉害，0bug！')
    }
    return flaglist.map(function(item, index) {
      return createElement('li', {
        key: index
      }, createElement('div', null, `${item.flag}(+${item.count})`))
    });
    return createElement('ul', {
        className: 'flag__list'
      },
      flaglist.map(function(item, index) {
        return createElement('li', {
          key: index
        }, createElement('div', null, `$(${item.count})${item.flag}`))
      })
    );
  },
  render: function() {
    return createElement('div', {
        className: 'content__box content__flag ' + (this.props.admin && !this.props.visible ? 'content__box--hide' : '')
      },
      createElement('div', null,
        createElement('div', { className: 'content__box__title' }, 'BugList'),
        createElement('div', { className: '' }, '相册体验: https://clantu.com/i/7CKKK7'),
        createElement('div', { className: '' }, '#bug 提交bug内容#'),
        createElement('ul', {
            className: 'content__box__code'
          },
          this.renderFlaglist()
          // createElement('li', null, '')
        ),
        // createElement('div', { className: 'content__box__main' }, this.renderFlaglist())
      )
    );
  }
});
