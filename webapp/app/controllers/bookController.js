var express = require('express');
const book = require("../models/book.js");
const bookInstance = require("../models/book_instance.js");
const user = require("../models/user.js");
const author = require("../models/author.js");
var router = express.Router();
var fs = require('fs');

exports.add_book = function (req, res) {

    console.log('we are in add book.');
    var bookname = req.body.bookname;
    var authorname = req.body.author;
    var publication = req.body.publication;
    var yearOfPublish = req.body.yearOfPublish;
    var genre = req.body.genre;
    var numPages = req.body.numPages;
    var info = req.body.info;
    var image_path = req.files[0].path;
    var owner_comment = req.body.owner_comment;
    var beautiful_part = req.body.beautiful_part;
    try {
        var image = fs.readFileSync(image_path);
        console.log('fs read the image');
    }
    catch (e) {
        console.log(e);
    }
    var aobject;
    author.findOne({ name: authorname }, function (err, doc) {
        if (doc) {
            aobject = doc;
            console.log('author ' + authorname + ' found in db.');
        }
        else {
            let a = new author({ name: authorname });
            a.save();
            console.log('author ' + authorname + ' saved in db.');
            aobject = a;
        }
        // console.log('i an saving book with author: ' + b.author.name);
    });

    //book model
    var b = new book({
        bookname: bookname,
        author: aobject,
        genre: genre,
        summary: info,
        comment: owner_comment
    });
    user.findOne({ 'bookname': { "$regex": bookname, $options: 'i' } }, (err, u) => {
        if (u) {
            //this book is not new so do nothing 
            b = u;
        } else {
            //add this book to book model
            b.save();
        }
    })
    //book instance
    let bI = new bookInstance({
        book: b,
        author: aobject,
        summary: info,
        beautiful_part: beautiful_part,
        publication: publication,
        status: 'Available',
        owner_comment: owner_comment,
        yearOfPublish: yearOfPublish,
        numPages: numPages,
    });
    bI.img.data = image;
    bI.img.contentType = req.files[0].mimetype;

    bI.save(function (err) {
        if (err) {
            res.send(err);
        }
        else {
            res.redirect('/home');
        }

    });

}


exports.search_book = function (req, res) {

    bn = req.body.name;
    console.log("SEARCH" + bn)
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
                b1.sort((a, b) => (a.score > b.score) ? 1 : ((b.score > a.score) ? -1 : 0));
                var count = b1.length
                for (i = 0; i < count; i++) {
                    book_score[i] = b1[i];
                }
                //BASED ON ISBN OF BOOK
                book_isbn = [];
                b1.sort((a, b) => {
                    if (a.isbn < b.isbn) return 1;
                    if (a.isbn > b.isbn) return -1;
                    return 0;
                });
                for (i = 0; i < count; i++) {
                    book_isbn[i] = b1[i];
                }
                //BASED ON borrowNum OF BOOK
                book_borrowNum = [];
                b1.sort((a, b) => {
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

}

exports.book_image = function (req, res) {
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
}

exports.all_books = function (req, res) {

    // res.send('we are in all books')
    book.find({ 'img': { $ne: null } })
        .populate('author')
        .exec((err, b) => {
            if (err) {
                console.log(err)
            } else {
                //BASED ON SCORE OF BOOK
                book_score = [];
                b.sort((a, b) => (a.score > b.score) ? 1 : ((b.score > a.score) ? -1 : 0));
                var count = b.length
                for (i = 0; i < count; i++) {
                    book_score[i] = b[i];
                }
                //BASED ON ISBN OF BOOK
                book_isbn = [];
                b.sort((a, b) => {
                    if (a.isbn < b.isbn) return 1;
                    if (a.isbn > b.isbn) return -1;
                    return 0;
                });
                for (i = 0; i < count; i++) {
                    book_isbn[i] = b[i];
                }
                //BASED ON borrowNum OF BOOK
                book_borrowNum = [];
                b.sort((a, b) => {
                    if (a.borrowNum < b.borrowNum) return 1;
                    if (a.borrowNum > b.borrowNum) return -1;
                    return 0;
                });
                for (i = 0; i < count; i++) {
                    book_borrowNum[i] = b[i];
                }
                res.render('show_books', { books: b, book_score: book_score, book_isbn: book_isbn, book_borrowNum: book_borrowNum, login: false });
                // res.render('show_books', { books: b, login: false });

            }
        });
}


exports.book_detail = function (req, res) {
    // res.send(req.session.id)
    book.findById(req.session.id)
        .populate('author')
        .exec(function (err, b) {
            if (err) console.log(err);
            else {
                console.log(b.author.name)
                res.render('book_detail', { book: b, users: [{ name: 'fatemeh' }, { name: 'maryam' }] })
            }

        })
}