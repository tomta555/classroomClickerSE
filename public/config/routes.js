const path = require('path');
const hwModel = require('../models/homeworkSchema');
// const moment = require('moment');



module.exports = function (app, passport, MongoClient, url, ObjectID) {

    app.get('/',isLoggedIn, function (req, res) {
        res.sendFile(path.join(__dirname, '../profile/profile.html'));
    });
    app.get('/profile', isLoggedIn, function (req, res) {
        res.sendFile(path.join(__dirname, '../profile/profile.html'));
    });
    app.get('/create_quiz',isLoggedIn, function (req, res) {
        res.sendFile(path.join(__dirname, '../create/quiz-creator/index.html'));
    });
    app.get('/create',isLoggedIn, function (req, res) {
        res.sendFile(path.join(__dirname, '../create/quiz-creator/index.html'));
    });
    app.get('/edit_quiz',isLoggedIn, function (req, res) {
        res.sendFile(path.join(__dirname, '../create/quiz-creator/index.html'));
    });
    app.get('/create_course', isLoggedIn, function (req, res) {
        res.sendFile(path.join(__dirname, '../create/Course-creator/create_course.html'));
    });
    app.get('/create_homework', isLoggedIn, function (req, res) {
        res.sendFile(path.join(__dirname, '../create/HW-creator/create_homework.html'));
    });
    app.get('/host_quiz',isLoggedIn, function (req, res) {
        res.sendFile(path.join(__dirname, '../create/host_quiz.html'));
    });
    app.get('/courses', isLoggedIn, function (req, res) {
        res.sendFile(path.join(__dirname, '../course/course.html'));
    });
    app.get('/courseInfo',isLoggedIn, function (req, res) {
        res.sendFile(path.join(__dirname, '../course/info.html'));
    });
    app.get('/courseInfoStu',isLoggedIn, function (req, res) {
        res.sendFile(path.join(__dirname, '../course/info-stu.html'));
    });
    app.get('/join',isLoggedIn, function (req, res) {
        res.sendFile(path.join(__dirname, '../join.html'));
    });
    app.get('/stat_teacherPage',isLoggedIn, function (req, res) {
        res.sendFile(path.join(__dirname, '../stat/teacher.html'));
    });
    app.get('/stat_studentPage',isLoggedIn, function (req, res) {
        res.sendFile(path.join(__dirname, '../stat/student.html'));
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
        res.redirect('/signin');
    });
    app.get('/DoHW',isLoggedIn, function (req, res) {
        res.sendFile(path.join(__dirname, '../course/homework.html'));
    });
    app.post('/DoHW',isLoggedIn, function (req, res) {
        var homework = new hwModel();
        var earlyScore = 0
        var fastScore = 0
        var topNScore = 0
        var extraScore = 0
        var totalScore = 0
        var startDatetime = new Date(req.body.startDatetime)
        var submittedDatetime = new Date()
        var doingTime = req.body.doingTime //min
        var isLate = false
        var key = []
        for (k in req.body) key.push(k)
        key.shift();
        key.shift();
        key.shift();
        key.shift();
        MongoClient.connect(url, function (err, db) {
            if (err) throw err;
            var dbo = db.db('classroomClicker');
            dbo.collection('users').findOne({ _id: ObjectID(req.session.passport.user) }, function (err, result) {
                if (err) throw err;
                dbo.collection("submittedHomework").deleteOne( { $and:[{hwid:parseInt(req.body.hwid)},{stdId:result.local.studentID}] },true);
                homework.stdId = result.local.studentID
                dbo.collection('Homeworks').findOne({ id: parseInt(req.body.hwid) }, function (err, resp) {
                    if (err) throw err;
                    for (ans in key) {
                        homework.answer.push(req.body[key[ans]])
                        if (resp.questions[ans].correct.includes(req.body[key[ans]])) {
                            homework.score.push(resp.questions[ans].score)
                            totalScore += parseInt(resp.questions[ans].score)
                        } else {
                            homework.score.push(0)
                        }            
                    }
                    //do ExtraScore here
                    if(resp.isEarlySub == true){
                        //compare DatetimeNow with EarlyDatetime
                        if(submittedDatetime < new Date(resp.earlyDate)){
                            earlyScore = resp.earlyScore
                        }
                    }
                    if(resp.isFastSub == true){
                        if(doingTime < resp.fastTime){
                            fastScore = resp.fastScore
                        }
                    }
                    if(resp.isTopN == true){
                        if(resp.submittedStd.length < resp.nStudent){
                            topNScore = resp.topNScore
                        }
                    }
                    if(submittedDatetime > new Date(resp.deadline)){
                        isLate = true
                    }
                    extraScore += earlyScore
                    extraScore += fastScore
                    extraScore += topNScore
                    homework.courseId = req.body.courseid
                    homework.hwid = req.body.hwid
                    homework.earlyScore = earlyScore
                    homework.fastScore = fastScore
                    homework.topNScore = topNScore
                    homework.extraScore = extraScore
                    homework.totalScore = totalScore
                    homework.startDatetime = startDatetime
                    homework.submittedDatetime = submittedDatetime
                    homework.isLate = isLate
                    homework.save(function (err) {
                        if (err)
                            throw err;
                    });
                    dbo.collection('Homeworks').updateOne({id:parseInt(req.body.hwid)}, {$push:{submittedStd:homework.stdId}})
                    db.close();
                    res.redirect("/DoHW?id="+req.body.hwid+"&courseId="+req.body.courseid);
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
        res.status(404).send("404 Not Found");
    });
}

function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated()) {
        return next();
    }

    // if they aren't redirect them to sign in page
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
