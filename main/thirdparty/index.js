const createBilibili = require('../thirdparty/bilibili');

exports.connectLiveStream = async option => {
  switch (option.platform) {
    case 'bilibili':
      return createBilibili(option.roomId);
    default:
      throw new Error(`platform not exist`, option.platform);
  }
};

exports.connectPusicPlayer = () => {
};
