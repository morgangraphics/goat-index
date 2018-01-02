const express = require('express');
const path = require('path');
// const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const lessMiddleware = require('less-middleware');
const hbs = require('hbs');
const hbsutils = require('hbs-utils')(hbs);
const config = require('config');
const helmet = require('helmet');

require('dotenv').config({ path: path.join(__dirname, 'config/.env') });

// Environment specific configuration stuff
const conf = config.get(process.env.NODE_ENV || 'development');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'app/views'));
app.set('view engine', 'hbs');

app.locals = conf;


// Partials location and monitor so I dont have to restart Node everytime I add one
// expose locals for templating
hbs.localsAsTemplateData(app);
hbsutils.registerPartials(path.join(__dirname, 'app/views/partials'));
hbsutils.registerWatchedPartials(path.join(__dirname, 'app/views/partials'));

// Protect the app
app.use(helmet());

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(lessMiddleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

app.use(require('./app/index'));
app.use(require('./app/news'));


// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
