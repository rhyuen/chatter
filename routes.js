var express = require("express");
var path = require("path");

module.exports = function(server, io){
  server.get("/", function(req, res){
    res.sendFile(path.join(__dirname, "public/views/index.html"));

    io.on("connection", function(socket){
      io.emit("notification", "A new chatter has joined");

      socket.on("chatmessage", function(msg){
        //console.log("message: %s", msg);

        io.emit("chatmessage", msg);
      });
    });

  });
  //return server;
};
