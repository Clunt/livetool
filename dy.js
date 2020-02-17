const net = require('net');
const SocketIO = require('socket.io');
const ws = require('nodejs-websocket');

const ROOM_ID = 2919896;

// console.log(SocketIO)
// const io = SocketIO('wss://danmuproxy.douyu.com:8502/');
// this.io.on('connection', (socket) => {
//   console.log(socket)
// });

const connection = ws.connect('wss://danmuproxy.douyu.com:8502/', {}, () => {});

// connection.sendText(str, [callback])
// connection.send(data, [callback])
connection.on('close', (...args) => console.log('close', args));
connection.on('error', (...args) => console.log('error', args));
connection.on('text', (...args) => console.log('text', args));
connection.on('pong', (...args) => console.log('pong', args));
connection.on('connect', (...args) => {
  console.log('connect', args)
  connection.send(encode(`type@=loginreq/roomid@=${ROOM_ID}/dfl@=sn@AA=105@ASss@AA=1/username@=157576640/uid@=157576640/ver@=20190610/aver@=218101901/ct@=0/`), () => {
    console.log('sendText')
  });
});
connection.on('binary', inStream => {
  // Empty buffer for collecting binary data
  var data = Buffer.alloc(0)
  // Read chunks of binary data and add to the buffer
  inStream.on("readable", function() {
    var newData = inStream.read();
    if (newData) {
      data = Buffer.concat([data, newData], data.length + newData.length);
    }
  })
  inStream.on("end", function() {
    console.log("Received " + data.length + " bytes of binary data")
    var response = data.toString();
    console.log(response)
  })

  // TODO 拆包
  // var response = data.toString();
  // var responseObject = parse(response);
  // if (!responseObject) {
  //   var error = new Error('未知响应');
  //   error.response = response;
  //   return callback(error);
  // }
  // callback(null, responseObject);

});

function encode(payload) {
  var data = new Buffer(4 + 4 + 4 + payload.length + 1)
  data.writeInt32LE(4 + 4 + payload.length + 1, 0); //length
  data.writeInt32LE(4 + 4 + payload.length + 1, 4); //code
  data.writeInt32LE(0x000002b1, 8); //magic
  data.write(payload, 12); //payload
  data.writeInt8(0, 4 + 4 + 4 + payload.length); //end of string
  return data;
};
