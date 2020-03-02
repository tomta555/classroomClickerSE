var socket = io();
var playerAnswered = false;
var correct = false;
var name;
var score = 0;

var params = jQuery.deparam(window.location.search); //Gets the id from url


socket.on('connect', function() {
    //Tell server that it is host connection from game view
    socket.emit('player-join-game', params);
    showAns(params.type);
});

function showAns(type){
    tableAns ='';
    switch(type){
        case '4c': 
            tableAns =`
                <a onclick = "answerSubmitted(1,'4c')" id = "answer1" class = "button4c"><img src="../../img/triangle.png"></a>
                <a onclick = "answerSubmitted(2,'4c')" id = "answer2" class = "button4c"><img src="../../img/circle.png"></a>
                <br>
                <a onclick = "answerSubmitted(3,'4c')" id = "answer3" class = "button4c"><img src="../../img/square.png"></a>
                <a onclick = "answerSubmitted(4,'4c')" id = "answer4" class = "button4c"><img src="../../img/cross.png"></a>`;
            break;
        case '2c' : 
            tableAns =`
                <a onclick = "answerSubmitted(1,'2c')" id = "answer1" class = "button2c"><img src="../../img/triangle.png"></a>
                <a onclick = "answerSubmitted(2,'2c')" id = "answer2" class = "button2c"><img src="../../img/circle.png"></a>`;
            break;
        case 'sa' :
            tableAns =`
            <div class = "short" id="answer5">
                <input id = "inputanswer5" class = "shortanswertext" type="text"></input>
                <button onclick="shortAnswerSubmitted()">Submit</button>
            </div>`;
            break;
    }
    document.getElementById('card').innerHTML=tableAns;

}

socket.on('noGameFound', function(){
    window.location.href = '../../';//Redirect user to 'join game' page 
});

function answerSubmitted(num,type){
    if(playerAnswered == false){
        playerAnswered = true;
        
        socket.emit('playerAnswer', num);//Sends player answer to server
        document.body.style.backgroundColor = "rgb(238, 138, 20)"
        document.getElementById('waitans').style.display = "block";
        document.getElementById('waitans').innerHTML = "Answer Submitted!<br><br>Waiting for other players...";
        //Hiding buttons from user
        switch(type){
            case("4c"):
                document.getElementById('answer3').style.display = "none";
                document.getElementById('answer4').style.display = "none";
            case("2c"):
                document.getElementById('answer1').style.display = "none";
                document.getElementById('answer2').style.display = "none";
                break;
            case("sa"):
                document.getElementById('answer5').style.display = "none";  

        }
    }
}

function shortAnswerSubmitted(){
    var answer = document.getElementById('inputanswer5').value;
    answerSubmitted(answer,"sa");
}

//Get results on last question
socket.on('answerResult', function(data){
    if(data == true){
        correct = true;
    }
});

var messageTable = "";
socket.on('questionOver', function(data){
    document.getElementById('waitans').style.display = "none";
    document.getElementById('finish').style.display = "none";
    if(correct == true){
        document.body.style.backgroundColor = "#4CAF50";
        document.getElementById('message').style.display = "block";
        document.getElementById('message').innerHTML = "Correct!";
        messageTable = `
        <br><br>
        <img src="../../img/correct.png">`;
        document.getElementById('message').innerHTML += messageTable;
    }else{
        document.body.style.backgroundColor = "#f94a1e";
        document.getElementById('message').style.display = "block";
        document.getElementById('message').innerHTML = "Incorrect!";
        messageTable = `
        <br><br>
        <img src="../../img/incorrect.png">`;
        document.getElementById('message').innerHTML += messageTable;
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
    document.getElementById('message').style.display="none";
    document.getElementById('waitans').style.display = "none";
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

socket.on('GameOver', function(data){
    document.body.style.backgroundColor = "#c70000";
    document.getElementById('finish').style.display = "block";
    document.getElementById('finish').innerText = "FINISH!";
    messageTable = `
        <br><br><img src="../../img/3.gif">`;
        // <img src="../../img/finish.png" width="25%" height="25%">`;
        document.getElementById('finish').innerHTML += messageTable;
    document.getElementById('waitans').style.display = "none";
    document.getElementById('message').style.display = "none";
    document.getElementById('answer1').style.display = "none";
    document.getElementById('answer2').style.display = "none";
    document.getElementById('answer3').style.display = "none";
    document.getElementById('answer4').style.display = "none";
    document.getElementById('answer5').style.display = "none";
});

