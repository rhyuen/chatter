var express = require("express");
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
app.use(express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "public/views"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));


require("./routes")(app, io);


http.listen(app.get("PORT"), function(){
  console.log("Listening on port %s", app.get("PORT"));
});
