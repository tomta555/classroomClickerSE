var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');

module.exports = function (passport) {
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });

    passport.use('local-signup', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with username
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback: true // allows us to pass back the entire request to the callback
    },
        function (req, username, password, done) {

            // asynchronous
            // User.findOne wont fire unless data is sent back
            process.nextTick(function () {

                // find a user whose username is the same as the forms username
                // we are checking to see if the user trying to login already exists
                User.findOne({ 'local.username': username }, function (err, user) {
                    // if there are any errors, return the error
                    if (err)
                        return done(err);
                    console.log(req.body)
                    // check to see if theres already a user with that username
                    if (user) {
                        return done(null, false, req.flash('signupMessage', 'This username is already taken.'));
                    } else {
                        if(password != req.body.confirmPassword)
                            return done(null, false, req.flash('signupMessage', 'Confirm password mismatch.'));
                        // if (password != confirmPassword)
                        //     return done(null, false, req.flash('signupMessage', 'confirm password mismatch.'));
                        // if there is no user with that username
                        // create the user
                        var newUser = new User();

                        // set the user's local credentials
                        // set data to database here
                        newUser.local.username = username;
                        newUser.local.password = newUser.generateHash(password);
                        newUser.local.fname = req.body.fname
                        newUser.local.lname = req.body.lname
                        
                        if(req.body.isTeacher == 'on'){
                            newUser.local.isTeacher = true
                        }else{
                            newUser.local.isTeacher = false
                            newUser.local.studentID = req.body.studentID
                        }
                        // save the user
                        newUser.save(function (err) {
                            if (err)
                                throw err;
                            return done(null, newUser);
                        });
                    }
                });
            });
        }));
    passport.use('local-login', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with username
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback: true // allows us to pass back the entire request to the callback
    },
        function (req, username, password, done) { // callback with username and password from our form

            // find a user whose username is the same as the forms username
            // we are checking to see if the user trying to login already exists
            User.findOne({ 'local.username': username }, function (err, user) {
                // if there are any errors, return the error before anything else
                if (err)
                    return done(err);
                // if no user is found, return the message
                if (!user)
                    return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash

                // if the user is found but the password is wrong
                if (!user.validPassword(password))
                    return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata
                    
                // all is well, return successful user
                // console.log(user)
                return done(null, user);
            });

        }));

};
