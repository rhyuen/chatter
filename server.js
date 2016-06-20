"use strict";

var express = require("express");
var favicon = require("serve-favicon");
var app = express();
var http = require("http").Server(app);
var path = require("path");
var bodyParser = require("body-parser");
var helmet = require("helmet");
var io = require("socket.io")(http);
var morgan = require("morgan");

app.set("PORT", process.env.PORT || 9999);
app.use(morgan("dev"));
app.use(helmet());
app.use(favicon(path.join(__dirname, "public/images/favicon.ico")));
app.use(express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "public/views"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));


require("./routes")(app, io);


/*
Add private messaging
Add channels
Add email support
*/


http.listen(app.get("PORT"), function(){
  console.log("Listening on port %s", app.get("PORT"));
});
