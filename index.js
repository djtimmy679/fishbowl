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
SOCKET_LIST = {}
var currentNumberOfUsers = 0; 
userPrefix = ['cool', 'awesome', 'effervescent', 'intellectual', 'large'];
userSuffix = ['tiger', 'student', 'person', 'table', 'dog', 'holmes'];
io.sockets.on('connection', function(socket){
    currentNumberOfUsers += 1;
    console.log('socket connection')
    var idx1 = "" + Math.floor(userPrefix.length*Math.random());
    var idx2 = "" + Math.floor(userSuffix.length*Math.random());
    socket.id = userPrefix[idx1] + '-' + userSuffix[idx2]
   // socket.connectionNum = currentNumberOfUsers;
    SOCKET_LIST[socket.id] = socket;
    socket.on('console msg', function(data){
        console.log(data.msg)
    });
    socket.on('disconnect', function(){
        delete SOCKET_LIST[socket.id];
        currentNumberOfUsers -=1; //might have to change all the users connection Numbers
    })
    socket.on('updateid', function(data){
        socket = SOCKET_LIST[socket.id]; 
        delete SOCKET_LIST[socket.id];
        socket.id = data.newId;
        SOCKET_LIST[data.newId] = socket; 
    });
});
setInterval(function(){
    var pack = [];
    for(var i in SOCKET_LIST){
        var socket = SOCKET_LIST[i];
     //   console.log("this is the socket" + socket.id);
        pack.push({
            id:socket.id
           // connectionNum: socket.connectionNum
        }); //builds a pack of current users and their associated data
    }
    for(var i in SOCKET_LIST){
        var socket = SOCKET_LIST[i];
        socket.emit('sendData', pack);
    }
    
},1000/25); 

// -------------- listener -------------- //
var listener = http.listen(app.get('port'), function() {
  console.log( 'Express server started on port: '+listener.address().port );
});