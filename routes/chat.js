var express = require('express');
var router = express.Router();
const User = require('../models/users');

//GET index page
router.get('/', (req, res, next) => {
  let user = {
    email: req.user.email,
    name: req.user.name,
    surname: req.user.surname,
    username: req.user.username
  };
  res.render('chat', { user ,chat:'user'});
});
router.get('/:id', async (req, res, next) => {
  if(req.params.id  === req.user._id){
    let user = {
      email: req.user.email,
      name: req.user.name,
      surname: req.user.surname,
      username: req.user.username
    };
    res.render('chat', { user ,chat :'user'});
  } else {
    const userById = await User.findById(req.params.id);
    const user = {
      name: userById.name,
      email: userById.email,
      surname: userById.surname,
      username: userById.username,
    };
    res.render('chat', { user , chat:'other'});
  }
});

module.exports = router;