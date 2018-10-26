var express = require('express');
const book = require("../models/book.js");
const user = require("../models/user.js");
const author = require("../models/author.js");
var router = express.Router();
var fs = require('fs');


/* GET home page. */
router.get('/', function (req, res, next) {
    // session = COOKIE['islogin'];    
    // res.cookie(islogin , false, {expire : new Date() + 9999});
    console.log("Cookies index  ", req.cookies.islogin);
    if(req.cookies.islogin === 'true'){
        // console.log("go home");
        // console.log("cookie index2 "+req.cookies.islogin);
        res.redirect('/home');
    }else{
        // console.log("okkkk logout");
        res.render('index');  
    }
    // res.render('index', { fail: false });
});

router.get('/logout', function (req, res) {

    // req.session.destroy(function(err){
    //     if(err){
    //         console.log(err);
    //     } else {
    //         res.redirect('/');
    //     }
    // });
    res.cookie('islogin' , false);
    console.log("Cookies logout ", req.cookies.islogin);
    res.redirect('/');

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
    // if(req.session.user != undefined){
    //     // console.log("go home");
    //     // console.log(req.session.user)
    //     res.render('home');
    // }else{
    //     res.render('login');  
    // }
    console.log("cookie home "+req.cookies.islogin)
    if(req.cookies.islogin==='true'){
        // console.log("go home");
        console.log("cookie yessss");
        res.render('home');
    }else{
        res.render('login');  
    }
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
            if(u.pass == req.body.pass){
                req.session.email = req.body.email;
                req.session.name = req.body.name;
                req.session.fname = req.body.fname;
                req.session.islogin = req.body.islogin;
                req.session.user = u;
                res.cookie('islogin' , true, {expire : new Date() + 9999});
                console.log("cookie auth "+req.cookies.islogin);
                res.redirect('/home') ;
                }else{
                res.render("login", { fail: true })
            }
            // u.pass == req.body.pass ? res.redirect('/home') : res.render("login", { fail: true });
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
    // sess = req.session;
    // console.log(req.files)
    let b = new book({ bookname: bookName, genre: genre, summary: info, user : req.session.user });
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
            console.log('author ' + author + ' found in db.');
        }
        else {
            let a = new authorModel({ name: author });
            a.save();
            console.log('author ' + author + ' saved in db.');
            b.author = a;

        }
        console.log('i an saving book with author: ' + b.author.name);
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
    book.find({ $or: [{ 'bookname': { "$regex": bn, $options: 'i' } }] })
        .populate('author')
        .exec((err, b1) => {
            var count1 = b1.length
            // ----------------------------------
            author.find({ 'name': { "$regex": bn, $options: 'i' } }, (err, b2) => {
                if (err) {
                    console.log(err);
                } else {
                    // res.render("searchbyname");
                    var count2 = b2.length
                    for (i = 0; i < count2; i++) {
                        b1[count1 + i] = b2[i];
                    }
                }
            })
            // ----------------------------------
            if (err) {
                console.log(err)
            } else {   
                //for show
                //BASED ON SCORE OF BOOK
                book_score = [];
                b1.sort(  (a,b) => (a.score > b.score) ? 1 : ((b.score > a.score) ? -1 :0)  );
                var count = b1.length
                for (i = 0; i < count; i++) {
                    book_score[i] = b1[i];
                }
                //BASED ON ISBN OF BOOK
                 book_isbn = [];
                 b1.sort(  (a,b) => {
                     if (a.isbn < b.isbn) return 1;
                     if (a.isbn > b.isbn) return -1;
                     return 0;
                 });                
                 for (i = 0; i < count; i++) {
                     book_isbn[i] = b1[i];
                 }
                 //BASED ON borrowNum OF BOOK
                 book_borrowNum = [];
                 b1.sort(  (a,b) => {
                     if (aborrowNum < bborrowNum) return 1;
                     if (a.borrowNum > b.borrowNum) return -1;
                     return 0;
                 });                
                 for (i = 0; i < count; i++) {
                     book_borrowNum[i] = b1[i];
                 }             
                res.render('show_books', { books: b1, login: false });
            }

            
        });

});

router.get('/book/:id/image', function (req, res) {
    // console.log('id is: ' + req.params.id);
    book.findById(req.params.id, function (err, b) {
        if (err) console.log(err);
        else {
            if (b.img) {
                res.contentType(b.img.contentType);
                res.send(b.img.data);
            }
            else {
                // res.contentType('image/jpg');
                res.send('no image');
            }
        }

    });
});

router.get('/profile', function (req, res) {
    // sess = req.session;
    // console.log("proffffffffffffffffffffffffff  "+req.session.user.username);
    res.render('profile',{user : req.session.user});
});

router.get('/allbooks', function (req, res) {
    book.find({ 'img': { $ne: null } })
        .populate('author')
        .exec((err, b) => {
            if (err) {
                console.log(err)
            } else {
                //BASED ON SCORE OF BOOK
                book_score = [];
                b.sort(  (a,b) => (a.score > b.score) ? 1 : ((b.score > a.score) ? -1 :0)  );
                var count = b.length
                for (i = 0; i < count; i++) {
                    book_score[i] = b[i];
                }
                //BASED ON ISBN OF BOOK
                book_isbn = [];
                b.sort(  (a,b) => {
                    if (a.isbn < b.isbn) return 1;
                    if (a.isbn > b.isbn) return -1;
                    return 0;
                });                
                for (i = 0; i < count; i++) {
                    book_isbn[i] = b[i];
                }
                //BASED ON borrowNum OF BOOK
                book_borrowNum = [];
                b.sort(  (a,b) => {
                    if (a.borrowNum < b.borrowNum) return 1;
                    if (a.borrowNum > b.borrowNum) return -1;
                    return 0;
                });                
                for (i = 0; i < count; i++) {
                    book_borrowNum[i] = b[i];
                }
                res.render('show_books', { books: b,book_score: book_score,book_isbn: book_isbn,book_borrowNum: book_borrowNum, login: false });
            }
        });
});

// router.get('/delete', function(req, res){
//     book.find({}).remove().exec();
//     res.send('all deleted');
// });

router.get('/bookdetail/:id', function (req, res) {
    req.session.id = req.params.id
    res.redirect('/bookdetail')
})

router.get('/bookdetail', function(req, res){
    // res.send(req.session.id)
    book.findById(req.session.id)
        .populate('author')
        .exec(function (err, b) {
            if (err) console.log(err);
            else {
                console.log(b.author.name)
                res.render('book_detail', { book: b })
            }

    })
})
router.get('/test', function (req, res) {

    // console.log("hello");
    book.findOne({})
        .populate('author')
        .exec(function (err, b) {
            if (err) console.log(err);
            else {
                console.log(b.author.name)
                res.render('book_detail', { book: b })
            }

        })
})
module.exports = router;
