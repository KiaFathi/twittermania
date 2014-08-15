'use strict';
var app = require('express')();
var http = require('http').Server(app);
var port = process.env.port || 3000;
var io = require('socket.io')(http);

var keys;
if(!process.env.keys){
  keys = require('./keys.js');
}

//Require your the twitter dependencies
var twitter = require('twitter');

//Now lets set up a twitter account from dev.twitter.com
//Find these in your applications API Keys tab
var twit = new twitter({  
  consumer_key: process.env.apikey || keys.apiKey,
  consumer_secret: process.env.apiSecret || keys.apiSecret,
  access_token_key: process.env.accessToken || keys.accessToken,
  access_token_secret: process.env.accessTokenSecret || keys.accessTokenSecret
});

console.log(keys);

var tweet = '';

// twit.updateStatus('Test tweet from node-twitter', function(data){
//   console.log(data);
// });

app.get('/', function(req, res){
  res.sendfile('index.html');
});

app.post('/tweet', function(req, res){
  console.log(req);
  res.send('RECEIVED');
})

io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('chat message', function(msg){
    console.log('message: ' + msg);
    io.emit('chat message', msg);
    tweet += ' ' + msg;
    tweet.trim();
  });
  

  socket.on('disconnect', function(){
    console.log('user disconnected');
  });

});

http.listen(port, function(){
  console.log('listening on port: ' + port);
});

setInterval(function(){
  tweet = tweet.slice(0,139);
  if(tweet.length > 0){
    twit.updateStatus(tweet, function(data){
      console.log(tweet);
      tweet = '';
    });    
  }
}, 30000);