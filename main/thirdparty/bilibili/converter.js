const CONSTANT = require('./constant');
const { BrotliDecode } = require('./brotli_decode');
const { flatData, parseOptionsParam, mergeArrayBuffer } = require('./util');

function Converter() {
  this.wsBinaryHeaderList = [{
    name: 'Header Length',
    key: "headerLen",
    bytes: 2,
    offset: CONSTANT.WS_HEADER_OFFSET,
    value: CONSTANT.WS_PACKAGE_HEADER_TOTAL_LENGTH
  }, {
    name: 'Protocol Version',
    key: "ver",
    bytes: 2,
    offset: CONSTANT.WS_VERSION_OFFSET,
    value: CONSTANT.WS_HEADER_DEFAULT_VERSION
  }, {
    name: 'Operation',
    key: "op",
    bytes: 4,
    offset: CONSTANT.WS_OPERATION_OFFSET,
    value: CONSTANT.WS_HEADER_DEFAULT_OPERATION
  }, {
    name: 'Sequence Id',
    key: "seq",
    bytes: 4,
    offset: CONSTANT.WS_SEQUENCE_OFFSET,
    value: CONSTANT.WS_HEADER_DEFAULT_SEQUENCE
  }];
  this.encoder = new TextEncoder();
  this.decoder = new TextDecoder();
}

Converter.prototype.toArrayBuffer = function(payload, sign) {
  const n = new ArrayBuffer(CONSTANT.WS_PACKAGE_HEADER_TOTAL_LENGTH);
  const r = new DataView(n, CONSTANT.WS_PACKAGE_OFFSET);
  const s = this.encoder.encode(payload);
  r.setInt32(CONSTANT.WS_PACKAGE_OFFSET, CONSTANT.WS_PACKAGE_HEADER_TOTAL_LENGTH + s.byteLength);
  this.wsBinaryHeaderList[2].value = sign;
  this.wsBinaryHeaderList.forEach(wsBinaryHeader => {
    if (4 === wsBinaryHeader.bytes) {
      r.setInt32(wsBinaryHeader.offset, wsBinaryHeader.value);
    } else {
      if (2 === wsBinaryHeader.bytes) {
        r.setInt16(wsBinaryHeader.offset, wsBinaryHeader.value);
      }
    }
  });
  return mergeArrayBuffer(n, s);
};

Converter.prototype.toObject = function(e) {
  var t = new DataView(e);
  var n = {
    body: []
  };
  n.packetLen = t.getInt32(CONSTANT.WS_PACKAGE_OFFSET);
  this.wsBinaryHeaderList.forEach(wsBinaryHeader => {
    if (4 === wsBinaryHeader.bytes ) {
      n[wsBinaryHeader.key] = t.getInt32(wsBinaryHeader.offset);
    } else {
      if (2 === wsBinaryHeader.bytes) {
        n[wsBinaryHeader.key] = t.getInt16(wsBinaryHeader.offset);
      }
    }
  });
  n.packetLen < e.byteLength && this.toObject(e.slice(0, n.packetLen));
  if (!n.op || CONSTANT.WS_OP_MESSAGE !== n.op && n.op !== CONSTANT.WS_OP_CONNECT_SUCCESS) {
    if (n.op && CONSTANT.WS_OP_HEARTBEAT_REPLY === n.op) {
      n.body = {
        count: t.getInt32(CONSTANT.WS_PACKAGE_HEADER_TOTAL_LENGTH)
      };
    }
  } else {
    let s = n.packetLen;
    let a = '';
    let u = '';
    for (let r = CONSTANT.WS_PACKAGE_OFFSET; r < e.byteLength; r += s) {
      s = t.getInt32(r);
      a = t.getInt16(r + CONSTANT.WS_HEADER_OFFSET);
      try {
        if (n.ver === CONSTANT.WS_BODY_PROTOCOL_VERSION_NORMAL) {
          const c = this.decoder.decode(e.slice(r + a, r + s));
          u = 0 !== c.length ? JSON.parse(c) : null;
        } else if (n.ver === CONSTANT.WS_BODY_PROTOCOL_VERSION_BROTLI) {
          const l = e.slice(r + a, r + s);
          const h = BrotliDecode(new Uint8Array(l));
          u = this.toObject(h.buffer).body;
        }
        if (u) {
          n.body.push(u);
        }
      } catch (t) {
        console.error('decode body error:', new Uint8Array(e), n, t);
      }
    }
  }
  return n;
};

exports = module.exports = Converter;
