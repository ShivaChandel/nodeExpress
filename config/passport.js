const LocalStrategy = require('passport-local').Strategy;
const config = require('../config/database');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const passport = require('passport');

module.exports = function(passport) {
    passport.use(new LocalStrategy(
        function(username, password, done) {
            let query = { username: username };
            User.findOne(query, function(err, user) {
                if (err) { return done(err); }
                if (!user) { return done(null, false); }
                //match password
                bcrypt.compare(password, user.password, (err, isMatch) => {
                    if (err) {
                        throw err;
                    }
                    if (isMatch) {
                        return done(null, user);
                    } else {
                        return done(null, false);
                    }
                })
            });
        }
    ));

    //serilizer and deserializer
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });
}