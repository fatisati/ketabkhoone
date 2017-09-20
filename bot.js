const express = require('express')
const { ChatConnector, UniversalBot, Prompts, EntityRecognizer, ListStyle, Message } = require('botbuilder')

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/mydb";
// Create HTTP server and start listening
const server = express()
//server.listen(process.env.port || process.env.PORT || 3978, function () { })
server.listen(process.env.port || process.env.PORT || 3978, () => {
    console.log('test server is listening on :3978')
})

const connector = new ChatConnector({

    // MICROSOFT_APP_ID : '803f163f-d165-4dd8-ad23-302aa3207db4',
    // MICROSOFT_APP_PASSWORD : 'B2fqmtUtkTzwmyxYFbmvncJ'
    appId: '98078728-f4ff-4d43-aba7-ed1643232c91',
    appPassword: 'FBtUvF1mjSvD6QHhPBhae3P'

    // appId: process.env.MICROSOFT_APP_ID,
    // appPassword: process.env.MICROSOFT_APP_PASSWORD
})

server.post('/api/messages', connector.listen()) //if server post on api/messages connector should listen
var bot = new UniversalBot(connector, function (session) {
    // echo the user's message
    session.send("You said: %s", session.message.text);
});

// const bot = new UniversalBot(connector, session => {
//     session.beginDialog('test')
// })



// bot.dialog('test',[
//     // (session) => {
//     //     session.send("Welcome to the dinner reservation.")
//     // },
//     // (session, results) => {
//     //     session.send(results.from.id)
//     // }]
//     // Step 1
//     (session) => {
//         Prompts.text(session, 'Hi! What is your name?')
//     },
//     // Step 2
//     (session, results) => {


//         // MongoClient.connect(url, function(err, db) {
//         //     if (err) throw err;
//         //     console.log("Database created!");
//         //     db.close();
//         // });

//         // MongoClient.connect(url, function(err, db) {
//         //     if (err) throw err;
//         //     db.createCollection("customers", function(err, res) {
//         //         if (err) throw err;
//         //         console.log("Collection created!");
//         //         db.close();
//         //     });
//         // }); 
//         MongoClient.connect(url, function(err, db) {
//             if (err) throw err;
//             var myobj = { name: session.message.text, address: "Highway 37" };
//             db.collection("customers").insertOne(myobj, function(err, res) {
//                 if (err) throw err;
//                 console.log("1 document inserted");
//                 db.close();
//             });

//             db.collection("customers").findOne({}, function(err, result) {
//                 if (err) throw err;
//                 console.log(result.name);
//                 db.close();
//             });
//         });

//         session.endDialog('Hello %s!', session.message.text)
//     }
// ]
// )