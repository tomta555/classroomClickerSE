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
    app.get('/edit_quiz',function(req, res){
        res.sendFile(path.join(__dirname,'../create/quiz-creator/index.html'));
    });
    app.get('/create_course',isLoggedIn, function(req, res) {
        res.sendFile(path.join(__dirname,'../create/Course-creator/index.html'));
    });
    app.get('/create_homework',isLoggedIn, function(req, res) {
        res.sendFile(path.join(__dirname,'../create/HW-creator/index.html'));
    });
    app.get('/host_quiz', function(req, res) {
        res.sendFile(path.join(__dirname,'../create/index.html'));
    });
    app.get('/course',isLoggedIn, function(req, res) {
        res.sendFile(path.join(__dirname,'../course/index.html'));
    });
    app.get('/join', function(req, res) {
        res.sendFile(path.join(__dirname,'../join.html'));
    });
    app.get('/signup', function(req, res) {
        res.sendFile(path.join(__dirname,'../register/index.html'));
    });
    app.get('/signin',isLoggedIn_loginPage, function(req, res) {
        res.sendFile(path.join(__dirname,'../login/index.html'));
    });
    app.get('/register', function(req, res) {
        res.sendFile(path.join(__dirname,'../register/index.html'));
    });
    app.get('/login',isLoggedIn_loginPage, function(req, res) {
        res.sendFile(path.join(__dirname,'../login/index.html'));
    });
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
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
