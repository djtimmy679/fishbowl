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

SOCKET_LIST = {};
TABLE_LIST = {};
POINTS = {};
DICTIONARY = [];
ALREADY_SEEN = new Set(); 
TIMER = 30;
teamNumber = 0; 
currTeam = 0; 
var timerId = setInterval(countdown, 1000);
bool = false; 

var currentNumberOfUsers = 0; 
userPrefix = ['cool', 'awesome', 'effervescent', 'intellectual', 'large', 'siced','honorable', 'happy', 'amazing', 'dumb', 'perfect'];
userSuffix = ['tiger', 'student', 'person', 'table', 'dog', 'homie','sicer', 'empress', 'elephant', 'exerciser', 'bromie', 'dawg'];
io.sockets.on('connection', function(socket){
    currentNumberOfUsers += 1;
    console.log('socket connection')
    var idx1 = "" + Math.floor(userPrefix.length*Math.random());
    var idx2 = "" + Math.floor(userSuffix.length*Math.random());
    socket.id = userPrefix[idx1] + '-' + userSuffix[idx2];
    socket.emit('welcome', {message:socket.id});
   // socket.connectionNum = currentNumberOfUsers;
    SOCKET_LIST[socket.id] = socket;
    socket.on('disconnect', function(){
        delete SOCKET_LIST[socket.id];
        currentNumberOfUsers -=1; //might have to change all the users connection Numbers
    })
    // socket.on('timer', function(data){
    //     TIMER = data.time; 
    // })
    socket.on('pause', function(data){
        bool = false; 
    });
    socket.on('drawCard', function(data){
        //var userName = document.getElementById('game' + mainPlayers[curMpIdx]);
        if(DICTIONARY.length - ALREADY_SEEN.size === 5){
            socket.emit('under5');
        }
        if(DICTIONARY.length - ALREADY_SEEN.size === 0)
        {
            socket.emit('noWords');
        }
        else{
            var idx = Math.floor(DICTIONARY.length*Math.random());
            while(ALREADY_SEEN.has(idx))
            {
                idx = Math.floor(DICTIONARY.length*Math.random());
            }
    
            var word = DICTIONARY[idx];
            socket.emit('retWord', {curWord:word}); 
        }
    })
    socket.on('updateid', function(data){
        socket = SOCKET_LIST[socket.id]; 
        for(var team in POINTS){
            var curplayers = POINTS[team].players; 
            if(curplayers[0] == socket.id){
                POINTS[team].players = [data.newId, curplayers[1]];
                break; 
            }
            else if(curplayers[1] == socket.id){
                POINTS[team].players = [curplayers[0], data.newId]; 
                break; 
            }
        }
        delete SOCKET_LIST[socket.id];
        socket.id = data.newId;
        SOCKET_LIST[data.newId] = socket; 
    });
    socket.on('updateteamid', function(data){
        socket = SOCKET_LIST[socket.id];
        if(socket.team in POINTS){
            POINTS['' + socket.team].name = data.newId; 
        }


    });
    socket.on('startGame', function(data){
        socket = SOCKET_LIST[socket.id];
        console.log(POINTS);
        console.log(TABLE_LIST.length);
        if((Object.keys(POINTS).length * 2) == TABLE_LIST.length){

            bool = true; 
            for(var i in SOCKET_LIST){
                var socket2 = SOCKET_LIST[i];
                socket2.emit('clientStart', {
                    mainP1: SOCKET_LIST[POINTS[currTeam].players[0]].divId,
                    mainP2: SOCKET_LIST[POINTS[currTeam].players[1]].divId
                });
            }
        }
        else{
            socket.emit('oddPlayer');
        }

    });
    socket.on('resumeGame', function(data){
        bool = true; 
    });
    socket.on('addWord', function(data){
        DICTIONARY.push(data.word); 

    });
    socket.on('removeWord', function(data){
        socket = SOCKET_LIST[socket.id];
        var idx = DICTIONARY.indexOf(data.word); 
        console.log(idx);
        ALREADY_SEEN.add(idx); 
        if(socket.team in POINTS)
            POINTS['' + socket.team].pts += 1;

        for(var i in SOCKET_LIST){
            var socket2 = SOCKET_LIST[i];
            socket2.emit('showEveryone', {word: data.word});
        }

    });

    socket.on('updateTable', function(data){
        socket = SOCKET_LIST[socket.id];
        if(!socket.inTable){
            socket.inTable = true; 
            socket.divId = data.divId; 
            TABLE_LIST = [];
            for(var s in SOCKET_LIST){
                var ss = SOCKET_LIST[s];
                if(ss.inTable){
                    TABLE_LIST.push(ss.id); 
                }
            }

            for(var n = 0; n < TABLE_LIST.length; n++){
                var i = TABLE_LIST[n]; 
                var nums = parseInt(data.divId.substring(4));
                if(nums%2 == 0 && ('game' + (''+(nums+1))) == SOCKET_LIST[i].divId){
                    SOCKET_LIST[i].team = teamNumber; 
                    SOCKET_LIST[socket.id].team = teamNumber; 
                    POINTS[teamNumber] = {pts:0, name:teamNumber, players:[socket.id, i]}; 
                    teamNumber += 1; 
                    break; 
                }
                else if(nums%2 != 0 && ('game' + (''+(nums-1))) == SOCKET_LIST[i].divId){
                    SOCKET_LIST[i].team = teamNumber; 
                    SOCKET_LIST[socket.id].team = teamNumber; 
                    POINTS[teamNumber] = {pts:0, name:teamNumber, players:[socket.id, i]}; 
                    teamNumber += 1; 
                    break; 
                }
            }


        }
    });
    socket.on('resetDict', function(data){
        ALREADY_SEEN.clear();
        console.log(ALREADY_SEEN);
    })
    socket.on('reset', function(data){
        TABLE_LIST = {}
        POINTS = {}
        DICTIONARY = []
        TIMER = 30
        bool = false; 
        teamNumber = 0; 
        for(var i in SOCKET_LIST){
            var socket = SOCKET_LIST[i];
            socket.inTable = false; 
            socket.emit('clearTeams', {});
        }
    
    });
});
function noTime() {
    TIMER = 30; 
    bool = false; 

    prevTeam = currTeam; 
    currTeam = (currTeam + 1)%(teamNumber); 
    console.log(currTeam);
    for(var i in SOCKET_LIST){
        var socket = SOCKET_LIST[i];
        socket.emit('highlight', {                   
            mainP1: SOCKET_LIST[POINTS[currTeam].players[0]].divId,
            mainP2: SOCKET_LIST[POINTS[currTeam].players[1]].divId,
            prevP1: SOCKET_LIST[POINTS[prevTeam].players[0]].divId,
            prevP2: SOCKET_LIST[POINTS[prevTeam].players[1]].divId
        });
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
    for(var i in SOCKET_LIST){
        var socket = SOCKET_LIST[i];
        packLobby.push({
            id:socket.id,
            divId: socket.divId,
            inTable: socket.inTable
            
           // connectionNum: socket.connectionNum
        }); //builds a pack of current users and their associated data
    }

    for(var y in SOCKET_LIST){
        var socketFin = SOCKET_LIST[y];
        socketFin.emit('sendData', {
            pack: packLobby, 
            timer: TIMER,
            points: POINTS
        });

    }
    
}, 1000/40);


// -------------- listener -------------- //
var listener = http.listen(app.get('port'), function() {
  console.log( 'Express server started on port: '+listener.address().port );
});