var createElement = React.createElement;
var SideMusicComponent = createReactClass({
  renderPlaylist: function() {
    return createElement('ul', {
        className: 'music__playlist'
      },
      // TODO
      [].map(function(item, index) {
        return createElement('li', {
          key: index
        })
      })
    );
  },
  render: function() {
    return createElement('div', {
        className: 'content__box content__music'
      },
      createElement('div', { className: 'content__box__title' }, '点歌'),
      createElement('ul', {
          className: 'content__box__code'
        },
        createElement('li', null, '#点歌 歌名/歌手#'),
        createElement('li', null, '#切歌#')
      ),
      createElement('div', { className: 'content__box__main' }, this.renderPlaylist())
    );
  }
});