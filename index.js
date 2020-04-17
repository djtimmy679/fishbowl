var express = require('express');
var app = express();
var path = require('path');
var hbs = require('hbs');
var http = require('http').Server(app);
var io = require('socket.io')(http)
var mysql = require('mysql');
var cookieSession = require('cookie-session')
// -------------- express initialization -------------- //
app.set('port', process.env.PORT || 8080 );
app.set('view engine', 'hbs');

// -------------- serve static folders -------------- //
app.use('/client', express.static(path.join(__dirname, 'client')))
app.use(cookieSession({
  name: 'userCookie',                   
  keys: ['asdfg', 'hjkl']  
}))
// -------------- variable definition -------------- //
var pool  = mysql.createPool({
  connectionLimit : 12,
  user            : 'site_fishbowls',
  password        : 'q7Qg6zWCzZd9DjY6ds8FkAEv',
  host            : 'mysql1.csl.tjhsst.edu',
  port            : 3306,
  database        : 'site_fishbowls'
});
// -------------- express 'get' handlers -------------- //
app.get('/', function(req, res){
    console.log('no sub-page');
    res.render('index', {})
});
// app.get('/addToWordBank', function(req, res){ //helper function
//     //res.send('Hi')
//     console.log('Here');
//     var word = req.query.newWord; 
//     console.log(word);
//     pool.query('CALL add_proc(?);', [word], function (error, results, fields) {
//         if (error) throw error;

//         res.send('Added ' + word);
//         console.log('it worked');

//     });
// });
SOCKET_LIST = {}
TABLE_LIST = {}
DICTIONARY = []
var currentNumberOfUsers = 0; 
userPrefix = ['cool', 'awesome', 'effervescent', 'intellectual', 'large'];
userSuffix = ['tiger', 'student', 'person', 'table', 'dog', 'holmes'];
io.sockets.on('connection', function(socket){
    currentNumberOfUsers += 1;
    console.log('socket connection')
    var idx1 = "" + Math.floor(userPrefix.length*Math.random());
    var idx2 = "" + Math.floor(userSuffix.length*Math.random());
    socket.id = userPrefix[idx1] + '-' + userSuffix[idx2];
   // socket.connectionNum = currentNumberOfUsers;
    SOCKET_LIST[socket.id] = socket;
    setInterval();

    setTable();
    socket.on('disconnect', function(){
        delete SOCKET_LIST[socket.id];
        setInterval();
        if (socket.id in TABLE_LIST){
            delete TABLE_LIST[socket.id];
        }
        currentNumberOfUsers -=1; //might have to change all the users connection Numbers
    })
    socket.on('updateid', function(data){
        socket = SOCKET_LIST[socket.id]; 
        delete SOCKET_LIST[socket.id];
        socket.id = data.newId;
        if(socket.id in TABLE_LIST){
            delete TABLE_LIST[socket.id];
            TABLE_LIST[socket.id] = socket; 
            setTable();
        }
        SOCKET_LIST[data.newId] = socket; 
        setInterval(); 
    });
    socket.on('addWord', function(data){
        DICTIONARY.push(data.word); 
        console.log(DICTIONARY);
    });
    socket.on('drawCard', function(data){
        var dictLength = DICTIONARY.length; 
        var word = DICTIONARY[Math.floor(userPrefix.length*Math.random())];
        io.to(socket.id).emit('secretWord', {word:word});
    })
    socket.on('updateTable', function(data){
        socket.divId = data.divId; 
        TABLE_LIST[socket.id] = socket; 
        setTable(); 
    })
});
function setInterval(){
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
        console.log('its going in here');
        socket.emit('sendData', pack);
    }
    
} 
function setTable(){
    console.log(TABLE_LIST);
    var pack = [];
    for(var i in TABLE_LIST){
        var socket = TABLE_LIST[i];
     //   console.log("this is the socket" + socket.id);
        pack.push({
            id:socket.id,
            divId: socket.divId
           // connectionNum: socket.connectionNum
        }); //builds a pack of current users and their associated data
    }
    for(var i in TABLE_LIST){
        console.log('its emitting');
        var socket = TABLE_LIST[i];
        socket.emit('updateGameTable', pack);
    }
    
} 

// -------------- listener -------------- //
var listener = http.listen(app.get('port'), function() {
  console.log( 'Express server started on port: '+listener.address().port );
});