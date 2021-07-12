const router = require('express').Router();

router.get('/', function(req, res, next) {
  // res.render('index', {
  //   config: config
  // });
  res.json([0, '', {
    index: true,
  }]);
});

exports = module.exports = router;
