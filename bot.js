//const express = require('express')
var builder = require('botbuilder');
var restify = require('restify');

var MongoClient = require('mongodb').MongoClient;
//var url = process.env.MONGODB_URI//"mongodb://localhost:27017/mydb";
var url = "mongodb://localhost:27017/mydb"

// // Create HTTP server and start listening
// const server = express()
// //server.listen(process.env.port || process.env.PORT || 3978, function () { })
// server.listen(process.env.port || process.env.PORT || 3978, () => {
//     console.log('test server is listening on :3978')
// })

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log('%s listening to %s', server.name, server.url);
});

var connector = new builder.ChatConnector({

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

var DialogLabels = {
    submit: 'Submit',
    search: 'Search'
};

var owner, name, auther, genere

var bot = new builder.UniversalBot(connector, [
    function (session) {
        // prompt for search option
        builder.Prompts.choice(
            session,
            'Hey, what do you want to do?',
            [DialogLabels.submit, DialogLabels.search],
            {
                maxRetries: 3,
                retryPrompt: 'Not a valid option'
            });
    },
    function (session, result) {
        if (!result.response) {
            // exhausted attemps and no selection, start over
            session.send('Ooops! Too many attemps :( But don\'t worry, I\'m handling that exception and you can try again!');
            return session.endDialog();
        }

        // on error, start over
        session.on('error', function (err) {
            session.send('Failed with message: %s', err.message);
            session.endDialog();
        });

        // continue on proper dialog
        var selection = result.response.entity;
        switch (selection) {
            case DialogLabels.submit:
                return session.beginDialog('submit');
            case DialogLabels.search:
                return session.beginDialog('search');
        }
    }
]);

var submitbook = 'submit book';
var search = 'search';
var Options = [submitbook, search];

bot.dialog('submit', require('./submit'));
bot.dialog('search', require('./search'));
bot.dialog('support', require('./support'))
    .triggerAction({
        matches: [/help/i, /support/i, /problem/i]
    });

// log any bot errors into the console
bot.on('error', function (e) {
    console.log('And error ocurred', e);
});