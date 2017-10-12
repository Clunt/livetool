exports.parseJSON = function(jsonStr) {
  try {
    return JSON.parse(String(jsonStr));
  } catch (e) {}
  return null;
};

exports.copy = function(obj) {
  try {
    return JSON.parse(JSON.stringify(obj));
  } catch (e) {}
  return null;
};