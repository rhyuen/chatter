//index.js
$(document).ready(function(){
  var socket = io();

  var sessionStartTime = new Date();
  var lastActiveSessionTime = new Date();
  var accumulatedSessionTime = 0;


  document.addEventListener("visibilitychange", function(){
    if(document.hidden){
      lastActiveSessionTime = new Date();
      var timeStoppedAt = new Date();

      socket.emit("afk", {
        name: $("#username").val(),
        afk: true,
        time: timeStoppedAt
      });

      //var diff = sessionStartTime - timeStoppedAt;
      $("#total_elapsed_time").text(Math.ceil((new Date() - sessionStartTime)/1000));

      accumulatedSessionTime += (new Date()-lastActiveSessionTime);
      $("#total_active_time").text(accumulatedSessionTime);
      $("#eff_ratio").text("Ratio Placeholder");
    }else{
      //There are three other cases to account for but the following will
      //only cover the VISIBLE CASE
      console.log("Set to Available");
      socket.emit("afk", {
        name: $("#username").val(),
        afk: false
      });
    }
  });

  $("#m").keypress(function(e){
    if(e.which == 13)
      $("form").submit();
  });

  $("form").submit(function(){
    //Prevent Empty String messages from being sent.
    if($.trim($("#m").val()) === ""){
      return false;
    }


    socket.emit("chatmessage", {
      name: $("#username").val(),
      text: $("#m").val()
    });

    //For When you're done typing so the status symbol goes away.
    socket.emit("status", {
      user: $("#username").val(),
      typing: false
    });

    $("#messages")
      .append($("<li/>")
      .append($("<span/>", {text: "You said: ", class: "messageuser"}))
      .append($("<span/>", {text: $("#m").val(), class: "messagecontent"}))
      .append($("<span/>", {text: new Date().toLocaleTimeString()})));

    $("#m").val("");
    $("#messages").scrollTop = $("#messages").scrollHeight;
    return false;
  });


  //listener for when the typing bar is active.
  $("#m").keydown(function(){
    //There's a one character or so issue with the typing.
    socket.emit("status", {
      user: $("#username").val(),
      typing: !($("#m").val().length === 0)
    });
  });

  socket.on("status", function(client){
    $(".par_list_par_name").each(function(){
      //Find User in question
      if($(this).text().indexOf(client.user) !== -1){
        if($(this).text().indexOf("is typing") === -1){
          $(this).parent().find(".par_list_par_typing > i").text("chat");
        }
        if(client.typing === false){
          $(this).parent().find(".par_list_par_typing > i").text("");
        }
      }
    });
  });

  socket.on("afk", function(client){
    $(".par_list_par_name").each(function(){

      if($(this).text() ===  client.name){
        var clientIsAfk = (client.afk) ? "" : "visibility";
        $(this).parent().find(".par_list_par_afk > i").text(clientIsAfk);
      }

    });
  });

  socket.on("chatmessage", function(msg){
    $("#messages").append($("<li/>")
      .append($("<span/>", {text: msg.name + " said: ", class: "messageuser"}))
      .append($("<span/>", {text: msg.text, class: "messagecontent"}))
      .append($("<span/>", {text: new Date().toLocaleTimeString()})));
  });


  socket.on("notification", function(notif){
    if(notif.type === "JOIN"){
      $("#messages").append($("<li>", {text: notif.message, class: "notification-join"}));
    }else{
      $("#messages").append($("<li>", {text: notif.message, class: "notification-leave"}));
    }
  });

  //Setup Initial Anon User
  socket.on("get_id", function(receivedId){
    $("#username").val(receivedId);
    socket.emit("afk", {
      name: $("#username").val(),
      afk: false
    });
  });


  function handleColourForParList(participantName){
    var colourToCss = {
      "Red": "reduser",
      "Teal": "tealuser",
      "Yellow": "yellowuser",
      "Green": "greenuser",
      "Lavender": "lavenderuser",
      "Indigo": "indigouser",
      "Orange": "orangeuser"
    };

    var startsWithColour = Object.keys(colourToCss).filter(function(colour){
      return participantName.startsWith(colour);
    });

    return colourToCss[startsWithColour];
  }



  socket.on("participant_list", function(participantList){
    var clientName = "";
    if($("#username").val() !== null || $("#username").val() === ""){
      clientName = $("#username").val();
    }

    $("#participant_list").empty();

    $("#room_count").text(participantList.length);

    participantList.map(function(participant){

      var yourselfIdentifier = (participant === clientName) ? " (You) " : "";

      $("#participant_list")
        .append($("<li/>", {class: "mdl-list__item " + handleColourForParList(participant)})
          .append($("<span/>", {class: "mdl-list__item-primary-content"})
            .append($("<span/>", {class: "par_list_par_avatar"})
              .append($("<i/>", {class: "material-icons mdl-list__item-avatar", text: "person"}))
            .append($("<span/>", {class: "par_list_par_name", text: participant}))
            .append($("<span/>", {class: "par_list_par_you", text: yourselfIdentifier}))
            .append($("<span/>", {class: "par_list_par_typing"})
              .append($("<i/>", {class: "material-icons"})))
            .append($("<span/>", {class: "par_list_par_afk"})
              .append($("<i/>", {class: "material-icons"}))))));
    });
  });
});
