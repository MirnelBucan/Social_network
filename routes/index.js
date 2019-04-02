var express = require('express');
var router = express.Router();
const User = require('../models/users');
const sanitizeUser = require('../utils/sanitzeUser');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const config = require('../config/passport.cred');


//GET index page
router.get('/', function (req, res, next) {
  res.render('index');
});

//POST register form handle
router.post('/user/create', async (req, res, next) => {
    //Get the values from request
    let email = req.body.email;
    let username = req.body.username;
    let password = req.body.password;
    let name = req.body.name;
    let surname = req.body.surname;
    //validate data sent to server
    req.checkBody('email', 'Email field is required').notEmpty();
    req.checkBody('email', 'Email is not valid').isEmail().escape();
    req.checkBody('username', 'Username field is required').escape();
    req.checkBody('password', 'Password field is required').notEmpty().escape();
    req.checkBody('name', 'Invalid usage of name').escape();
    req.checkBody('surname', 'Invalid usage of surname').escape();
    //if there is error during validation , extract them
    const errors = req.validationErrors();
    //check if there any error occurred
    if (errors) {
      //if error respond to user with that error and status 400 (Bad request)
      res.status(400).json(errors);
    } else {
      //no errors occurred , try to save user to db
      try {
        //make instance of our model
        let user = new User({
          email: email,
          username: username,
          password: password,
          name: name,
          surname: surname
        });
        //now we save it ( insert in db )
        let result = await user.save();
        //respond to user with message
        res.json({msg: 'Successfully register'});
      } catch (err) {
        //if error during insert in database occurs  respond with status 409 - conflict
        res.status(409).json(err);
      }
    }
  }
);
// POST signin
router.post('/user/signin', passport.authenticate('login', { session: false }), function(req, res, next){
  //sanitize function restricts what information we want to store in cookie
  const usr = sanitizeUser(req.user);
  // generate jwt token, set expiration in 24h
  const token = jwt.sign(usr,config.secret, { expiresIn: '24h'});
  //set cookie expiration in 24h
  const expires= new Date(Date.now()+(1000*60*60*24));
  //set token in cookie, and respond to client
  res.cookie('Bearer',token,{httpOnly:true,expires:expires}).json({token: `${token}`, succes: true});
});
//GET signout
router.get('/user/signout' ,(req, res, next) =>{
  //invalidate cookie
  res.clearCookie('Bearer');
  //redirect user to index page
  res.redirect('/');
});

module.exports = router;
