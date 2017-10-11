var createElement = React.createElement;
var SideFlagComponent = createReactClass({
  renderFlaglist: function() {
    return createElement('table', {
        className: 'flag__list'
      },
      // TODO
      [].map(function(item, index) {
        return createElement('tr', {
          key: index
        })
      })
    );
  },
  render: function() {
    return createElement('div', {
        className: 'content__box content__flag'
      },
      createElement('div', { className: 'content__box__title' }, 'Flag'),
      createElement('ul', {
          className: 'content__box__code'
        },
        createElement('li', null, '#Flag 想看的内容#')
      ),
      createElement('div', { className: 'content__box__main' }, this.renderFlaglist())
    );
  }
});