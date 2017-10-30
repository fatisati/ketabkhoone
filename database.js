var Promise = require('bluebird');
var MongoClient = require('mongodb').MongoClient;
//var url = process.env.MONGODB_URI//"mongodb://localhost:27017/mydb";
var url = "mongodb://localhost:27017/mydb"

module.exports = {
    add: function (name, author, genere, owner) {
        return new Promise(function (resolve) {

            MongoClient.connect(url, function (err, db) {
                if (err) throw err;
                var myobj = { bowner: owner, bname: name, bauther: auther, bgenere: genere };
                db.collection("books").insertOne(myobj, function (err, res) {
                    if (err) throw err;
                    console.log("1 document inserted");
                    db.close();
                });
            })

        });
    }
};