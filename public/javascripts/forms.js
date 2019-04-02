// We add function to execute when document is ready
//this function runs once when document becomes ready
$(document).ready(_init);

// We add 2 handlers , for login and register form.
function _init(){
  $('#login-form').on('submit',handleLogin);
  $('#reg-form').on('submit',handleReg);
}

// We implement our login handler
function handleLogin(e){
  e.preventDefault(); //prevent default behaviour of element
  e.stopPropagation(); //prevent bubbling up event in dom

  let email = $('#email').val().trim(),
   password = $('#password').val().trim();
  //if email doesn't match RegEX pattern , alert user his mail is invalid format
  if(email.match(/^[A-Z0-9+_.-]+@[A-Z0-9.-]+$/)){
    alert('Invalid email');
    return;
  }

  if(password.length < 4) {
    alert('Password is too short');
    return;
  }
  // Send request to server for login
  $.ajax({
    url:  '/user/signin',
    method: 'POST',
    data :{email, password}, //send data to server as JSON object
    success: function(response){ // handle response from server , triggers on status 2xx
      alert('success');
      location.assign('/home'); //if we login successfully , redirect user to next page
    }, // if server responds with status 4xx || 5xx , handle error
    error: function(response, statusText, error){
      if(response.status === 401)
        alert('Invalid username/password');
      else if(reponse.status === 500)
        alert('Error on server, pls try again in 5min');
    }
  });
}

function handleReg(e){
  e.preventDefault();
  e.stopPropagation();

  let email = $('#input-email').val().trim(),
    username = $('#input-username').val().trim(),
    password = $('#input-password').val().trim(),
    name = capitalize($('#input-first').val().trim()),
    surname = capitalize($('#input-surname').val().trim());

  if(email.match(/^[A-Z0-9+_.-]+@[A-Z0-9.-]+$/)){
    alert('Invalid email');
    return;
  }
  if(password.length < 4) {
    alert('Password is too short');
    return;
  }
  $.ajax({
    url:  '/user/create',
    method: 'POST',
    data :{email, password , username, name, surname},
    success: function(response){
      alert('success register, proceed to login');
      location.assign('/');
    },
    error: function(response, statusText, error){
      alert('Error during registration');
    }
  });
}
//function to re-format name
function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}