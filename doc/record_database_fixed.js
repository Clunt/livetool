var record = {
  user: {},
  gift: {}
};
var data = [];
data.forEach(function(datum) {
  for (var uid in datum.user) {
    record.user[uid] = record.user[uid] || datum.user[uid];
  }
  for (var uid in datum.gift) {
    record.gift[uid] = Math.max(record.gift[uid] || 0, datum.gift[uid]);
  }
});
console.log(JSON.stringify(record))