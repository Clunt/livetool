exports.flatData = function flatData(data) {
  if (data instanceof Array) {
    return data.reduce((arr, i) => arr.concat(flatData(i)), []);
  } else if (data instanceof Object) {
    return [data];
  } else {
    return [];
  }
};

exports.parseOptionsParam = function parseOptionsParam(options, { key, type, value }) {
  switch (type) {
    case 'number':
      return parseInt(value, 10);
    case 'boolean':
      return !!options[value];
    case 'string':
    default:
      return value;
  }
};

exports.mergeArrayBuffer = function mergeArrayBuffer(e, t) {
  const n = new Uint8Array(e);
  const o = new Uint8Array(t);
  const r = new Uint8Array(n.byteLength + o.byteLength);
  r.set(n, 0);
  r.set(o, n.byteLength);
  return r.buffer;
};
