var builder = require('botbuilder');
var database = require('./database')

var MongoClient = require('mongodb').MongoClient;
//var url = process.env.MONGODB_URI//"mongodb://localhost:27017/mydb";
var url = "mongodb://localhost:27017/mydb"

var generes = {
    scary: 'scary',
    fantasy: 'fantasy'
};

module.exports = [
    // name
    function (session) {
        session.send('Welcome to the ketabkhoone submit session!');
        builder.Prompts.text(session, 'Please enter your book name');
    },
    function (session, results, next) {
        session.dialogData.name = results.response;
        session.send('wow you are adding %s to our library!', results.response);
        next();
    },

    // author
    function (session) {
        builder.Prompts.text(session, 'now enter book author:');
    },
    function (session, results, next) {
        session.dialogData.author = results.response;
        next();
    },

    // genere
    function (session) {
        // prompt for genere option
        builder.Prompts.choice(
            session,
            'and what is the genere of the book?',
            [generes.scary, generes.fantasy],
            {
                maxRetries: 3,
                retryPrompt: 'Not a valid option'
            });
    },
    function (session, results, next) {

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

        session.dialogData.genere = results.response;
        next();
    },

    // Search...
    function (session) {
        var name = session.dialogData.name;
        var author = session.dialogData.author;
        var genere = session.dialogData.genere;

        session.send(
            'Ok. adding book %s auther %s, genere %s with owner %s...',
            name,
            author, genere, session.message.user.name);

        // Async search
        
        database
            .add(name, author, genere, session.message.user.name)
            // .then(function (hotels) {
            //     // Results
            //     session.send('I found in total %d hotels for your dates:', hotels.length);

            //     var message = new builder.Message()
            //         .attachmentLayout(builder.AttachmentLayout.carousel)
            //         .attachments(hotels.map(hotelAsAttachment));

            //     session.send(message);

            //     // End
            //     session.endDialog();
            // });
    }
];

// // Helpers
// function hotelAsAttachment(hotel) {
//     return new builder.HeroCard()
//         .title(hotel.name)
//         .subtitle('%d stars. %d reviews. From $%d per night.', hotel.rating, hotel.numberOfReviews, hotel.priceStarting)
//         .images([new builder.CardImage().url(hotel.image)])
//         .buttons([
//             new builder.CardAction()
//                 .title('More details')
//                 .type('openUrl')
//                 .value('https://www.bing.com/search?q=hotels+in+' + encodeURIComponent(hotel.location))
//         ]);
// }

// Date.prototype.addDays = function (days) {
//     var date = new Date(this.valueOf());
//     date.setDate(date.getDate() + days);
//     return date;
// };