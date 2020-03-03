var socket = io();

var params = jQuery.deparam(window.location.search); //Gets the id from url

var timer;
var questionNumber = 0;
var time;
var type_Q;
//When host connects to server
socket.on('connect', function () {

    //Tell server that it is host connection from game view
    socket.emit('host-join-game', params);
});

socket.on('noGameFound', function () {
    window.location.href = '../../';//Redirect user to 'join game' page
});

socket.on('gameQuestions', function (data) {
    questionNumber += 1; 
    switch (data.type) {
        case "4c":
            type_Q = "4c"
            document.getElementById('QA123').innerHTML= `
            <h2 id = "question">${data.q1}</h2>
            <h3 id = "answer1">${data.a1}</h3>
            <br>
            <h3 id = "answer2">${data.a2}</h3>
            <br>
            <h3 id = "answer3">${data.a3}</h3>
            <br>
            <h3 id = "answer4">${data.a4}</h3>`
            var correctAnswer = data.correct;
            document.getElementById('questionNum').innerHTML = "Question " + questionNumber;
            document.getElementById('playersAnswered').innerHTML = "Players Answered 0 / " + data.playersInGame;
            updateTimer();
            break;
        case "2c":
            type_Q = "2c"
            document.getElementById('QA123').innerHTML = `
        <h2 id = 'question'>${data.q1}</h2>
        <h3 id = 'answer1'>True</h3>
        <br>
        <h3 id = 'answer2'>False</h3>`

            var correctAnswer = data.correct;
            document.getElementById('questionNum').innerHTML = "Question " + questionNumber;
            document.getElementById('playersAnswered').innerHTML = "Players Answered 0 / " + data.playersInGame;
            updateTimer();
            break;

        case "sa":
            type_Q = "sa"
            document.getElementById('questionNum').innerHTML = "Question " + questionNumber;
            document.getElementById('QA123').innerHTML = `<h2 id = 'question'>${data.q1}</h2>`
            document.getElementById('playersAnswered').innerHTML = "Players Answered 0 / " + data.playersInGame;
            updateTimer();
            break;
    }

});

socket.on('updatePlayersAnswered', function (data) {
    document.getElementById('playersAnswered').innerHTML = "Players Answered " + data.playersAnswered + " / " + data.playersInGame;
});

socket.on('questionOver', function (playerData, correct) {
    clearInterval(timer);
    var answer1 = 0;
    var answer2 = 0;
    var answer3 = 0;
    var answer4 = 0;
    var total = 0;
    //Hide elements on page
    // document.getElementById('playersAnswered').style.display = "none";
    // document.getElementById('timerText').style.display = "none";
    
    if (type_Q == '4c') {
        //Shows user correct answer with effects on elements
        if (correct == 1) {
            document.getElementById('answer2').style.filter = "grayscale(50%)";
            document.getElementById('answer3').style.filter = "grayscale(50%)";
            document.getElementById('answer4').style.filter = "grayscale(50%)";
            var current = document.getElementById('answer1').innerHTML;
            document.getElementById('answer1').innerHTML = "&#10004" + " " + current;
        } else if (correct == 2) {
            document.getElementById('answer1').style.filter = "grayscale(50%)";
            document.getElementById('answer3').style.filter = "grayscale(50%)";
            document.getElementById('answer4').style.filter = "grayscale(50%)";
            var current = document.getElementById('answer2').innerHTML;
            document.getElementById('answer2').innerHTML = "&#10004" + " " + current;
        } else if (correct == 3) {
            document.getElementById('answer1').style.filter = "grayscale(50%)";
            document.getElementById('answer2').style.filter = "grayscale(50%)";
            document.getElementById('answer4').style.filter = "grayscale(50%)";
            var current = document.getElementById('answer3').innerHTML;
            document.getElementById('answer3').innerHTML = "&#10004" + " " + current;
        } else if (correct == 4) {
            document.getElementById('answer1').style.filter = "grayscale(50%)";
            document.getElementById('answer2').style.filter = "grayscale(50%)";
            document.getElementById('answer3').style.filter = "grayscale(50%)";
            var current = document.getElementById('answer4').innerHTML;
            document.getElementById('answer4').innerHTML = "&#10004" + " " + current;
        }

        for (var i = 0; i < playerData.length; i++) {
            if (playerData[i].gameData.answer == 1) {
                answer1 += 1;
            } else if (playerData[i].gameData.answer == 2) {
                answer2 += 1;
            } else if (playerData[i].gameData.answer == 3) {
                answer3 += 1;
            } else if (playerData[i].gameData.answer == 4) {
                answer4 += 1;
            }
            total += 1;
        }

        //Gets values for graph
        answer1 = answer1 / total * 100;
        answer2 = answer2 / total * 100;
        answer3 = answer3 / total * 100;
        answer4 = answer4 / total * 100;

        document.getElementById('square1').style.display = "inline-block";
        document.getElementById('square2').style.display = "inline-block";
        document.getElementById('square3').style.display = "inline-block";
        document.getElementById('square4').style.display = "inline-block";

        document.getElementById('square1').style.height = answer1 + "px";
        document.getElementById('square2').style.height = answer2 + "px";
        document.getElementById('square3').style.height = answer3 + "px";
        document.getElementById('square4').style.height = answer4 + "px";

        document.getElementById('nextQButton').style.display = "inline-block";
    } else if (type_Q == '2c') {
        if (correct == 1) {
            document.getElementById('answer2').style.filter = "grayscale(50%)";
            var current = document.getElementById('answer1').innerHTML;
            document.getElementById('answer1').innerHTML = "&#10004" + " " + current;
        } else if (correct == 2) {
            document.getElementById('answer1').style.filter = "grayscale(50%)";
            var current = document.getElementById('answer2').innerHTML;
            document.getElementById('answer2').innerHTML = "&#10004" + " " + current;
        }
        
        for (var i = 0; i < playerData.length; i++) {
            if (playerData[i].gameData.answer == 1) {
                answer1 += 1;
            } else if (playerData[i].gameData.answer == 2) {
                answer2 += 1;
            }
            total += 1;
        }

        //Gets values for graph
        answer1 = answer1 / total * 100;
        answer2 = answer2 / total * 100;

        document.getElementById('square1').style.display = "inline-block";
        document.getElementById('square2').style.display = "inline-block";

        document.getElementById('square1').style.height = answer1 + "px";
        document.getElementById('square2').style.height = answer2 + "px";
        
        document.getElementById('nextQButton').style.display = "inline-block";
    } else if (type_Q == 'sa') {
        
        document.getElementById('nextQButton').style.display = "inline-block";

    }
});

function nextQuestion() {
    if (type_Q == '4c') {
    document.getElementById('nextQButton').style.display = "none";
    document.getElementById('square1').style.display = "none";
    document.getElementById('square2').style.display = "none";
    document.getElementById('square3').style.display = "none";
    document.getElementById('square4').style.display = "none";
    }
    else if(type_Q='2c'){
        document.getElementById('nextQButton').style.display = "none";
        document.getElementById('square1').style.display = "none";
        document.getElementById('square2').style.display = "none";
    }else if(type_Q='sa'){
        document.getElementById('answer5').style.display = "none";
    }
    document.getElementById('playersAnswered').style.display = "block";
    document.getElementById('timerText').style.display = "block";
    document.getElementById('num').innerHTML = " 20";
    socket.emit('nextQuestion'); //Tell server to start new question
}

function updateTimer() {
    time = 20;
    timer = setInterval(function () {
        time -= 1;
        document.getElementById('num').textContent = " " + time;
        if (time == 0) {
            socket.emit('timeUp');
        }
    }, 1000);
}

socket.on('GameOver', function (data) {
    
    document.getElementById('nextQButton').style.display = "none";
    document.getElementById('square1').style.display = "none";
    document.getElementById('square2').style.display = "none";
    document.getElementById('square3').style.display = "none";
    document.getElementById('square4').style.display = "none";

    a = document.getElementById('answer1'); if(a!=undefined) a.style.display = "none";
    b = document.getElementById('answer2'); if(b!=undefined) b.style.display = "none";
    c = document.getElementById('answer3'); if(c!=undefined) c.style.display = "none";
    d = document.getElementById('answer4'); if(d!=undefined) d.style.display = "none";

    document.getElementById('timerText').innerHTML = "";
    document.getElementById('question').style.display = 'none';
    document.getElementById('questionNum').innerHTML = "GAME RESULT";
    document.getElementById('playersAnswered').innerHTML = "THANKS FOR PLAYING";
    
    document.getElementById('winner1').style.display = "block";
    document.getElementById('winner2').style.display = "block";
    document.getElementById('winner3').style.display = "block";
    document.getElementById('winner4').style.display = "block";
    document.getElementById('winner5').style.display = "block";
    document.getElementById('plate').style.display = "block";
    document.getElementById('winnerTitle').style.display = "block";
    document.getElementById('backButton').style.display = "block";

    document.getElementById('winner1').innerHTML = "1st " + data.num1;
    document.getElementById('winner2').innerHTML = "2nd " + data.num2;
    document.getElementById('winner3').innerHTML = "3rd " + data.num3;
    document.getElementById('winner4').innerHTML = "4th " + data.num4;
    document.getElementById('winner5').innerHTML = "5th " + data.num5;
});

function backButton() {
    window.location.href = "../../create";
}

socket.on('getTime', function (player) {
    socket.emit('time', {
        player: player,
        time: time
    });
});




















