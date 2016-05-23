//index.js

$(document).ready(function(){

  var colours = ["Red", "Orange", "Yellow", "Teal", "Chartreuse", "Lavender", "Indigo"];
  var animals = ["Aardvark", "Baboon", "Crocodile", "Dog", "Giraffe", "Rhino"];

  var randColour = colours[Math.floor(Math.random()*100) % colours.length];
  var randAnimal = animals[Math.floor(Math.random()*100) % animals.length];
  var randNumber = Math.floor(Math.random()*100);
  var randNickname = randColour + randAnimal + randNumber.toString();

  $("#username").val(randNickname);
});

var socket = io();
$("form").submit(function(){
  socket.emit("chatmessage", {name: $("#username").val(), text: $("#m").val()});
  $("#m").val("");
  return false;
});

//Marks Start of session.
var start = new Date();

function handleRelativeTime(){
  var currentTime = new Date();
  return "emptyDate";
}

socket.on("chatmessage", function(msg){
  $("#messages").append($("<li>")
    .append($("<span/>", {text: msg.name + " said: " + msg.text, class: "messagecontent"}))
    .append($("<span/>", {text: Math.floor(((new Date()).getTime() - start.getTime())/1000), class: "messagedate"})));

});

socket.on("notification", function(msg){
  $("#messages").append($("<li>", {text: msg, class: "notification"}));
});
