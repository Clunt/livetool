var Util = {};
Util.ajax = function(option, callback) {
  option = typeof option === 'string' ? {
    url: option
  } : option;
  var ajaxOption = {
    type: option.type || 'GET',
    url: option.url,
    timeout: 60000,
    data: option.data || '',
    dataType: option.dataType || 'json',
    contentType: option.contentType || 'application/x-www-form-urlencoded',
    cache: option.cache || false,
    success: function(result) {
      if ('function' !== typeof callback) return;
      if (Array.isArray(result)) {
        var code = result[0];
        if (0 === code) {
          callback(null, result[2], result);
        } else {
          callback({
            code: code,
            msg: errorMessage[code] || result[1] || '网络链接出错'
          }, {}, result);
        }
      } else {
        callback(result);
      }
    },
    error: function(xhr, status, err) {
      if ('function' !== typeof callback) return;
      var _code = xhr.status > 0 ? xhr.status : 1;
      callback({
        code: 1,
        msg: '网络链接出错',
      }, {}, {
        code: _code,
        msg: ''
      });
    }
  };
  return $.ajax(ajaxOption);
};


Util.copy = function(obj) {
  try {
    return JSON.parse(JSON.stringify(obj));
  } catch(e) {}
};