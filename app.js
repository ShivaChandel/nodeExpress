const express = require('express');
const port = process.env.PORT || 3000;
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');
const Article = require('./models/article');
const app = express();
const config = require('./config/database');
const passport = require('passport');
const session = require('express-session');
app.use(require('cookie-parser')());


//mongodb
mongoose.connect(config.database, { useNewUrlParser: true }, (err) => {
    if (!err) {
        console.log('Mongodb successfully connected');
    } else {
        console.log('Error in connecting mongodb');
    }
})

//set view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
//static folder
app.use(express.static(path.join(__dirname, 'public')));

//middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({
    secret: 'keyword cat',
    resave: true,
    saveUninitialized: true
}));
//passport config
require('./config/passport')(passport);
app.use(passport.initialize());
app.use(passport.session());



//creating global user variable
app.get('*', (req, res, next) => {
    res.locals.user = req.user || null;
    next();
});



//routes
app.get('/', (req, res) => {
    Article.find({}, (err, all_articles) => {
        if (err) {
            console.log('Error');
        } else {
            res.render('index', {
                title: 'Articles',
                articles: all_articles,
            });
        }
    });
});

//router files
let articles = require('./routes/articles');
app.use('/articles', articles);

let users = require('./routes/users');
app.use('/users', users);



//listen to express
app.listen(port, (err) => {
    if (err) {
        console.log("Express not running");
    } else {
        console.log("Server started on port " + port);
    }
});