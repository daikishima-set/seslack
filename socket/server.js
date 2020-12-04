require('dotenv').config()
var fs = require('fs');
var express = require('express');
var app = express();
var http = require('http').Server(app);
const io = require('socket.io')(http,{
  cors : {
    origin: process.env.SOCKET_ORIGIN.split(','),
    methods: ["GET", "POST"]
  }
});
const PORT = process.env.PORT || 7000;
let userList = [];

app.get('/' , function(req, res){
   res.send('socket server');
});

io.on('connection',function(socket){
  socket.on('login', function (data) {
    console.log("login");
    userList = userList.filter((user) => {
      if(user.name != data.name){
          return data;
      }
    })
    userList.push({name: data.name, group: data.groupTag, socket: socket})
  });

  socket.on('logout', function (data) {
    console.log("logout");
  });

  socket.on('update', function (data) {
    console.log("receive update");
    userList.forEach((user) => {
      if(user.group == data.groupTag){
          user.socket.emit('update', data)
      }
    })
  });
});

http.listen(PORT, function(){
    console.log('server listening. Port:' + PORT);
});