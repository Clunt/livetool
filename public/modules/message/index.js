const ROOM_ID = 2919896;
main();
function main() {
  const ws = 'wss://danmuproxy.douyu.com:8502/';
  socket = new WebSocket(ws),
  socket.binaryType = 'arraybuffer';
  socket.onclose = () => console.log('onclose', arguments);
  socket.onerror = () => console.log('onerror', arguments);
  socket.onopen = function() {
    console.log('onopen', arguments);
    sendMessage(`type@=loginreq/roomid@=${ROOM_ID}/dfl@=sn@AA=105@ASss@AA=1/username@=157576640/uid@=157576640/ver@=20190610/aver@=218101901/ct@=0/`);
    // sendMessage('type@=loginreq/roomid@=63136/dfl@=sn@AA=105@ASss@AA=1/username@=157576640/password@=/ltkid@=65624792/biz@=1/stk@=b59d5705c7d077dd/devid@=82b8993351cbf9c4fd63225700031501/ct@=0/pt@=2/cvr@=0/tvr@=7/apd@=/rt@=1581944157/vk@=f68fa6f881a59d20422c4c44050a65c0/ver@=20190610/aver@=218101901/dmbt@=chrome/dmbv@=79/');
  };
  socket.onmessage = decodeMessage(msg => {
      const { body } = parse(msg);
      console.log('onmessage', body)
      switch (body.type) {
        case 'loginres':
          sendMessage(`type@=joingroup/rid@=${ROOM_ID}/gid@=-9999/`);
          break;
        default:
          console.log(body.type);
      }
  });
  function sendMessage(msg) {
    socket.send(encode(msg));
  }
  window.danmu = {
    socket: socket,
    send: sendMessage,
  };
  function concat() {
    for (var e = arguments.length, t = Array(e), r = 0; r < e; r++) t[r] = arguments[r];
    return t.reduce(function(e, t) {
      e instanceof ArrayBuffer && (e = new Uint8Array(e)), t instanceof ArrayBuffer && (t = new Uint8Array(t));
      var r = new Uint8Array(e.length + t.length);
      return r.set(e, 0), r.set(t, e.length), r
    })
  }
  function encode(e) {
    let littleEndian = true;
    let encoder = new TextEncoder();
    let n = (0, concat)(encoder.encode(e), [0]);
    let o = 8 + n.byteLength;
    let i = new DataView(new ArrayBuffer(o + 4));
    let a = 0;
    return i.setUint32(a, o, littleEndian),
    a += 4,
    i.setUint32(a, o, littleEndian),
    a += 4,
    i.setInt16(a, 689, littleEndian),
    a += 2,
    i.setInt8(a, 0),
    a += 1,
    i.setInt8(a, 0),
    a += 1,
    new Uint8Array(i.buffer).set(n, a),
    i.buffer
  }

  function decodeMessage(cb) {
    return event => decode(event.data, msg => cb(msg));
  }

  let buffer = [];
  let readLength = 0;
  function decode(e, t) {
    let littleEndian = true;
    let decoder = new TextDecoder();
    for (
      buffer ? buffer = concat(buffer, e).buffer : buffer = e;
      buffer && buffer.byteLength > 0;
    ) {
      var i = new DataView(buffer);
      if (0 === readLength) {
        if (buffer.byteLength < 4) return;
        readLength = i.getUint32(0, littleEndian), buffer = buffer.slice(4)
      }
      if (buffer.byteLength < readLength) return;
      var a = decoder.decode(buffer.slice(8, readLength - 1));
      buffer = buffer.slice(readLength), readLength = 0, t(a)
    }
  }

  function parse(response) {
    var typeIndex = response.indexOf('type@=');
    if (typeIndex < 0) return null;
    response = response.slice(typeIndex);
    var responseArray = response.split('/');
    var responseObject = {};
    responseArray.forEach(function(message) {
      if (!message) return;
      var msgArr = message.split('@=');
      var key = String(msgArr[0]).trim();
      var value = msgArr[1];
      if (key.length === 0) return;
      responseObject[key] = (value || '').replace(/@S/g, '/').replace(/@A/g, '@');
    });
    if (!responseObject.type) return null;
    return {
      raw: response,
      body: responseObject
    };
  }
}
