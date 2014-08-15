'use strict';
var app = require('express')();
var http = require('http').Server(app);
var port = process.env.port || 3000;
var io = require('socket.io')(http);

var keys;
if(!process.env.keys){
  keys = require('./keys.js');
} else {
  keys = process.env.keys;
}

console.log(keys);

app.get('/', function(req, res){
  res.sendfile('index.html');
});

io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('chat message', function(msg){
    console.log('message: ' + msg);
    io.emit('chat message', msg);
  });
  

  socket.on('disconnect', function(){
    console.log('user disconnected');
  });

});

http.listen(port, function(){
  console.log('listening on port: ' + port);
});