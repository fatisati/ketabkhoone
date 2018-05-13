var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('login', {fail : false});    
});

/* GET Hello World page. */
router.get('/helloworld', function(req, res) {
    res.render('helloworld', { title: 'Hello, World!' });
});

/* GET Userlist page. */
router.get('/userlist', function(req, res) {
    var db = req.db;
    var collection = db.get('usercollection');
    collection.find({},{},function(e,docs){
        res.render('userlist', {
            "userlist" : docs
        });
    });
});

/* GET New User page. */
router.get('/newuser', function(req, res) {
    res.render('newuser', { title: 'Add New User' });
});

/* POST to Add User Service */


// main login page //
router.get('/login', function(req, res){
// check if the user's credentials are saved in a cookie //
    res.render('login', { title: 'Hello - Please Login To Your Account' });
});

router.get('/signup', function(req, res){
// check if the user's credentials are saved in a cookie //
    res.render('signup', { title: 'Hello - Please Login To Your Account' });
});

router.post('/adduser', function(req, res) {

    // Set our internal DB variable
    var db = req.db;

    // Get our form values. These rely on the "name" attributes
    var userName = req.body.user;
    var userEmail = req.body.email;
    var pass = req.body.pass;

    // Set our collection
    var collection = db.get('usercollection');

    // Submit to the DB
    collection.insert({
        "username" : userName,
        "email" : userEmail,
        "pass": pass
    }, function (err, doc) {
        if (err) {
            // If it failed, return error
            res.send("There was a problem adding the information to the database.");
        }
        else {
            // And forward to success page
            res.redirect("userlist");
        }
    });
});

router.post('/auth', function(req, res) {

    // Set our internal DB variable
    var db = req.db;

    // Get our form values. These rely on the "name" attributes
    var userName = req.body.user;
   var pass = req.body.pass;

    // Set our collection
    var collection = db.get('usercollection');

    collection.findOne({username:userName}, function(e, o) {
		if (o){
			o.pass == pass ? res.render("main"): res.send("wronge pass");
		}	else{
            res.render("login", {fail : true});
            //res.status(400).send(e);    
		}
	});
    
});

router.get('/test', function(req, res) {
    res.render('test');
});

router.post('/adduser', function(req, res) {

    // Set our internal DB variable
    var db = req.db;

    // Get our form values. These rely on the "name" attributes
    var userName = req.body.user;
    var userEmail = req.body.email;
    var pass = req.body.pass;

    // Set our collection
    var collection = db.get('usercollection');

    // Submit to the DB
    collection.insert({
        "username" : userName,
        "email" : userEmail,
        "pass": pass
    }, function (err, doc) {
        if (err) {
            // If it failed, return error
            res.send("There was a problem adding the information to the database.");
        }
        else {
            // And forward to success page
            res.redirect("userlist");
        }
    });
});

router.post('/addbook', function(req, res) {

    // Set our internal DB variable
    var db = req.db;

    // Get our form values. These rely on the "name" attributes
    var bookName = req.body.bookName;
    var author = req.body.auther;
    //var genere = req.body.
    
    // Set our collection
    var collection = db.get('books');

    collection.insert({
        "bookName" : bookName,
        "author" : author,
        
    }, function (err, doc) {
        if (err) {
            // If it failed, return error
            res.send("There was a problem adding the information to the database.");
        }
        else {
            // And forward to success page
            res.send("book added.");
        }
    });
    
});


module.exports = router;
