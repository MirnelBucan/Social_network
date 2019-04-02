

const createError = require('http-errors'),
      express = require('express'),
      path = require('path'),
      cookieParser = require('cookie-parser'),
      logger = require('morgan'),
      favicon = require('serve-favicon'),
      bodyParser = require('body-parser'),
      mongoose = require('mongoose'),
      cors = require('cors'),
      expressValidator = require('express-validator'),
      passport = require('passport'),
      indexRouter = require('./routes/index'),
      homeRouter = require('./routes/home'),
      profileRouter = require('./routes/profiles'),
      postRouter = require('./routes/posts'),
      chatRouter = require('./routes/chat');

// Connect to database

mongoose.connect('mongodb://localhost:27017/social_network',{ useNewUrlParser: true , useCreateIndex: true })
        .then(()=> { console.log("Connected to database!"); })
        .catch(err => {
          console.log(`Unable to connect to MongoDB!\nError: ${err}`);
          process.exit(1);
        });

mongoose.Promise = global.Promise;

var app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(cors());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser({
  secret: 'neka%pravo$opasna_tajna',
  httpOnly: true,
}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
    let namespace = param.split('.'),
      root = namespace.shift(),
      formParam = root;
    while (namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param: formParam,
      msg: msg,
      value: value
    };
  }
}));
app.use(passport.initialize());
require('./config/passport')(passport);


app.use('/', indexRouter);
app.use('/home', passport.authenticate('jwt', { session: false, failureRedirect: '/' }), homeRouter);
app.use('/profile', passport.authenticate('jwt', { session: false, failureRedirect: '/' }), profileRouter);
app.use('/post', passport.authenticate('jwt', { session: false, failureRedirect: '/' }), postRouter);
app.use('/chat', passport.authenticate('jwt', { session: false, failureRedirect: '/' }), chatRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page

  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;


