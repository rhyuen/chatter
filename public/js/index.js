//index.js

$(document).ready(function(){

});


document.addEventListener("visibilitychange", function(){
  if(document.hidden){
    console.log("Set to User Status to AFK");
  }else{
    console.log("Set to Available");
  }
});

var socket = io();
$("form").submit(function(){
  socket.emit("chatmessage", {
    name: $("#username").val(),
    text: $("#m").val()
  });

  $("#messages")
    .append($("<li/>")
    .append($("<span/>", {text: "You said: " + $("#m").val(), class: "messagecontent"}))
    .append($("<span/>", {text: "time"})));

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

$("form").submit(function(){
  socket.emit("status", {
    user: $("#username").val(),
    typing: false
  });
});


socket.on("status", function(client){
  $("#participant_list li").each(function(){
    //Find User in question
    if($(this).text().indexOf(client.user) !== -1){
      if($(this).text().indexOf("is typing") === -1){
        $(this).html(client.user + " is typing");
      }

      if(client.typing === false){
        $(this).html(client.user);
      }
    }
  });
});



socket.on("chatmessage", function(msg){
  $("#messages").append($("<li/>")
    .append($("<span/>", {text: msg.name + " said: " + msg.text, class: "messagecontent"}))
    .append($("<span/>", {text: "time"})));
});


socket.on("notification", function(msg){
  $("#messages").append($("<li>", {text: msg, class: "notification"}));
});

socket.on("get_id", function(receivedId){
  $("#username").val(receivedId);
});

//Listens to server for updates to participant list
socket.on("participant_list", function(participantList){
  //Appends your name with (You) so you know who you are.
  var clientName = "";
  if($("#username").val() !== null || $("#username").val() === ""){
    clientName = $("#username").val();
  }

  $("#participant_list").empty();

  $("#room_count").text(participantList.length);

  participantList.map(function(participant){
    if(participant === clientName)
      participant += " (You)";

    $("#participant_list")
      .append($("<li/>", {class: "mdl-list__item"})
      .append($("<span/>", {class: "mdl-list__item-primary-content"})
        .append($("<i/>", {class: "material-icons mdl-list__item-avatar", text: "person"}))
        .append($("<span/>", {text: participant})))
      .append($("<span/>"))
      .append($("<i/>", {class: "material-icons", text: "star"})));
  });
});
