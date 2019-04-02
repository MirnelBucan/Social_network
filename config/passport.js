/**
 * Module dependencies.
 *  Passport is node module for handling authentication and authorization.
 *  We import local strategy for login with email and password,
 *  passport-jwt to handle authorization.
 */
const JwtStrategy = require('passport-jwt').Strategy,
  ExtractJwt = require('passport-jwt').ExtractJwt,
  LocalStrategy = require('passport-local').Strategy,
  config = require('./passport.cred'), //we import secret for passport
  comparePassword = require('../utils/comparePassword'), //import function for comparing password
  User = require('../models/users'); // we import our model for users

//function for extracting jwt from cookie
const cookieExtractor = function(req) {
  let token = null;
  if (req && req.cookies) token = req.cookies['Bearer'];
  return token;
};

/**
 *
  * @param passport instance of passport
 *  @description This function is for passport strategies configuration.
 */
module.exports = (passport) => {
  const opts = {};
  opts.jwtFromRequest = cookieExtractor; //we define function for jwt extraction
  opts.secretOrKey = config.secret; // secret for jwt decoding
  //we configure passport for jwt authorization
  passport.use(new JwtStrategy(opts, async (payload, done) => {
    //payload is jwt decoded
    try{
      //we check for user by id from token
      let user = await User.findById(payload.id);
      //if there is such user, callback user
      if(user) done(null,user);
      //if there isn't such user, callback false
      else done(null, false);
    }catch (err){
      //if error happens , callback error
      done(err, null);
    }
  }));
  /**
   * same as before, we configure passport for login with email and password.
   * we set options to use email instead of username
   */
  const localOpts = {
    usernameField: 'email'
  };
  passport.use('login', new LocalStrategy(localOpts,async (email, password, done) => {
    try{
      //find the user by email
      let user = await User.findOne({ email: email });
      //if such user , compare password with one from database
      if(user){
        let isMatch = await comparePassword(password, user.password);
        //if password match, callback user
        if(isMatch)
          return done(null,user);
      }
      //if they don't match callback false
      done(null,false);
    } catch (err){
      //if error callback err
      return done(err,null);
    }
  }));
};