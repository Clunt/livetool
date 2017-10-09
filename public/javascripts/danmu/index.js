$(function() {
  var socket = io('/danmu');


  socket.on('douyu', function (response) {
    console.log('douyu ->', response);
  });

  socket.on('message', function (response) {
    console.log('message ->', response.body);
  });

  socket.on('error', function (response) {
    console.log('error ->', response);
  });

  socket.on('connect', function () {
    console.log('连接成功');
  });

  socket.on('reconnect', function () {
    console.log('重连成功');
  });

  socket.on('disconnect', function () {
    console.log('失去连接');
  });

  socket.on('reconnect_error', function () {
    console.log('重链失败');
  });


})