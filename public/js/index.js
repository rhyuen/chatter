//index.js

$(document).ready(function(){


  //$("#username").val(randNickname);
});

var socket = io();
$("form").submit(function(){
  socket.emit("chatmessage", {
    name: $("#username").val(),
    text: $("#m").val()
  });
  $("#messages").append($("<li/>", {text: "You said: " + $("#m").val()}));
  $("#m").val("");
  return false;
});

//Marks Start of session.
var start = new Date();


//To get relative to curr time.
//Take CurrentTime - MarkedTime
//Handle Rel time on client side only.  Not on server side.
function handleRelativeTime(timeOnScreen){
  var currentTime = new Date();
  return "emptyDate";
}


//listener for when the typing bar is active.
//check to see if textfield is full or not.

$("#m").keydown(function(){
  if($("#m").val().length ===0){
    socket.emit("status", {
      user: $("#username").val(),
      typing: true
    });
  }
});


socket.on("status", function(client){
  //console.log("Update typing status.");
  $("#participant_list li").each(function(){
    if($(this).text().indexOf(client.user) !== -1)
      $(this).html(client.user + " is typing");
  });
});



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
  var clientName = "";
  if($("#username").val() !== null || $("#username").val() === ""){
    clientName = $("#username").val();
  }

  $("#participant_list").empty();
  participantList.map(function(participant){
    if(participant === clientName)
      participant += " (You)";
    $("#participant_list").append($("<li/>", {text: participant, class: "mdl-list__item"}));
  });
});
