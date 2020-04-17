var timeLeft = 30;
var elem = document.getElementById('timer');
var timerId = setInterval(countdown, 1000);
var bool = false; 
var mainPlayers = ['2','4','6','8','10', '12'];
var curMpIdx = 0; 
playerList = []
getPlayers();
startGame(); 
function getPlayers(){
    for(var i=2; i < 13; i++)
    {
        var divId = document.getElementById('game'+(''+i));
        if(divId.innerHTML.substring(0,1) != '<')
        {
            playerList.push('game' + ("" + i)); 
            console.log(playerList);
        }
    }
}
function drawCard(){
    var numPlayers = playerList.length; 

    if (numPlayers.length % 2 !== 0){
        alert('Another Player Needed');
    }
    var userName = document.getElementById('game' + mainPlayers[curMpIdx]);
    socket.emit('drawCard', {
        id: userName
    });
}

function noTime() {
    if(bool){
        curMpIdx = (curMpIdx + 1) % 6; 
        timeLeft = 30;
    }
    else{
        timeLeft = 5; 
        //get ready time 
    }
    bool = !bool; 
    
    
    
}
function countdown() {
    if (timeLeft == 0) {
        noTime();
    } else if(bool){
        elem.innerHTML = timeLeft + ' seconds remaining';
        timeLeft--;
    }
}