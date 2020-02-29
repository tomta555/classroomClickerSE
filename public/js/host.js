var socket = io();
var params = jQuery.deparam(window.location.search);

//When host connects to server
socket.on('connect', function() {

    document.getElementById('players').value = "";
    
    //Tell server that it is host connection
    socket.emit('host-join', params);
});

socket.on('showGamePin', function(data){
   document.getElementById('gamePinText').innerHTML = data.pin;
});

var playerTable = "";
var i = 0;
//Adds player's name to screen and updates player count
socket.on('updatePlayerLobby', function(data){
    
    // document.getElementById('players').innerHTML = "";
    
    if(i % 3 == 0){
        playerTable += `<tr><td>${data[i].name}</td>`;
    } 
    else if(i % 3 == 1){
        playerTable += `<td>${data[i].name}</td>`;
    }
    else if(i % 3 == 2){
        playerTable += `<td>${data[i].name}</td></tr>`;
    }
    document.getElementById('players').innerHTML = playerTable;
    i++;
    document.getElementById('playerCount').innerHTML = i.toString();
});

//Tell server to start game if button is clicked
function startGame(){
    socket.emit('startGame');
}

function endGame(){
    window.location.href = "../../create/index.html";
}

//When server starts the game
socket.on('gameStarted', function(id){
    console.log('Game Started!');
    window.location.href="/host/game/" + "?id=" + id;
});

socket.on('noGameFound', function(){
   window.location.href = '../../';//Redirect user to 'join game' page
});

