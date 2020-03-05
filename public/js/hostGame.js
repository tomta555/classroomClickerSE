var socket = io();

var params = jQuery.deparam(window.location.search); //Gets the id from url

var timer;
var questionNumber = 0;
var time;
var type_Q;
var latestPlayerCount = 0;
var latestPlayerInGame = 0;
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
            <div id = "ans1">
                <h3 id = "answer1">${data.a1}</h3></div>
            <div class="revealAns" id="revealAns1"></div>
            <br>
            <div id = "ans2">
                <h3 id = "answer2">${data.a2}</h3></div>
            <div class="revealAns" id="revealAns2"></div>
            <br>
            <div id = "ans3">
                <h3 id = "answer3">${data.a3}</h3></div>
            <div class="revealAns" id="revealAns3"></div>
            <br>
            <div id = "ans4">
                <h3 id = "answer4">${data.a4}</h3></div>
            <div class="revealAns" id="revealAns4"></div>`
            var correctAnswer = data.correct;
            document.getElementById('questionNum').innerHTML = "Question " + questionNumber + " / ";  // Add total number of questions
            document.getElementById('playersAnswered').innerHTML = "Players Answered 0 / " + data.playersInGame;
            updateTimer();
            break;
        case "2c":
            type_Q = "2c"
            document.getElementById('QA123').innerHTML = `
            <h2 id = 'question'>${data.q1}</h2>
            <h3 id = 'answer1'>TRUE</h3>
            <br>
            <h3 id = 'answer2'>FALSE</h3>`
            var correctAnswer = data.correct;
            document.getElementById('questionNum').innerHTML = "Question " + questionNumber + " / ";  // Add total number of questions
            document.getElementById('playersAnswered').innerHTML = "Players Answered 0 / " + data.playersInGame;
            updateTimer();
            break;

        case "sa":
            type_Q = "sa"
            document.getElementById('questionNum').innerHTML = "Question " + questionNumber + " / ";  // Add total number of questions
            document.getElementById('QA123').innerHTML = `<h2 id = 'question'>${data.q1}</h2>`
            document.getElementById('playersAnswered').innerHTML = "Players Answered 0 / " + data.playersInGame;
            updateTimer();
            break;
    }
    latestPlayerInGame = data.playersInGame;
});

socket.on('updatePlayersAnswered', function (data) {
    document.getElementById('playersAnswered').innerHTML = "Players Answered " + data.playersAnswered + " / " + data.playersInGame;
    latestPlayerCount = data.playersAnswered + 1;
});

socket.on('questionOver', function (playerData, correct) {
    clearInterval(timer);
    var answer1 = 0;
    var answer2 = 0;
    var answer3 = 0;
    var answer4 = 0;
    var playerAns1 = 0;
    var playerAns2 = 0;
    var playerAns3 = 0;
    var playerAns4 = 0;
    var total = 0;

    document.getElementById('playersAnswered').innerHTML = "Players Answered " + latestPlayerCount + " / " + latestPlayerInGame;

    if (type_Q == '4c') {
        
        // document.getElementById('revealAns2').style.filter = "grayscale(75%)";
        // document.getElementById('revealAns3').style.filter = "grayscale(75%)";
        // document.getElementById('revealAns4').style.filter = "grayscale(75%)";
        //Shows user correct answer with effects on elements
        if (correct == 1) {
            document.getElementById('ans2').style.backgroundColor = "#9c9c9c";
            document.getElementById('ans3').style.backgroundColor = "#9c9c9c";
            document.getElementById('ans4').style.backgroundColor = "#9c9c9c";
            document.getElementById('ans2').style.webkitTransitionDuration = "1000ms"
            document.getElementById('ans2').style.TransitionDuration = "1000ms"
            document.getElementById('ans3').style.webkitTransitionDuration = "1000ms"
            document.getElementById('ans3').style.TransitionDuration = "1000ms"
            document.getElementById('ans4').style.webkitTransitionDuration = "1000ms"
            document.getElementById('ans4').style.TransitionDuration = "1000ms"
            document.getElementById('revealAns1').style.filter = "grayscale(50%)"
            var current = document.getElementById('answer1').innerHTML;
            document.getElementById('answer1').innerHTML = "&#10004" + " " + current;
        }
        else if (correct == 2) {
            document.getElementById('ans1').style.backgroundColor = "#9c9c9c";
            document.getElementById('ans3').style.backgroundColor = "#9c9c9c";
            document.getElementById('ans4').style.backgroundColor = "#9c9c9c";
            document.getElementById('ans1').style.webkitTransitionDuration = "1000ms"
            document.getElementById('ans1').style.TransitionDuration = "1000ms"
            document.getElementById('ans3').style.webkitTransitionDuration = "1000ms"
            document.getElementById('ans3').style.TransitionDuration = "1000ms"
            document.getElementById('ans4').style.webkitTransitionDuration = "1000ms"
            document.getElementById('ans4').style.TransitionDuration = "1000ms"
            document.getElementById('revealAns2').style.filter = "grayscale(50%)"
            var current = document.getElementById('answer2').innerHTML;
            document.getElementById('answer2').innerHTML = "&#10004" + " " + current;
        } 
        else if (correct == 3) {
            document.getElementById('ans1').style.backgroundColor = "#9c9c9c";
            document.getElementById('ans2').style.backgroundColor = "#9c9c9c";
            document.getElementById('ans4').style.backgroundColor = "#9c9c9c";
            document.getElementById('ans1').style.webkitTransitionDuration = "1000ms"
            document.getElementById('ans1').style.TransitionDuration = "1000ms"
            document.getElementById('ans2').style.webkitTransitionDuration = "1000ms"
            document.getElementById('ans2').style.TransitionDuration = "1000ms"
            document.getElementById('ans4').style.webkitTransitionDuration = "1000ms"
            document.getElementById('ans4').style.TransitionDuration = "1000ms"
            document.getElementById('revealAns3').style.filter = "grayscale(50%)"
            var current = document.getElementById('answer3').innerHTML;
            document.getElementById('answer3').innerHTML = "&#10004" + " " + current;
        }
        else if (correct == 4) {
            document.getElementById('ans1').style.backgroundColor = "#9c9c9c";
            document.getElementById('ans2').style.backgroundColor = "#9c9c9c";
            document.getElementById('ans3').style.backgroundColor = "#9c9c9c";
            document.getElementById('ans1').style.webkitTransitionDuration = "1000ms"
            document.getElementById('ans1').style.TransitionDuration = "1000ms"
            document.getElementById('ans2').style.webkitTransitionDuration = "1000ms"
            document.getElementById('ans2').style.TransitionDuration = "1000ms"
            document.getElementById('ans3').style.webkitTransitionDuration = "1000ms"
            document.getElementById('ans3').style.TransitionDuration = "1000ms"
            document.getElementById('revealAns4').style.filter = "grayscale(50%)"
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

        // Gets values for graph
        playerAns1 = answer1 / total * 100;
        playerAns2 = answer2 / total * 100;
        playerAns3 = answer3 / total * 100;
        playerAns4 = answer4 / total * 100;
        // Count players who answered this choice
        document.getElementById('answer1').innerHTML += `<span id = "countAns">(${answer1} players)</span>`;
        document.getElementById('answer2').innerHTML += `<span id = "countAns">(${answer2} players)</span>`;
        document.getElementById('answer3').innerHTML += `<span id = "countAns">(${answer3} players)</span>`;
        document.getElementById('answer4').innerHTML += `<span id = "countAns">(${answer4} players)</span>`;
        
        if(playerAns1 == 0) { playerAns1 = 0.99; }
        if(playerAns2 == 0) { playerAns2 = 0.99; }
        if(playerAns3 == 0) { playerAns3 = 0.99; }
        if(playerAns4 == 0) { playerAns4 = 0.99; }
        // Table width for revealAns
        document.getElementById('revealAns1').style.marginRight = (100-playerAns1).toString() + "%";
        document.getElementById('revealAns2').style.marginRight = (100-playerAns2).toString() + "%";
        document.getElementById('revealAns3').style.marginRight = (100-playerAns3).toString() + "%";
        document.getElementById('revealAns4').style.marginRight = (100-playerAns4).toString() + "%";
        // Shows revealAns that show statistics of players' answers
        document.getElementById('revealAns1').style.display = "block";
        document.getElementById('revealAns2').style.display = "block";
        document.getElementById('revealAns3').style.display = "block";
        document.getElementById('revealAns4').style.display = "block";
        // Next question button
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
        playerAns1 = answer1 / total * 100;
        playerAns2 = answer2 / total * 100;

        document.getElementById('square1').style.display = "inline-block";
        document.getElementById('square2').style.display = "inline-block";

        document.getElementById('square1').style.height = playerAns1 + "px";
        document.getElementById('square2').style.height = playerAns2 + "px";
        
        document.getElementById('nextQButton').style.display = "inline-block";
    } else if (type_Q == 'sa') {
        
        document.getElementById('nextQButton').style.display = "inline-block";

    }
});

function nextQuestion() {
    // restore answer block color
    document.getElementById('ans1').style.backgroundColor = "#00cc5f";
    document.getElementById('ans2').style.backgroundColor = "rgb(241, 48, 48)";
    document.getElementById('ans3').style.backgroundColor = "#f57deb";
    document.getElementById('ans4').style.backgroundColor = "#4dacc8";
    // restore all ans color
    document.getElementById('ans1').style.filter = "grayscale(0%)";
    document.getElementById('ans2').style.filter = "grayscale(0%)";
    document.getElementById('ans3').style.filter = "grayscale(0%)";
    document.getElementById('ans4').style.filter = "grayscale(0%)";
    // restore all revealAns color
    document.getElementById('revealAns1').style.filter = "grayscale(0%)";
    document.getElementById('revealAns2').style.filter = "grayscale(0%)";
    document.getElementById('revealAns3').style.filter = "grayscale(0%)";
    document.getElementById('revealAns4').style.filter = "grayscale(0%)";
    
    // hide all revealAns block
    if (type_Q == '4c') {
    document.getElementById('nextQButton').style.display = "none";
    document.getElementById('revealAns1').style.display = "none";
    document.getElementById('revealAns2').style.display = "none";
    document.getElementById('revealAns3').style.display = "none";
    document.getElementById('revealAns4').style.display = "none";
    }
    else if(type_Q='2c'){
        document.getElementById('nextQButton').style.display = "none";
        document.getElementById('revealAns1').style.display = "none";
        document.getElementById('revealAns2').style.display = "none";
   
    }else if(type_Q='sa'){
        document.getElementById('answer5').style.display = "none";
    }
    document.getElementById('playersAnswered').style.display = "block";
    document.getElementById('timerText').style.display = "block";
    document.getElementById('num').innerHTML = " 20";
    socket.emit('nextQuestion'); //Tell server to start new question
}

function updateTimer() {
    time = 20000;
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
    document.getElementById('revealAns1').style.display = "none";
    document.getElementById('revealAns2').style.display = "none";
    document.getElementById('revealAns3').style.display = "none";
    document.getElementById('revealAns4').style.display = "none";
    document.getElementById('QA123').style.display = "none";

    a = document.getElementById('answer1')
    b = document.getElementById('answer2')
    c = document.getElementById('answer3')
    d = document.getElementById('answer4')
    if(a!=undefined && b!=undefined && c!=undefined && d!=undefined){
        a.style.display = "none";
        b.style.display = "none";
        c.style.display = "none";
        d.style.display = "none";
    }
    document.getElementById('timerText').innerHTML = "";
    document.getElementById('question').style.display = 'none';
    document.getElementById('questionNum').innerHTML = "GAME RESULT";
    document.getElementById('playersAnswered').innerHTML = "THANKS FOR PLAYING";
    
    document.body.style.animation = "bgcolor 20s infinite";
    document.body.style.webkitAnimation = "bgcolor 10s infinite";
    document.body.style.animationDirection = "alternate";
    document.body.style.webkitAnimationDirection = "alternate";

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