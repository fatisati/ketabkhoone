var http = require('http');
var server = http.createServer(function(req, res) {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello world!');
});
console.log('hey this is a test')
server.listen(process.env.PORT);