const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const passport = require('passport');
//register form

router.get('/register', (req, res) => {
    res.render('register', {
        title: 'Register User',
    });
});

router.post('/register', (req, res) => {
    let new_user = User();
    new_user.name = req.body.name;
    new_user.email = req.body.email;
    new_user.username = req.body.username;
    new_user.password = req.body.password;

    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(new_user.password, salt, (err, hash) => {
            if (err) throw err;
            else {
                new_user.password = hash;
                new_user.save(function(err) {
                    if (err) {
                        throw err;
                    } else {
                        res.redirect('/users/login');
                    }
                });
            }
        });
    });

});

router.get('/login', (req, res) => {
        res.render('login', {
            title: "Login ",
        })
    })
    //login process
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/users/login',
    })(req, res, next);
});

//logout
router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/users/login');
})

module.exports = router;