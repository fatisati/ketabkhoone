/*
* Module dependencies.
*/
var express    = require('express')    
    , routes   = require('./routes')
    , user     = require('./routes/user')
    , common    = require('./routes/common')
    , fs       = require('fs')
    , http     = require('http')
    , util     = require('util')
    , path     = require('path');

var app = express();


/*
 * connect middleware - please note not all the following are needed for the specifics of this example but are generally used.
 */
app.configure(function() {
    app.set('port', process.env.PORT || 3000);
    app.set('views', __dirname + '/views');
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser({ keepExtensions: true, uploadDir: __dirname + '/public/uploads' }));
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(path.join(__dirname, '/public')));
    app.use(express.static(__dirname + '/static'));
    app.use(express.errorHandler());
});

//File upload
app.get('/upload', common.imageForm);
app.post('/upload', common.uploadImage);


http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});
