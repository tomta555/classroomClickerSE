//Import dependencies
const path = require('path');
const port = process.env.PORT || 3000
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const LocalStrategy = require('passport-local').Strategy;
const flash = require('connect-flash');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const sharedsession = require("express-socket.io-session");
//Import classes
const { LiveGames } = require('./utils/liveGames');
const { Players } = require('./utils/players');

//Init express, create server and instance
var app = express();

var server = http.createServer(app);
var io = socketIO(server);

var games = new LiveGames();
var players = new Players();

var Q_type;

//Mongodb setup

var configDB = require('../public/config/database');
var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
var mongoose = require('mongoose');
var url = "mongodb://localhost:27017/";

mongoose.connect(configDB.url);

//config app
var sessionMiddleware = session({
    secret: 'clsroclker',// session secret
    resave: false,
    saveUninitialized: false,
})
require('../public/config/passport')(passport);
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())
app.use(sessionMiddleware);

//Path
const publicPath = path.join(__dirname, '../public');
app.use(express.static(publicPath));

app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash());
require('../public/config/routes')(app, passport);

io.use(sharedsession(sessionMiddleware, {
    autoSave: true
}));





//Starting server on port 3000
server.listen(port, () => {
    console.log("Server started on port 3000");
});

//When a connection to server is made from client
io.on('connection', (socket) => {
    //When open pages


    socket.on('get-user-detail', function () {
        var userID = socket.handshake.session.passport
        if (socket.handshake.session.passport != undefined) {
            // console.log(userID)
            MongoClient.connect(url, function (err, db) {
                if (err) throw err;
                var dbo = db.db('classroomClicker');
                dbo.collection('users').findOne({ _id: ObjectID(userID.user) }, function (err, result) {
                    if (err) throw err;
                    // result
                    // get user data here
                    socket.emit('user-detail', result)
                })
            })
        }
    });

    socket.on('get-courses', (data) => {
        MongoClient.connect(url, function (err, db) {
            if (err) throw err;
            var dbo = db.db('classroomClicker');
            dbo.collection('courses').find({"teacher" : { $in : [data] }}).toArray(function (err, result) {
                if (err) throw err;
                socket.emit('course-detail', result);
            });
        })
    });


    //When host connects for the first time
    socket.on('host-join', (data) => {

        //Check to see if id passed in url corresponds to id of quiz game in database
        MongoClient.connect(url, function (err, db) {
            if (err) throw err;
            var dbo = db.db("classroomClicker");
            var query = { id: parseInt(data.id) };
            dbo.collection('Quizzes').find(query).toArray(function (err, result) {
                if (err) throw err;
                //A quiz was found with the id passed in url
                if (result[0] !== undefined) {
                    var gamePin = Math.floor(Math.random() * 90000) + 10000; //new pin for game

                    games.addGame(gamePin, socket.id, false, { playersAnswered: 0, questionLive: false, gameid: data.id, question: 1 }); //Creates a game with pin and host id

                    var game = games.getGame(socket.id); //Gets the game data

                    socket.join(game.pin);//The host is joining a room based on the pin

                    console.log('Game Created with pin:', game.pin);

                    //Sending game pin to host so they can display it for players to join
                    socket.emit('showGamePin', {
                        pin: game.pin
                    });
                } else {
                    socket.emit('noGameFound');
                }
                db.close();
            });
        });

    });

    //When the host connects from the game view
    socket.on('host-join-game', (data) => {
        var oldHostId = data.id;
        var game = games.getGame(oldHostId);//Gets game with old host id
        if (game) {
            game.hostId = socket.id;//Changes the game host id to new host id
            socket.join(game.pin);
            var playerData = players.getPlayers(oldHostId);//Gets player in game
            for (var i = 0; i < Object.keys(players.players).length; i++) {
                if (players.players[i].hostId == oldHostId) {
                    players.players[i].hostId = socket.id;
                }
            }
            var gameid = game.gameData['gameid'];
            MongoClient.connect(url, function (err, db) {
                if (err) throw err;

                var dbo = db.db('classroomClicker');
                var query = { id: parseInt(gameid) };
                dbo.collection("Quizzes").find(query).toArray(function (err, res) {
                    if (err) throw err;

                    var question = res[0].questions[0].question;
                    var answer1 = res[0].questions[0].answers[0];
                    var answer2 = res[0].questions[0].answers[1];
                    var answer3 = res[0].questions[0].answers[2];
                    var answer4 = res[0].questions[0].answers[3];
                    var correctAnswer = res[0].questions[0].correct;
                    Q_type = res[0].questions[0].type;
                    socket.emit('gameQuestions', {
                        q1: question,
                        a1: answer1,
                        a2: answer2,
                        a3: answer3,
                        a4: answer4,
                        correct: correctAnswer,
                        playersInGame: playerData.length,
                        type: Q_type
                    });
                    // Q_type = "2c";
                    io.to(game.pin).emit('gameStartedPlayer', Q_type);
                    game.gameData.questionLive = true;
                    db.close();
                });
            });

        } else {
            socket.emit('noGameFound');//No game was found, redirect user
        }
    });

    //When player connects for the first time
    socket.on('player-join', (params) => {

        var gameFound = false; //If a game is found with pin provided by player

        //For each game in the Games class
        for (var i = 0; i < games.games.length; i++) {
            //If the pin is equal to one of the game's pin
            if (params.pin == games.games[i].pin) {

                console.log('Player connected to game');

                var hostId = games.games[i].hostId; //Get the id of host of game


                players.addPlayer(hostId, socket.id, params.name, { score: 0, answer: 0 }); //add player to game

                socket.join(params.pin); //Player is joining room based on pin

                var playersInGame = players.getPlayers(hostId); //Getting all players in game

                io.to(params.pin).emit('updatePlayerLobby', playersInGame);//Sending host player data to display
                gameFound = true; //Game has been found
            }
        }

        //If the game has not been found
        if (gameFound == false) {
            socket.emit('noGameFound'); //Player is sent back to 'join' page because game was not found with pin
        }


    });

    //When the player connects from game view
    socket.on('player-join-game', (data) => {
        var player = players.getPlayer(data.id);
        if (player) {
            var game = games.getGame(player.hostId);
            socket.join(game.pin);
            player.playerId = socket.id;//Update player id with socket id

            var playerData = players.getPlayers(game.hostId);
            socket.emit('playerGameData', playerData);
        } else {
            socket.emit('noGameFound');//No player found
        }

    });

    //When a host or player leaves the site
    socket.on('disconnect', () => {
        var game = games.getGame(socket.id); //Finding game with socket.id
        //If a game hosted by that id is found, the socket disconnected is a host
        if (game) {
            //Checking to see if host was disconnected or was sent to game view
            if (game.gameLive == false) {
                games.removeGame(socket.id);//Remove the game from games class
                console.log('Game ended with pin:', game.pin);

                var playersToRemove = players.getPlayers(game.hostId); //Getting all players in the game

                //For each player in the game
                for (var i = 0; i < playersToRemove.length; i++) {
                    players.removePlayer(playersToRemove[i].playerId); //Removing each player from player class
                }

                io.to(game.pin).emit('hostDisconnect'); //Send player back to 'join' screen
                socket.leave(game.pin); //Socket is leaving room
            }
        } else {
            //No game has been found, so it is a player socket that has disconnected
            var player = players.getPlayer(socket.id); //Getting player with socket.id
            //If a player has been found with that id
            if (player) {
                var hostId = player.hostId;//Gets id of host of the game
                var game = games.getGame(hostId);//Gets game data with hostId
                var pin = game.pin;//Gets the pin of the game

                if (game.gameLive == false) {
                    players.removePlayer(socket.id);//Removes player from players class
                    var playersInGame = players.getPlayers(hostId);//Gets remaining players in game

                    io.to(pin).emit('updatePlayerLobby', playersInGame);//Sends data to host to update screen
                    socket.leave(pin); //Player is leaving the room

                }
            }
        }

    });

    //Sets data in player class to answer from player
    socket.on('playerAnswer', function (num, type) {
        var player = players.getPlayer(socket.id);
        var hostId = player.hostId;
        var playerNum = players.getPlayers(hostId);
        var game = games.getGame(hostId);
        if (game.gameData.questionLive == true) {//if the question is still live
            player.gameData.answer = num;
            game.gameData.playersAnswered += 1;

            var gameQuestion = game.gameData.question;
            var gameid = game.gameData.gameid;
            MongoClient.connect(url, function (err, db) {
                if (err) throw err;
                // console.log(num.toUpperCase())        
                var dbo = db.db('classroomClicker');
                var query = { id: parseInt(gameid) };
                dbo.collection("Quizzes").find(query).toArray(function (err, res) {
                    if (err) throw err;
                    var correctAnswer = res[0].questions[gameQuestion - 1].correct;
                    var NubAnsSA = res[0].questions[gameQuestion - 1].answers.length;
                    var isCorrect = false;
                    var score = res[0].questions[gameQuestion - 1].score;
                    //Checks player answer with correct answer
                    if (type == "sa") {
                        num = num.toUpperCase()
                        for (var i = 0; i < NubAnsSA; i++) {
                            tempCorrect = res[0].questions[gameQuestion - 1].answers[i];
                            tempCorrect = tempCorrect.toUpperCase();
                            if(num == tempCorrect) isCorrect = true;
                        }
                    }
                    if (num == correctAnswer || iscorrect) {
                        player.gameData.score += score;
                        // player.answeredQuestion.push({});
                        io.to(game.pin).emit('getTime', socket.id);
                        socket.emit('answerResult', true);
                    }
                    //Checks if all players answered
                    if (game.gameData.playersAnswered == playerNum.length) {
                        game.gameData.questionLive = false; //Question has been ended bc players all answered under time
                        var playerData = players.getPlayers(game.hostId);
                        io.to(game.pin).emit('questionOver', playerData, correctAnswer);//Tell everyone that question is over
                    } else {
                        //update host screen of num players answered
                        io.to(game.pin).emit('updatePlayersAnswered', {
                            playersInGame: playerNum.length,
                            playersAnswered: game.gameData.playersAnswered
                        });
                    }

                    db.close();
                });
            });



        }
    });

    socket.on('getScore', function () {
        var player = players.getPlayer(socket.id);
        socket.emit('newScore', player.gameData.score);
    });

    socket.on('time', function (data) {
        var time = data.time / 20;
        time = time * 100;
        var playerid = data.player;
        var player = players.getPlayer(playerid);
        player.gameData.score += time;
    });



    socket.on('timeUp', function () {
        var game = games.getGame(socket.id);
        game.gameData.questionLive = false;
        var playerData = players.getPlayers(game.hostId);

        var gameQuestion = game.gameData.question;
        var gameid = game.gameData.gameid;

        MongoClient.connect(url, function (err, db) {
            if (err) throw err;

            var dbo = db.db('classroomClicker');
            var query = { id: parseInt(gameid) };
            dbo.collection("Quizzes").find(query).toArray(function (err, res) {
                if (err) throw err;

                var dbo = db.db('classroomClicker');
                var query = { id: parseInt(gameid) };
                dbo.collection("Quizzes").find(query).toArray(function (err, res) {
                    if (err) throw err;
                    var correctAnswer = res[0].questions[gameQuestion - 1].correct;
                    var type = res[0].questions[gameQuestion - 1].type;
                    io.to(game.pin).emit('questionOver', playerData, correctAnswer, type);

                    db.close();
                });
            });
        });
    });

    socket.on('nextQuestion', function () {
        var playerData = players.getPlayers(socket.id);
        //Reset players current answer to 0
        for (var i = 0; i < Object.keys(players.players).length; i++) {
            if (players.players[i].hostId == socket.id) {
                players.players[i].gameData.answer = 0;
            }
        }

        var game = games.getGame(socket.id);
        game.gameData.playersAnswered = 0;
        game.gameData.questionLive = true;
        game.gameData.question += 1;
        var gameid = game.gameData.gameid;



        MongoClient.connect(url, function (err, db) {
            if (err) throw err;

            var dbo = db.db('classroomClicker');
            var query = { id: parseInt(gameid) };
            dbo.collection("Quizzes").find(query).toArray(function (err, res) {
                if (err) throw err;

                if (res[0].questions.length >= game.gameData.question) {
                    var questionNum = game.gameData.question;
                    questionNum = questionNum - 1;
                    var question = res[0].questions[questionNum].question;
                    var answer1 = res[0].questions[questionNum].answers[0];
                    var answer2 = res[0].questions[questionNum].answers[1];
                    var answer3 = res[0].questions[questionNum].answers[2];
                    var answer4 = res[0].questions[questionNum].answers[3];
                    var correctAnswer = res[0].questions[questionNum].correct;
                    Q_type = res[0].questions[questionNum].type;
                    socket.emit('gameQuestions', {
                        q1: question,
                        a1: answer1,
                        a2: answer2,
                        a3: answer3,
                        a4: answer4,
                        correct: correctAnswer,
                        playersInGame: playerData.length,
                        type: Q_type
                    });
                    io.to(game.pin).emit('nextQuestionPlayer', Q_type);
                    db.close();
                } else {
                    var playersInGame = players.getPlayers(game.hostId);
                    var first = { name: "", score: 0 };
                    var second = { name: "", score: 0 };
                    var third = { name: "", score: 0 };
                    var fourth = { name: "", score: 0 };
                    var fifth = { name: "", score: 0 };

                    for (var i = 0; i < playersInGame.length; i++) {
                        console.log(playersInGame[i].gameData.score);
                        if (playersInGame[i].gameData.score > fifth.score) {
                            if (playersInGame[i].gameData.score > fourth.score) {
                                if (playersInGame[i].gameData.score > third.score) {
                                    if (playersInGame[i].gameData.score > second.score) {
                                        if (playersInGame[i].gameData.score > first.score) {
                                            //First Place
                                            fifth.name = fourth.name;
                                            fifth.score = fourth.score;

                                            fourth.name = third.name;
                                            fourth.score = third.score;

                                            third.name = second.name;
                                            third.score = second.score;

                                            second.name = first.name;
                                            second.score = first.score;

                                            first.name = playersInGame[i].name;
                                            first.score = playersInGame[i].gameData.score;
                                        } else {
                                            //Second Place
                                            fifth.name = fourth.name;
                                            fifth.score = fourth.score;

                                            fourth.name = third.name;
                                            fourth.score = third.score;

                                            third.name = second.name;
                                            third.score = second.score;

                                            second.name = playersInGame[i].name;
                                            second.score = playersInGame[i].gameData.score;
                                        }
                                    } else {
                                        //Third Place
                                        fifth.name = fourth.name;
                                        fifth.score = fourth.score;

                                        fourth.name = third.name;
                                        fourth.score = third.score;

                                        third.name = playersInGame[i].name;
                                        third.score = playersInGame[i].gameData.score;
                                    }
                                } else {
                                    //Fourth Place
                                    fifth.name = fourth.name;
                                    fifth.score = fourth.score;

                                    fourth.name = playersInGame[i].name;
                                    fourth.score = playersInGame[i].gameData.score;
                                }
                            } else {
                                //Fifth Place
                                fifth.name = playersInGame[i].name;
                                fifth.score = playersInGame[i].gameData.score;
                            }
                        }
                    }

                    io.to(game.pin).emit('GameOver', {
                        num1: first.name,
                        num2: second.name,
                        num3: third.name,
                        num4: fourth.name,
                        num5: fifth.name
                    });
                }
            });
        });


    });

    //When the host starts the game
    socket.on('startGame', () => {
        var game = games.getGame(socket.id);//Get the game based on socket.id
        game.gameLive = true;
        socket.emit('gameStarted', game.hostId);//Tell player and host that game has started
    });

    //Give user game names data
    socket.on('requestDbNames', function (data) {

        MongoClient.connect(url, function (err, db) {
            if (err) throw err;
            var dbo = db.db('classroomClicker');
            query = {courseId: data.courseId}
            dbo.collection("Quizzes").find(query).toArray(function (err, res) {
                if (err) throw err;
                socket.emit('gameNamesData', res);
                db.close();
            });
        });
    });

    socket.on('requestDbHW', function (data) {

        MongoClient.connect(url, function (err, db) {
            if (err) throw err;
            var dbo = db.db('classroomClicker');
            query = {courseId: data.courseId}
            dbo.collection("Homeworks").find(query).toArray(function (err, res) {
                if (err) throw err;
                socket.emit('HWData', res);
                db.close();
            });
        });
    });


    socket.on('newQuiz', function (data) {
        MongoClient.connect(url, function (err, db) {
            if (err) throw err;
            var dbo = db.db('classroomClicker');
            dbo.collection('Quizzes').find({}).toArray(function (err, result) {
                if (err) throw err;
                var num = Object.keys(result).length;
                if (num == 0) {
                    data.id = 1
                    num = 1
                } else {
                    data.id = result[num - 1].id + 1;
                }
                var game = data;
                dbo.collection("Quizzes").insertOne(game, function (err, res) {
                    if (err) throw err;
                    db.close();
                });
                db.close();
                socket.emit('backToHostPage');
            });

        });

    });

    socket.on('deleteQuiz', (data) => {
        MongoClient.connect(url, function (err, db) {
            if (err) throw err;
            var dbo = db.db("classroomClicker");
            var query = { id: parseInt(data.id) };
            dbo.collection('Quizzes').deleteOne(query, function (err, res) {
                if (err) throw err;
                socket.emit("backToHostPage");
                db.close();
            });
        });
    });

    socket.on('req-quiz-data', (data) => {
        //Check to see if id passed in url corresponds to id of quiz game in database
        MongoClient.connect(url, function (err, db) {
            if (err) throw err;
            var dbo = db.db("classroomClicker");
            var query = { id: parseInt(data.id) };
            dbo.collection('Quizzes').find(query).toArray(function (err, result) {
                if (err) throw err;
                //A quiz was found with the id passed in url
                if (result[0] !== undefined) {
                    socket.emit('gameData-edit', result[0]);
                } else {
                    socket.emit('noGameFound');
                }
                db.close();
            });
        });

    });

    socket.on('req-hw-data', (data) => {
        //Check to see if id passed in url corresponds to id of quiz game in database
        MongoClient.connect(url, function (err, db) {
            if (err) throw err;
            var dbo = db.db("classroomClicker");
            var query = { id: parseInt(data.id) };
            dbo.collection('Homeworks').find(query).toArray(function (err, result) {
                if (err) throw err;
                //A quiz was found with the id passed in url
                if (result[0] !== undefined) {
                    socket.emit('gameData-edit', result[0]);
                } else {
                    socket.emit('noGameFound');
                }
                db.close();
            });
        });

    });

    socket.on('editQuiz', function (data) {
        MongoClient.connect(url, function (err, db) {
            if (err) throw err;
            var dbo = db.db('classroomClicker');
            var query = { id: parseInt(data.id) };
            dbo.collection("Quizzes").updateOne(query, { $set: data }, function (err, result) {
                if (err) throw err;
                socket.emit('backToHostPage');
                db.close();
            });
        });
    });

    socket.on('newHw', function (data) {
        MongoClient.connect(url, function (err, db) {
            if (err) throw err;
            var dbo = db.db('classroomClicker');
            dbo.collection('Homeworks').find({}).toArray(function (err, result) {
                if (err) throw err;
                var num = Object.keys(result).length;
                if (num == 0) {
                    data.id = 1
                    num = 1
                } else {
                    data.id = result[num - 1].id + 1;
                }
                var game = data;
                dbo.collection("Homeworks").insertOne(game, function (err, res) {
                    if (err) throw err;
                    db.close();
                });
                db.close();
                socket.emit('CreateHW', num);
            });

        });
    });
    socket.on('editHw', function (data) {
        MongoClient.connect(url, function (err, db) {
            if (err) throw err;
            var dbo = db.db('classroomClicker');
            var query = { id: parseInt(data.id) };
            dbo.collection("Homeworks").updateOne(query, { $set: data }, function (err, result) {
                if (err) throw err;
                socket.emit('backToHostPage');
                db.close();
            });
        });
    });

    socket.on('ShowHW', (data) => {
        // MongoClient.connect(url, function (err, db) {
        //     if (err) throw err;

        //     var dbo = db.db('classroomClicker');
        //     dbo.collection("Homeworks").find().toArray(function (err, res) {
        //         if (err) throw err;
        //         // socket.emit('HWData', res);
        //         db.close();
        //     });
        // });
        socket.emit('DoHW', (data));
    })
});
