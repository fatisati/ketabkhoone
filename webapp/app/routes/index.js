var express = require('express');
const book = require("../models/book.js");
const user = require("../models/user.js");
const authorModel = require("../models/author.js");
var router = express.Router();
var fs = require('fs');

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', { fail: false });
});

router.get('/registerbook', function (req, res) {
    res.render('register_book');

});

/* GET Hello World page. */
router.get('/helloworld', function (req, res) {
    res.render('helloworld', { title: 'Hello, World!' });
});

/* GET Userlist page. */
router.get('/userlist', function (req, res) {
    user.find({}, {}, function (e, docs) {
        res.render('userlist', {
            "userlist": docs
        });
    });
});

// main login page //
router.get('/login', function (req, res) {
    // check if the user's credentials are saved in a cookie //
    res.render('login', { title: 'Hello - Please Login To Your Account' });
});

router.get('/home', function (req, res) {
    // check if the user's credentials are saved in a cookie //
    res.render('home');
});


router.get('/signup', function (req, res) {
    // check if the user's credentials are saved in a cookie //
    res.render('signup', { title: 'Hello - Please Login To Your Account' });
});

router.post('/adduser', function (req, res) {

    let u = new user({ username: req.body.email, name: req.body.name, fname: req.body.fname, pass: req.body.pass, 'islogine': true })
    u.save(function (err, todos) {
        if (err) {
            // If it failed, return error
            res.send("There was a problem adding the information to the database.");
        }
        else {
            console.log("user registered");
            // And forward to success page
            res.redirect('/home');
            // res.render('home');
        }
    });
});

router.post('/auth', function (req, res) {

    user.findOne({ 'username': req.body.email }, (err, u) => {
        if (u) {
            u.pass == req.body.pass ? res.redirect('/home') : res.render("login", { fail: true });
        } else {
            res.render("login", { fail: true });
            //res.status(400).send(e);    
        }
    })

});


router.post('/addbook', function (req, res) {
    console.log('we are in add book.');
    var bookName = req.body.name;
    var author = req.body.author;
    // var publisher = req.body.publisher;
    // var year = req.body.year;
    var genre = req.body.genre;
    // var numPage = req.body.numPage;
    var info = req.body.info;
    var image_path = req.files[0].path;
    // console.log(req.files)
    let b = new book({ bookname: bookName, genre: genre, summary: info });
    try {
        var image = fs.readFileSync(image_path);
        console.log('fs read the image');

    }
    catch (e) {
        console.log(e);
    }
    b.img.data = image;
    b.img.contentType = req.files[0].mimetype;
    authorModel.findOne({ name: author }, function (err, doc) {
        if (doc) {
            b.author = doc;
            console.log('author '+author+' found in db.');
        }
        else {
            let a = new authorModel({ name: author });
            a.save();
            console.log('author '+author+' saved in db.');
            b.author = a;
            
        }
        console.log('i an saving book with author: '+ b.author.name);
        b.save(function (err) {
            if (err) {
                res.send(err);
            }
            else {
                res.redirect('/home');
            }

        });
    });
});

router.post('/searchbook', function (req, res) {

    bn = req.body.name;
    console.log(bn)
    book.find({$or: [{ 'bookname': { "$regex": bn, $options: 'i' } }]})
    .populate('author')
    .exec((err, b) => {
        if (err) {
            console.log(err)
        } else {

            res.render('show_books', {books : b, login : false});
            // console.log('name:'+b[0].name)
            // res.send(b[0].name);
        }

        authorModel.find({ 'first_name': { "$regex": bn, $options: 'i' } }, (err, a) => {
            if (err) {
                console.log(err)
            } else {
                // res.render("searchbyname");
                var count = a.length
                for (i = 0; i < count; i++) {
                    console.log(" 2 author is " + a[i]);
                }
            }
        })
    });

});

router.get('/book/:id/image', function(req, res){
    console.log('id is: '+req.params.id);
    book.findById(req.params.id, function(err, b){
        if(err) console.log(err);
        else{
            if(b.img){
                res.contentType(b.img.contentType);
                res.send(b.img.data);
            }
            else{
                // res.contentType('image/jpg');
                res.send('no image');
            }
        }
        
    });
});

router.get('/profile', function(req, res){
    res.render('profile');
});

router.get('/allbooks', function(req, res){
    book.find({'img':{$ne:null}})
    .populate('author')
    .exec((err, b) => {
        if (err) {
            console.log(err)
        } else {
            res.render('show_books', {books : b, login : false});
        }
    });
});

router.get('/delete', function(req, res){
    book.find({}).remove().exec();
    res.send('all deleted');
})
module.exports = router;
