const router = require('express').Router();
// GET home page
router.get('/' ,(req, res, next) => {
  res.render('home'); // Render home page
});

module.exports = router;