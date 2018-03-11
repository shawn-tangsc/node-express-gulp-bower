var express = require('express');
var fs = require('fs');
var path = require('path');
var favicon = require('serve-favicon');
var mountRoutes = require('mount-routes')
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var hbs = require('hbs');

var routes = require('./routes/index');

var app = express();
var log4js = require('log4js');
log4js.configure('./config/log4js.json');
var logger = log4js.getLogger('normal');
logger.setLevel('INFO');
const serveStatic = require('serve-static');


app.use(log4js.connectLogger(logger, {level:'auto',format:' :status;:remote-addr:url  response-time=:response-time ms ; data ::res[body]' }));
//直接指向hbs
// app.set('view engine', 'hbs');
// app.set('views', path.join(__dirname, 'src/handlebars'));
// hbs.registerPartials(__dirname + '/src/handlebars/partials');

/*指向html后缀文件*/
app.set('views', path.join(__dirname, './views'));
app.engine("html",hbs.__express);
app.set('view engine', 'html');
app.use(serveStatic(path.resolve(__dirname, './views')));
// uncomment after placing your favicon in /public
//
// app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use('/public',express.static(path.join(__dirname, './public')));

mountRoutes(app, path.join(__dirname, 'routes'), false)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
    logger.error(err.message);
    logger.error(err.stacks);
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500);
    res.render('error');
});

// Node全局异常捕获
// process.on('uncaughtException', function (err) {
//
//
//     logger.error('An uncaught error occurred!')
//     logger.error(err.stack)
//     // Recommend: restart the server
// });

module.exports = app;
