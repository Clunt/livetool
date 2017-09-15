exports.parseJSON = function(jsonStr) {
  try {
    return JSON.parse(String(jsonStr));
  } catch (e) {}
  return null;
};