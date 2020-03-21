const path = require('path');
const hwModel = require('../models/homeworkSchema')




module.exports = function (app, passport, MongoClient, url, ObjectID) {

    app.get('/', function (req, res) {
        res.sendFile(path.join(__dirname, '../index.html'));
    });
    app.get('/profile', isLoggedIn, function (req, res) {
        res.sendFile(path.join(__dirname, '../profile/teacher.html'));
    });
    // app.get('/profile',isLoggedIn, function(req, res) {
    //     res.render('profile.ejs',{username : req.user.local.username});
    // });
    //----------Quiz----------
    app.get('/create_quiz', function (req, res) {
        res.sendFile(path.join(__dirname, '../create/quiz-creator/index.html'));
    });
    app.get('/create', function (req, res) {
        res.sendFile(path.join(__dirname, '../create/quiz-creator/index.html'));
    });
    app.get('/edit_quiz', function (req, res) {
        res.sendFile(path.join(__dirname, '../create/quiz-creator/index.html'));
    });
    app.get('/create_course', isLoggedIn, function (req, res) {
        res.sendFile(path.join(__dirname, '../create/Course-creator/create_course.html'));
    });
    app.get('/create_homework', isLoggedIn, function (req, res) {
        res.sendFile(path.join(__dirname, '../create/HW-creator/create_homework.html'));
    });
    app.get('/host_quiz', function (req, res) {
        res.sendFile(path.join(__dirname, '../create/host_quiz.html'));
    });
    app.get('/courses', function (req, res) {
        res.sendFile(path.join(__dirname, '../course/course.html'));
    });
    app.get('/courseInfo', function (req, res) {
        res.sendFile(path.join(__dirname, '../course/info.html'));
    });
    app.get('/courseInfoStu', function (req, res) {
        res.sendFile(path.join(__dirname, '../course/info-stu.html'));
    });
    app.get('/join', function (req, res) {
        res.sendFile(path.join(__dirname, '../join.html'));
    });
    app.get('/stat_teacherPage', function (req, res) {
        res.sendFile(path.join(__dirname, '../stat/teacher.html'));
    });
    app.get('/signup', function (req, res) {
        res.render('signup.ejs', { message: req.flash('signupMessage') });
    });
    app.get('/signin', isLoggedIn_loginPage, function (req, res) {
        res.render('login.ejs', { message: req.flash('loginMessage') });
    });
    app.get('/register', function (req, res) {
        res.render('signup.ejs', { message: req.flash('signupMessage') });
    });
    app.get('/login', isLoggedIn_loginPage, function (req, res) {
        res.render('login.ejs', { message: req.flash('loginMessage') });
    });
    app.get('/logout', function (req, res) {
        req.logout();
        res.redirect('/');
    });
    app.get('/DoHW', function (req, res) {
        res.sendFile(path.join(__dirname, '../course/homework.html'));
    });
    app.post('/DoHW', function (req, res) {
        var homework = new hwModel();
        var totalScore = 0
        var key = []
        for (k in req.body) key.push(k)
        key.shift()

        MongoClient.connect(url, function (err, db) {
            if (err) throw err;
            var dbo = db.db('classroomClicker');
            dbo.collection('users').findOne({ _id: ObjectID(req.session.passport.user) }, function (err, result) {
                if (err) throw err;
                homework.stdId = result.local.studentID
                dbo.collection('Homeworks').findOne({ id: parseInt(req.body.hwid) }, function (err, resp) {
                    if (err) throw err;
                    for (ans in key) {
                        homework.answer.push(req.body[key[ans]])
                        if (resp.questions[ans].correct == req.body[key[ans]]) {
                            homework.score.push(resp.questions[ans].score)
                            totalScore += parseInt(resp.questions[ans].score)
                        } else {
                            homework.score.push(0)
                        }
                        
                    }
                    homework.hwid = req.body.hwid
                    homework.totalScore = totalScore
                    homework.save(function (err) {
                        if (err)
                            throw err;
                    });
                    db.close();

                    res.redirect
                })
            })
        })
    })
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/profile', // redirect to the secure profile section
        failureRedirect: '/signup', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));

    app.post('/signin', passport.authenticate('local-login', {
        successRedirect: '/profile', // redirect to the secure profile section
        failureRedirect: '/signin', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));
    app.get('*', function (req, res) {
        res.status(404).send("WTF 404 Not Found");
    });
}

function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated()) {
        return next();
    }

    // if they aren't redirect them to the home page
    res.redirect('/signin');
}

function isLoggedIn_loginPage(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated()) {
        res.redirect('/');
    } else
        return next();

    // if they aren't redirect them to the home page

}
