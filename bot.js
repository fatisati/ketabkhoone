const express = require('express')
const { ChatConnector, UniversalBot, Prompts, EntityRecognizer, ListStyle, Message, CardImage, CardAction } = require('botbuilder')

var MongoClient = require('mongodb').MongoClient;
var url = process.env.MONGODB_URI//"mongodb://localhost:27017/mydb";
//var url = "mongodb://localhost:27017/mydb"

// Create HTTP server and start listening
const server = express()
//server.listen(process.env.port || process.env.PORT || 3978, function () { })
server.listen(process.env.port || process.env.PORT || 3978, () => {
    console.log('test server is listening on :3978')
})

const connector = new ChatConnector({

    appId: '98078728-f4ff-4d43-aba7-ed1643232c91',
    appPassword: 'FBtUvF1mjSvD6QHhPBhae3P'

})

server.post('/api/messages', connector.listen()) //if server post on api/messages connector should listen
//test for get id of my user
// var bot = new UniversalBot(connector, function (session) {
//     // echo the user's message
//     session.send("You said: %s", session.message.user.name);
//     session.send("You said: %s", session.message.text);
// });
var owner, name, auther, genere
var bot = new UniversalBot(connector, [
    function (session) {
        owner = session.message.user.name
        var txt = "Hey " + owner + ", what do you want to do?"

        Prompts.choice(session, txt, Options, {
            maxRetries: 3,
            retryPrompt: 'Ooops, what you wrote is not a valid option, please try again'
        });
    },
    function (session, results) {


        var selectedName = results.response.entity;
        var item = menu(selectedName, session);

        // attach the card to the reply message
        //var msg = new Message(session).addAttachment(card);
        //session.send(msg);

    }
]);
var submitbook = 'submit book';

var search = 'search';
var Options = [submitbook, search];

function menu(selectedName, session) {
    switch (selectedName) {
        case submitbook:
            return submitBook(session);
        case search:
            return searchF(session)
        default:
    }
}

function submitBook(session) {
    session.beginDialog('submitbook')
}

function searchF(session) {
    session.beginDialog('search')
}



bot.dialog('submitbook', [
    // Step 1
    (session) => {
        Prompts.text(session, 'What is your book name?')
    },

    // Step 2
    (session, results) => {

        name = session.message.text
        owner = session.message.user.name

        Prompts.text(session, 'ok..., and what is its genere?')

    },
    // Step 3
    (session, results) => {

        genere = session.message.text
        Prompts.text(session, 'well, and auther?')
    },
    // Step 4
    (session, results) => {

        auther = session.message.text

        //Prompts.text(session, 'ok..., and what is its auther name?')
        MongoClient.connect(url, function (err, db) {
            if (err) throw err;
            var myobj = {bowner: owner,   bname: name, bauther: auther, bgenre: genere};
            db.collection("books").insertOne(myobj, function (err, res) {
                if (err) throw err;
                console.log("1 document inserted");
                db.close();
            });


            // db.collection("books").findOne({}, function(err, result) {
            //     if (err) throw err;
            //     console.log(result.name);
            //     db.close();
            // });
        });

        session.endDialog('thanks  dear %s!', owner)
    }
]
)

bot.dialog('search', [
    // Step 1
    (session) => {

        MongoClient.connect(url, function (err, db) {
            if (err) throw err;
            // var query = { address: "Park Lane 38" };
            db.collection("books").find({}).toArray(function (err, result) {
                if (err) throw err;
                //console.log(result[0].name);
                var ans
                for (i = 0; i < result.length; i++) {
                    ans = 'name: '
                    ans += result[i].bname
                    ans += '\n author: '
                    ans += result[i].bauther
                     ans += '\n genre: '
                    ans += result[i].bgenre
                    ans += ' \n owner: @'
                    ans += result[i].bowner
                    Prompts.text(session, ans)
                }
                //Prompts.text(session, ans)
                db.close();
            });
        });

        session.endDialog('end')
    }
]
)