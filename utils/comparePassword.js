const bcrypt = require('bcrypt-nodejs'); //using bcrypt function for password hashing
module.exports = (password,passwordHash) =>{
  return new Promise((resolve, reject) => {
    //compare send password with password hash from db
    bcrypt.compare( password, passwordHash, (err, isMatch) => {
      if (err)  reject(err); //if error happens in function reject promise
       resolve(isMatch); //resolver if passwords match or not
    });
  });
};