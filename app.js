const createError = require('http-errors');
const express = require('express');
const path = require('path');
const session = require('cookie-session');
const logger = require('morgan');
const http = require('http');

const config = require('./config');
const indexRouter = require('./routes/indexRouter')

var app = express();
var server = http.Server(app);

var serverType = process.env.SERVER;
if(serverType == 'local') {
    app.locals.config = config.default;
}
else {
    app.locals.config = config.server;
}

// App Settings
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.set('port', app.locals.config.siteConfig.port);

// App Debugging
app.use(logger(':method :url :status :res[content-length] - :response-time ms'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Other App Features
app.use(session({
  name: 'session',
  keys: ['key1', 'key2'],
  maxAge: 24*60*60*1000 // 1 day
}))

app.use(express.static(path.join(__dirname, 'public')));

// App Routes
app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
    console.log("SOME ERROR HAS OCCURED");
});

app.use(function(err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500);
    res.render('error');
});

server.listen(app.locals.config.siteConfig.port, function() {
    console.log('Starting server on port ' + app.locals.config.siteConfig.port);
});
