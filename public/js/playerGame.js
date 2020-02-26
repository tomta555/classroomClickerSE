var socket = io();
var playerAnswered = false;
var correct = false;
var name;
var score = 0;
var questionType = 1;

var params = jQuery.deparam(window.location.search); //Gets the id from url

socket.on('connect', function() {
    //Tell server that it is host connection from game view
    socket.emit('player-join-game', params);
    switch(questionType){
        case 0:     // Multiple Choice
            document.getElementById('answer1').style.visibility = "visible";
            document.getElementById('answer2').style.visibility = "visible";
            document.getElementById('answer3').style.visibility = "visible";
            document.getElementById('answer4').style.visibility = "visible";
            break;
        case 1:     // True or False
            document.getElementById('answer1').style.visibility = "visible";
            document.getElementById('answer2').style.visibility = "visible";
            break;
        case 2:     // Short Answer
            document.getElementById('shortanswer').style.visibility = "visible";
            break;
    }
    
});

socket.on('noGameFound', function(){
    window.location.href = '../../';//Redirect user to 'join game' page 
});

function answerSubmitted(num){
    if(playerAnswered == false){
        playerAnswered = true;
        
        socket.emit('playerAnswer', num);//Sends player answer to server
        
        //Hiding buttons from user
        if(num == 5){
            document.getElementsByClassName('short').style.visibility = "hidden";
            document.getElementById('message').style.display = "block";
            document.getElementById('message').innerHTML = "Answer Submitted! Waiting on other players...";
        }else{
            document.getElementById('answer1').style.visibility = "hidden";
            document.getElementById('answer2').style.visibility = "hidden";
            document.getElementById('answer3').style.visibility = "hidden";
            document.getElementById('answer4').style.visibility = "hidden";
            document.getElementById('message').style.display = "block";
            document.getElementById('message').innerHTML = "Answer Submitted! Waiting on other players...";
        }
    }
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
    
    if(questionType == 0){
        document.getElementById('answer1').style.visibility = "hidden";
        document.getElementById('answer2').style.visibility = "hidden";
        document.getElementById('answer3').style.visibility = "hidden";
        document.getElementById('answer4').style.visibility = "hidden";
    } 
    else if(questionType == 1){
        document.getElementById('answer1').style.visibility = "hidden";
        document.getElementById('answer2').style.visibility = "hidden";
    }else{
        document.getElementById('shortanswer').style.visibility = "hidden";
    }
    socket.emit('getScore');
});

socket.on('newScore', function(data){
    document.getElementById('scoreText').innerHTML = "Score: " + data;
});

socket.on('nextQuestionPlayer', function(){
    correct = false;
    playerAnswered = false;
    
    if(questionType == 0) { // Multiple Choice
        document.getElementById('answer1').style.visibility = "visible";
        document.getElementById('answer2').style.visibility = "visible";
        document.getElementById('answer3').style.visibility = "visible";
        document.getElementById('answer4').style.visibility = "visible";
    } 
    else if(questionType == 1) { // True or False
        document.getElementById('answer1').style.visibility = "visible";
        document.getElementById('answer2').style.visibility = "visible";
    }
    else {  // Short Answer
        document.getElementById('shortanswer').style.visibility = "visible";
    }  
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
    if(questionType == 0){
        document.getElementById('answer1').style.visibility = "hidden";
        document.getElementById('answer2').style.visibility = "hidden";
        document.getElementById('answer3').style.visibility = "hidden";
        document.getElementById('answer4').style.visibility = "hidden";
    }else if(questionType == 1){
        document.getElementById('answer1').style.visibility = "hidden";
        document.getElementById('answer2').style.visibility = "hidden";
    }else{
        document.getElementById('shortanswer').style.visibility = "hidden";
    }
    document.getElementById('message').style.display = "block";
    document.getElementById('message').innerHTML = "GAME OVER";
});

