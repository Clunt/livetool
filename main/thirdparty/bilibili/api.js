const axios = require('axios');

const BILIBILI_API = 'https://api.live.bilibili.com';
const BILIBILI_API_INTERCEPTOR = ({ data }) => {
  if (data.code === 0) {
    return data.data;
  } else {
    throw new Error(data.message || `api code ${data.code}`);
  }
};

exports.getRoomNews = roomId => {
  return axios.get(`${BILIBILI_API}/room_ex/v1/RoomNews/get?roomid=${roomId}`).then(BILIBILI_API_INTERCEPTOR);
};

exports.getDanmuInfo = roomId => {
  return axios.get(`${BILIBILI_API}/xlive/web-room/v1/index/getDanmuInfo?id=${roomId}&type=0`).then(BILIBILI_API_INTERCEPTOR);
};

exports.getDanmuHistory = roomId => {
  return axios.get(`${BILIBILI_API}/xlive/web-room/v1/dM/gethistory?roomid=${roomId}`).then(BILIBILI_API_INTERCEPTOR);
};
