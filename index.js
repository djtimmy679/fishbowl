var express = require('express');
var app = express();
var path = require('path');
var hbs = require('hbs');
var http = require('http').Server(app);
var io = require('socket.io')(http)

// -------------- express initialization -------------- //
app.set('port', process.env.PORT || 8080 );
app.set('view engine', 'hbs');

// -------------- serve static folders -------------- //
app.use('/client', express.static(path.join(__dirname, 'client')))

// -------------- variable definition -------------- //

// -------------- express 'get' handlers -------------- //
app.get('/', function(req, res){
    console.log('no sub-page');
    res.render('index', {})
});
io.sockets.on('connection', function(socket){
    console.log('socket connection')
    
    socket.on('console msg', function(data){
        console.log(data.msg)
    });
});


// -------------- listener -------------- //
var listener = http.listen(app.get('port'), function() {
  console.log( 'Express server started on port: '+listener.address().port );
});