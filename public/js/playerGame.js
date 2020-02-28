var socket = io();
var playerAnswered = false;
var correct = false;
var name;
var score = 0;

var params = jQuery.deparam(window.location.search); //Gets the id from url


socket.on('connect', function() {
    //Tell server that it is host connection from game view
    console.log(params.type);
    socket.emit('player-join-game', params);
    showAns(params.type);
});

function showAns(type){
    tableAns ='';
    switch(type){
        case '4c': 
            tableAns =`
                <a onclick = "answerSubmitted(1)" id = "answer1" class = "button4c"><img src="../../img/circle.png"></a>
                <a onclick = "answerSubmitted(2)" id = "answer2" class = "button4c"><img src="../../img/cross.png"></a>
                <br>
                <a onclick = "answerSubmitted(3)" id = "answer3" class = "button4c"><img src="../../img/square.png"></a>
                <a onclick = "answerSubmitted(4)" id = "answer4" class = "button4c"><img src="../../img/triangle.png"></a>`;
            break;
        case '2c' : 
            tableAns =`
                <a onclick = "answerSubmitted(1)" id = "answer1" class = "button2c"><img src="../../img/circle.png"></a>
                <a onclick = "answerSubmitted(2)" id = "answer2" class = "button2c"><img src="../../img/cross.png"></a>`;
            break;
        case 'sa' :
            tableAns =`
            <form class = "short" id="answer5">
                <input id = "inputanswer5" class = "shortanswertext" type="text"></input>
                <button onclick="shortAnswerSubmitted()">Submit</button>
            </form>`;
            break;
    }
    document.getElementById('card').innerHTML=tableAns;

}

socket.on('noGameFound', function(){
    window.location.href = '../../';//Redirect user to 'join game' page 
});

function answerSubmitted(num){
    if(playerAnswered == false){
        playerAnswered = true;
        
        socket.emit('playerAnswer', num);//Sends player answer to server
        
        //Hiding buttons from user
        document.getElementById('answer1').style.visibility = "hidden";
        document.getElementById('answer2').style.visibility = "hidden";
        document.getElementById('answer3').style.visibility = "hidden";
        document.getElementById('answer4').style.visibility = "hidden";
        document.getElementById('message').style.display = "block";
        document.getElementById('message').innerHTML = "Answer Submitted! Waiting for other players...";
    }
}

function shortAnswerSubmitted(){
    var answer = document.getElementById('inputanswer5').value;
    answerSubmitted(answer);
}

//Get results on last question
socket.on('answerResult', function(data){
    if(data == true){
        correct = true;
    }
});

socket.on('questionOver', function(data){
    if(correct == true){
        document.body.style.backgroundColor = "#4CAF50";
        document.getElementById('message').style.display = "block";
        document.getElementById('message').innerHTML = "Correct!";
    }else{
        document.body.style.backgroundColor = "#f94a1e";
        document.getElementById('message').style.display = "block";
        document.getElementById('message').innerHTML = "Incorrect!";
    }        
    
    if(params.type =='4c' || params.type == '2c'){
        document.getElementById('answer1').style.visibility = "hidden";
        document.getElementById('answer2').style.visibility = "hidden";
        document.getElementById('answer3').style.visibility = "hidden";
        document.getElementById('answer4').style.visibility = "hidden";
    }
    else if(params.type=='sa'){
        document.getElementById('answer5').style.visibility = "hidden";
    }

    socket.emit('getScore');
});

socket.on('newScore', function(data){
    document.getElementById('scoreText').innerHTML = "Score: " + data;
});

socket.on('nextQuestionPlayer', function(type){
    correct = false;
    playerAnswered = false;
    showAns(type);
    document.getElementById('message').style.display = "none";
    document.body.style.backgroundColor = "white";
});

socket.on('hostDisconnect', function(){
    window.location.href = "../../";
});

socket.on('playerGameData', function(data){
   for(var i = 0; i < data.length; i++){
       if(data[i].playerId == socket.id){
           document.getElementById('nameText').innerHTML = "Name: " + data[i].name;
           document.getElementById('scoreText').innerHTML = "Score: " + data[i].gameData.score;
       }
   }
});

socket.on('GameOver', function(){
    document.body.style.backgroundColor = "#FFFFFF";
    document.getElementById('answer1').style.visibility = "hidden";
    document.getElementById('answer2').style.visibility = "hidden";
    document.getElementById('answer3').style.visibility = "hidden";
    document.getElementById('answer4').style.visibility = "hidden";
    document.getElementById('answer5').style.visibility = "hidden";
    document.getElementById('message').style.display = "block";
    document.getElementById('message').innerHTML = "GAME OVER";
});

