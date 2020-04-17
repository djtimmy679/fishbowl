var timeLeft = 30;
var elem = document.getElementById('timer');
var timerId = setInterval(countdown, 1000);
var bool = false; 
var pauseBool = false; 
var mainPlayers = [];
var curMpIdx = 0; 
curWord = "";
playerList = []

function getPlayers(){
    for(var i=2; i <= 13; i++)
    {
        var divId = document.getElementById('game'+(''+i));
        if(divId.innerHTML.substring(0,1) != '<')
        {
            if(i%2 === 0){
                mainPlayers.push("" + i); 
            }
            playerList.push('game' + ("" + i)); 
            //console.log(playerList);
        }
    }
  //  console.log(mainPlayers)
}
function startGame(){
    playerList = [];
    getPlayers();
    var userName = document.getElementById('game' + mainPlayers[curMpIdx]);
    var userName2 = document.getElementById('game' + ("" + (parseInt(mainPlayers[curMpIdx])+1)));
    userName.style = 'background-color: yellow';
    userName2.style = 'background-color: yellow';
    bool = true; 
}
function endGame(){
    bool = false; 
}
function drawCard(){
    var numPlayers = playerList.length; 
    console.log(numPlayers);
    if (numPlayers % 2 !== 0){
        alert('Another Player Needed');
    }
    var userName = document.getElementById('game' + mainPlayers[curMpIdx]);
    var dictLength = DICTIONARY.length; 
    var word = DICTIONARY[Math.floor(DICTIONARY.length*Math.random())];
    curWord = word; 
    document.getElementById('yourWord').innerHTML = 'your word is: ' + word;
   // socket.emit('drawCard', {id: userName});
}
function correct() {
    socket.emit('removeWord', {word: curWord, curIdx: mainPlayers[curMpIdx]});
}
function pass() {
    drawCard(); 
}
function reset() {
    // for(var i = 2; i <= 13; i++){
    //     var temp = document.getElementById('game' + ("" + i));
    //     temp.innerHTML = "<button onclick=\"joinGame(this.parentElement.id);\">Move Here </button>";
    // }
    // for(var v = 1; v < 7; v++){
    //     var ok = document.getElementById('team' + ("" + v));
    //     ok.innerHTML = "";
    // }
    timeLeft = 30; 
    bool = false; 
    socket.emit('reset');
}
function noTime() {
    if(pauseBool){
        curMpIdx = (curMpIdx + 1) % mainPlayers.length; 
        var userName = document.getElementById('game' + mainPlayers[curMpIdx]);
        var userName2 = document.getElementById('game' + ("" + (parseInt(mainPlayers[curMpIdx])+1)));
        userName.style = 'background-color: yellow';
        userName2.style = 'background-color: yellow';
        timeLeft = 30;
    }
    else{
        var userName = document.getElementById('game' + mainPlayers[curMpIdx]);
        var userName2 = document.getElementById('game' + ("" + (parseInt(mainPlayers[curMpIdx])+1)));
        userName.style = '';
        userName2.style = '';
        timeLeft = 5; 
        //get ready time 
    }
    pauseBool = !pauseBool; 
    
    
}
function countdown() {
   // console.log(timeLeft)
    if (timeLeft == 0) {
        noTime();
    } else if(bool){
        //elem.innerHTML = timeLeft + ' seconds remaining';
        timeLeft--;
        socket.emit('timer', {time: timeLeft});
    }
}