//index.js

var socket = io();

var totalElapsedTime = new Date();

document.addEventListener("visibilitychange", function(){
  if(document.hidden){
    console.log("Set to User Status to AFK");

    var timeStoppedAt = new Date().toLocaleString();

    socket.emit("afk", {name: $("#username").val(), time: timeStoppedAt});

    var diff = totalElapsedTime - timeStoppedAt;
    $("#total_elapsed_time").text(totalElapsedTime);
    var normalizedDiff = Math.abs(diff)/1000;
    console.log(normalizedDiff);
    $("#total_active_time").text(normalizedDiff);
  }else{
    console.log("Set to Available");
  }
});


$("form").submit(function(){
  socket.emit("chatmessage", {
    name: $("#username").val(),
    text: $("#m").val()
  });

  $("#messages")
    .append($("<li/>")
    .append($("<span/>", {text: "You said: " + $("#m").val(), class: "messagecontent"}))
    .append($("<span/>", {text: new Date().toLocaleString()})));

  $("#m").val("");
  return false;
});

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

socket.on("afk", function(client){
  //find the element that emitted afk status
  //find the el on client and change it.
  //IDENTIFY BY NAME TEXT and CHANGE VISIBILITY ICON
  //$("#afk")
  $("")
});


socket.on("chatmessage", function(msg){
  $("#messages").append($("<li/>")
    .append($("<span/>", {text: msg.name + " said: " + msg.text, class: "messagecontent"}))
    .append($("<span/>", {text: new Date().toLocaleString()})));
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
      .append($("<i/>", {class: "material-icons", text: "visibility"})));
  });
});
