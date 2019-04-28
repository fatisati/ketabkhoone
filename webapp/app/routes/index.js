var express = require('express');
const book = require("../models/book.js");
const bookInstance = require("../models/book_instance.js");
const user = require("../models/user.js");
const author = require("../models/author.js");
var router = express.Router();
var fs = require('fs');


// Require our controllers.
var book_controller = require('../controllers/bookController');
// var author_controller = require('../controllers/authorController');
// var genre_controller = require('../controllers/genreController');
// var book_instance_controller = require('../controllers/bookinstanceController');
var user_controller = require('../controllers/userController');


/* GET home page. */
router.get('/', function (req, res, next) {
    // console.log("Cookies index  ", req.cookies.islogin);
    if (req.cookies.islogin === 'true') {
        res.redirect('/home');
    } else {
        res.render('index');
    }
});

router.get('/home', function (req, res) {
    // check if the user's credentials are saved in a cookie //
    // console.log("cookie home "+req.cookies.islogin)
    if (req.cookies.islogin === 'true') {
        res.render('home');
    } else {
        res.render('login');
    }
});

router.get('/signup', function (req, res) {
    // check if the user's credentials are saved in a cookie //
    res.render('signup', { title: 'Hello - Please Login To Your Account' });
});

// main login page //
router.get('/login', function (req, res) {
    // check if the user's credentials are saved in a cookie //
    res.render('login', { title: 'Hello - Please Login To Your Account' });
});

router.get('/logout', function (req, res) {
    res.cookie('islogin', false);
    // console.log("Cookies logout ", req.cookies.islogin);
    res.redirect('/');

});

router.get('/registerbook', function (req, res) {
    res.render('register_book');
});

/* GET Userlist page. */
router.get('/userlist', user_controller.user_list);

router.post('/adduser', user_controller.add_user);

router.post('/auth', user_controller.authenticate);

router.post('/addbook', book_controller.add_book);

router.post('/searchbook', book_controller.search_book);

router.get('/book/:id/image', book_controller.book_image);

router.get('/profile', function (req, res) {
    res.render('profile', { user: req.session.user });
});

router.get('/allbooks', book_controller.all_books);

// router.get('/delete', function(req, res){
//     book.find({}).remove().exec();
//     res.send('all deleted');
// });

router.get('/bookdetail/:id', function (req, res) {
    req.session.id = req.params.id
    res.redirect('/bookdetail')
})

router.get('/bookdetail', book_controller.book_detail)

router.get('/borrow_form', function (req, res) {
    res.render('borrow_form', { title: 'Hello - Please Login To Your Account' });
})

router.get('/test', function (req, res) {

    // console.log("hello");
    book.findOne({})
        .populate('author')
        .exec(function (err, b) {
            if (err) console.log(err);
            else {
                console.log(b.author.name)
                res.render('book_detail', { book: b, users: [{ name: 'fatemeh' }, { name: 'maryam' }] })
            }

        })
})
module.exports = router;
