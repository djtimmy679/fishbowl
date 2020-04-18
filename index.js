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
SOCKET_LIST = {};
TABLE_LIST = {};
POINTS = {};
DICTIONARY = [];
TIMER = 30;
var timerId = setInterval(countdown, 1000);
bool = false; 
pauseBool = false; 
var currentNumberOfUsers = 0; 
userPrefix = ['cool', 'awesome', 'effervescent', 'intellectual', 'large', 'siced','honorable', 'happy', 'amazing', 'dumb', 'perfect'];
userSuffix = ['tiger', 'student', 'person', 'table', 'dog', 'homie','sicer', 'empress', 'elephant', 'exerciser', 'bromie', 'dawg'];
io.sockets.on('connection', function(socket){
    currentNumberOfUsers += 1;
    console.log('socket connection')
    var idx1 = "" + Math.floor(userPrefix.length*Math.random());
    var idx2 = "" + Math.floor(userSuffix.length*Math.random());
    socket.id = userPrefix[idx1] + '-' + userSuffix[idx2];
   // socket.connectionNum = currentNumberOfUsers;
    SOCKET_LIST[socket.id] = socket;
    socket.on('disconnect', function(){
        delete SOCKET_LIST[socket.id];
        if (socket.id in TABLE_LIST){
            delete TABLE_LIST[socket.id];
        }
        currentNumberOfUsers -=1; //might have to change all the users connection Numbers
    })
    // socket.on('timer', function(data){
    //     TIMER = data.time; 
    // })
    socket.on('pause', function(data){
        bool = false; 
    });
    socket.on('updateid', function(data){
        socket = SOCKET_LIST[socket.id]; 
        delete SOCKET_LIST[socket.id];
        if(socket.id in TABLE_LIST){
            socket.id = data.newId;
            delete TABLE_LIST[socket.id];
            TABLE_LIST[socket.id] = socket; 
        }
        socket.id = data.newId;
        SOCKET_LIST[data.newId] = socket; 
    });
    socket.on('startGame', function(data){
        bool = true; 
        pauseBool = true; 
        noTime(); 
        for(var i in SOCKET_LIST){
            var socket = SOCKET_LIST[i];
            socket.emit('clientStart', {});
        }
    })
    socket.on('addWord', function(data){
        DICTIONARY.push(data.word); 
        console.log(DICTIONARY);
    });
    socket.on('removeWord', function(data){
        var idx = DICTIONARY.indexOf(data.word); 
        delete DICTIONARY[idx];
        console.log('game' + (''+(parseInt(data.curIdx)+1)));
        if('game' + (''+data.curIdx) in POINTS)
            POINTS['game' + (''+data.curIdx)] += 1;
        else 
            POINTS['game' + (''+(parseInt(data.curIdx)+1))] += 1;

    })
    // socket.on('drawCard', function(data){
    //     var dictLength = DICTIONARY.length; 
    //     var word = DICTIONARY[Math.floor(userPrefix.length*Math.random())];
    //     console.log(word);
    //     console.log(socket.id);
    //     io.to(`${socketId}`).emit('secretWord', {word:word});
    // })
    socket.on('updateTable', function(data){
        socket.divId = data.divId; 
        TABLE_LIST[socket.id] = socket; 
        console.log(data.divId);
        if(Object.keys(TABLE_LIST).length % 2 === 0){
            POINTS[socket.divId] = 0;
            console.log(POINTS);
        }
    })
    socket.on('reset', function(data){
        TABLE_LIST = {}
        POINTS = {}
        DICTIONARY = []
        TIMER = 30
        bool = false; 
    })
});
function noTime() {
    if(pauseBool){

        TIMER = 30;
    }
    else{

        TIMER = 5; 
        //get ready time 
    }
    pauseBool = !pauseBool; 
    for(var i in SOCKET_LIST){
        var socket = SOCKET_LIST[i];
        socket.emit('highlight', {pauseBool: pauseBool});
    }
    
}
function countdown() {
    if (TIMER === 0) {
        noTime();
    } else if(bool){
        //elem.innerHTML = timeLeft + ' seconds remaining';
        TIMER--;
    }
}
setInterval(function(){
    var packLobby = [];
    var packTable = []; 
    for(var i in SOCKET_LIST){
        var socket = SOCKET_LIST[i];
     //   console.log("this is the socket" + socket.id);
        packLobby.push({
            id:socket.id
           // connectionNum: socket.connectionNum
        }); //builds a pack of current users and their associated data
    }
    for(var x in TABLE_LIST){
        var socketT = TABLE_LIST[x];
     //   console.log("this is the socket" + socket.id);
        packTable.push({
            id:socketT.id,
            divId: socketT.divId
           // connectionNum: socket.connectionNum
        }); //builds a pack of current users and their associated data
    }
    for(var y in SOCKET_LIST){
        var socketFin = SOCKET_LIST[y];
       // console.log('its going in here');
        socketFin.emit('sendData', {
            pack: packLobby, 
            table: packTable,
            timer: TIMER,
            dictionary: DICTIONARY,
            points: POINTS
        });

    }
    
}, 1000/40);
// function setTable(){
//     console.log(TABLE_LIST);
//     var pack = [];
//     for(var i in TABLE_LIST){
//         var socket = TABLE_LIST[i];
//      //   console.log("this is the socket" + socket.id);
//         pack.push({
//             id:socket.id,
//             divId: socket.divId
//           // connectionNum: socket.connectionNum
//         }); //builds a pack of current users and their associated data
//     }
//     for(var i in TABLE_LIST){
//         console.log('its emitting');
//         var socket = TABLE_LIST[i];
//         socket.emit('updateGameTable', pack);
//     }
    
// } 

// -------------- listener -------------- //
var listener = http.listen(app.get('port'), function() {
  console.log( 'Express server started on port: '+listener.address().port );
});