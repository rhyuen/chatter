//index.js

$(document).ready(function(){


  //$("#username").val(randNickname);
});

var socket = io();
$("form").submit(function(){
  socket.emit("chatmessage", {name: $("#username").val(), text: $("#m").val()});
  $("#m").val("");
  return false;
});

//Marks Start of session.
var start = new Date();


//To get relative to curr time.
//Take CurrentTime - MarkedTime
function handleRelativeTime(timeOnScreen){
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

socket.on("get_id", function(receivedId){
  $("#username").val(receivedId);
});

//Listens to server for updates to participant list
socket.on("participant_list", function(participantList){
  $("#participant_list").empty();
  participantList.map(function(participant){
    $("#participant_list").append($("<li/>", {text: participant}));
  });
});
