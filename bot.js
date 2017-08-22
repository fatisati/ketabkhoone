const express = require('express')
const { ChatConnector, UniversalBot, Prompts, EntityRecognizer, ListStyle, Message } = require('botbuilder')

// Create HTTP server and start listening
const server = express()
//server.listen(process.env.port || process.env.PORT || 3978, function () { })
server.listen(3978, () => {
    console.log('server is listening on :3978')
})

const connector = new ChatConnector({
    appId: '803f163f-d165-4dd8-ad23-302aa3207db4',
    appPassword: 'kjr94FJbvwziw5S4bqXCNej'

    // appId: process.env.MICROSOFT_APP_ID,
    // appPassword: process.env.MICROSOFT_APP_PASSWORD
})

server.post('api/messages', connector.listen())

const bot = new UniversalBot(connector, session => {
    session.beginDialog('test')
})



bot.dialog('test',[
    // (session) => {
    //     session.send("Welcome to the dinner reservation.")
    // },
    // (session, results) => {
    //     session.send(results.from.id)
    // }]
    // Step 1
    (session) => {
        Prompts.text(session, 'Hi! What is your name?')
    },
    // Step 2
    (session, results) => {
        session.endDialog('Hello %s!', session.message.user.id)
    }
]
)