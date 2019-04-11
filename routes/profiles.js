const router = require('express').Router();
const User = require('../models/users');

router.get('/', (req, res, next) => {
  let user = {
    email: req.user.email,
    name: req.user.name,
    surname: req.user.surname,
    username: req.user.username
  };
  res.render('profile', { user ,profile:'user'});
});
router.get('/:id', async (req, res, next) => {
  if(req.params.id  === req.user._id){
    let user = {
      email: req.user.email,
      name: req.user.name,
      surname: req.user.surname,
      username: req.user.username
    };
    res.render('profile', { user ,profile :'user'});
  }else {
    const userById = await User.findById(req.params.id);
    const user = {
      name: userById.name,
      email: userById.email,
      surname: userById.surname,
      username: userById.username,
    };
    res.render('profile', { user , profile:'other'});
  }
});
module.exports = router;