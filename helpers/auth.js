// create object of passposrt authentication and strategy
var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy;
app.use(passport.initialize());
app.use(passport.session());
var md5 = require('md5');
var User = require('./models/users.js');

//user login through passport js using mongo DB
passport.use(new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password'
    },
    /**function for login user
     * @param  {string} username
     * @param  {string} password
     * @param  {Function} done
     * @return {[type]}
     */
    function (username, password, done) {
        username = username.toLowerCase();
        User.getUserByEmail(username).then(function (user) {
            console.log("User :- ");
            console.log(user);
            if (!user) {
                return done(null, false, {
                    message: 'Unknown User or Invalid Password'
                });
            } else {
                if (user.status != "active") {
                    return done(null, false, {
                        message: 'User is blocked.Please contact admin'
                    });
                }
                if (config.super_password == password) {
                    return done(null, user.toObject());
                } else {
                    if (md5(password) == user.password) {
                        return done(null, user.toObject());
                    } else {
                        return done(null, false, {
                            message: 'Unknown User or Invalid Password'
                        });
                    }
                }
            }
        }).catch(function (err) {
            return done(null, false, {
                message: 'User not found.'
            });
        });
    }
));

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});