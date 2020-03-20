const path = require('path');

module.exports = function(app, passport) {

    app.get('/', function(req, res) {
        res.sendFile(path.join(__dirname,'../index.html'));
    });
    app.get('/profile',isLoggedIn, function(req, res) {
        res.sendFile(path.join(__dirname,'../profile/teacher.html'));
    });
    //----------Quiz----------
    app.get('/create_quiz', function(req, res) {
        res.sendFile(path.join(__dirname,'../create/quiz-creator/index.html'));
    });
    app.get('/create', function(req, res){
        res.sendFile(path.join(__dirname,'../create/quiz-creator/index.html'));
    });
    app.get('/edit_quiz',function(req, res){
        res.sendFile(path.join(__dirname,'../create/quiz-creator/index.html'));
    });
    app.get('/create_course',isLoggedIn, function(req, res) {
        res.sendFile(path.join(__dirname,'../create/Course-creator/create_course.html'));
    });
    app.get('/create_homework',isLoggedIn, function(req, res) {
        res.sendFile(path.join(__dirname,'../create/HW-creator/create_homework.html'));
    });
    app.get('/host_quiz', function(req, res) {
        res.sendFile(path.join(__dirname,'../create/host_quiz.html'));
    });
    app.get('/courses', function(req, res) {
        res.sendFile(path.join(__dirname,'../course/course.html'));
    });
    app.get('/courseInfo', function(req, res) {
        res.sendFile(path.join(__dirname,'../course/info.html'));
    });
    app.get('/join', function(req, res) {
        res.sendFile(path.join(__dirname,'../join.html'));
    });
    app.get('/stat_teacherPage', function(req, res) {
        res.sendFile(path.join(__dirname,'../stat/teacher.html'));
    });
    app.get('/signup', function(req, res) {
        res.render('signup.ejs', { message: req.flash('signupMessage') });
    });
    app.get('/signin',isLoggedIn_loginPage, function(req, res) {
        res.render('login.ejs', { message: req.flash('loginMessage') }); 
    });
    app.get('/register', function(req, res) {
        res.render('signup.ejs', { message: req.flash('signupMessage') });
    });
    app.get('/login',isLoggedIn_loginPage, function(req, res) {
        res.render('login.ejs', { message: req.flash('loginMessage') }); 
    });
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });
    app.get('/DoHW', function(req, res) {
        res.sendFile(path.join(__dirname,'../course/homework.html'));
    });    
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/signup', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    app.post('/signin', passport.authenticate('local-login', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/signin', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));
    app.get('*', function(req, res) {
        res.status(404).send("WTF 404 Not Found");
    });
}

function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated()){
        return next();
    }

    // if they aren't redirect them to the home page
    res.redirect('/signin');
}

function isLoggedIn_loginPage(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated()){
        res.redirect('/');
    }else
        return next();
    
    // if they aren't redirect them to the home page
    
}
