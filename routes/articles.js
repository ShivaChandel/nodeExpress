const express = require('express');
const router = express.Router();
const Article = require('../models/article');
const User = require('../models/user');

//add article
router.get('/add', ensureAuthentication, (req, res) => {
    res.render('add_article', {
        title: 'Add Article',
    });
});

router.post('/add', (req, res) => {
    let new_article = Article();
    new_article.title = req.body.title;
    new_article.author = req.user._id;
    new_article.body = req.body.body;

    new_article.save((err) => {
        if (err) {
            console.log("Error submitting article");
        } else {
            res.redirect('/');
        }
    })
});

//single article
router.get('/:id', (req, res) => {
    let query = req.params.id;
    Article.findById(query, (err, article) => {
        User.findById(article.author, (err, user) => {
            if (err) {
                res.redirect('/');
            } else {
                res.render('single_article', {
                    articles: article,
                    author: user.name,
                })
            }
        })

    });
});

//edit article
router.get('/edit/:id', ensureAuthentication, (req, res) => {
    let query = req.params.id;
    Article.findById(query, (err, article) => {
        if (article.author != req.user._id) {
            res.redirect('/');
        }
        if (err) {
            res.redirect('/');
        } else {
            res.render('edit_article', {
                title: 'Edit Article',
                articles: article,
            });
        }
    });
});
//add edit article
router.post('/edit/:id', (req, res) => {
    var query = { _id: req.params.id };
    let new_article = {};
    new_article.title = req.body.title;
    new_article.author = req.body.author;
    new_article.body = req.body.body;

    Article.update(query, new_article, function(err) {
        if (err) {
            console.log("Error submitting article");
        } else {
            res.redirect('/');
        }
    })
});
//delete article
router.get('/delete/:id', (req, res) => {
    let query = { _id: req.params.id };
    Article.deleteOne(query, (err) => {
        if (err) {
            res.redirect('/');
        } else {
            res.redirect('/');
        }
    });
});
//acces control

function ensureAuthentication(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.redirect('/users/login');
    }
}

module.exports = router;