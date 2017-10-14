var createElement = React.createElement;
var SideInfoComponent = createReactClass({
  getInitialState: function() {
    return {
      data: null
    };
  },
  componentDidMount: function() {
    $.ajax({
      url: '/room',
      success: function(response) {
        var res = response[2] || {};
        if (response[0] || res.error) return this.setState({data: false});
        this.setState({data: res.data});
      }.bind(this),
      error: function () {
        this.setState({
          data: false
        });
      }.bind(this)
    });
  },
  renderInfo: function() {
    var data = this.state.data;
    if (this.state.data === false) return createElement('div', null, '出错了');
    if (!this.state.data) return null;
    var list = [{
      name: '房间名称',
      text: data.room_name
    }, {
      name: '在线人数',
      text: data.online
    }, {
      name: '关注数',
      text: data.fans_num
    }, {
      name: '体重',
      text: data.owner_weight
    }];
    return createElement('ul', {
    }, list.map(function(item) {
      return createElement('li', {
        key: item.name
      }, createElement('b', null, item.name), createElement('span', null, item.text));
    }));
  },
  render: function() {
    return createElement('div', {
        className: 'content__box content__info'
      },
      createElement('div', null,
        createElement('div', { className: 'content__box__title' }, '直播间'),
        this.renderInfo()
      )
    );
  }
});