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
$("#m").keydown(function(){
  //There's a one character or so issue with the typing.
  socket.emit("status", {
    user: $("#username").val(),
    typing: !($("#m").val().length === 0)
  });
});


socket.on("status", function(client){

  $("#participant_list li").each(function(){

    //Find User in question
    if($(this).text().indexOf(client.user) !== -1){
      if($(this).text().indexOf("is typing") === -1)
        $(this).html(client.user + " is typing");
      if(client.typing === false){
        $(this).html(client.user);
      }
    }

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
