// YOUR CODE HERE:
var app = {

  rooms: [],
  friends: [],
  currentUser: '',
  currentRoom: '',

  init: function(){
    app.myUser = window.location.search.substring(1).split("=")[1];
    app.currentRoom = 'lobby';
    console.log(app.myUser);
    $("#myUser").html(app.myUser);
  },

  send: function(message){

    $.ajax({
      // always use this url
      url: 'https://api.parse.com/1/classes/chatterbox',
      type: 'POST',
      data: JSON.stringify(message),
      dataType: 'JSON',
      contentType: 'application/json',
      success: function (message) {
        console.log('chatterbox: Message sent:');
        console.log(message);
      },
      error: function (data) {
      // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message');
      }
    });
  },

  fetch: function(apiUrl){
    $.ajax({
      // always use this url
      // url: 'https://api.parse.com/1/classes/chatterbox',
      url: apiUrl,
      type: 'GET',
      data: {
        order: "-createdAt"
      },
      contentType: 'application/json',
      beforeSend: function (data) {
        console.log('chatterbox: Message got:');
      },
      success: function (data) {
        app.clearMessages();
        for(var i = 0; i < data["results"].length; i++){
          var user = app.sanitize(data["results"][i]["username"]);
          var message = app.sanitize(data["results"][i]["text"]);
          var date = data["results"][i]["createdAt"];
          var roomname = app.sanitize(data["results"][i]["roomname"]);

          app.addRoom(roomname);
          if (roomname === app.currentRoom) {
          // if(data["results"][i]["username"] === 'anonymous' || data["results"][i]["username"] === 'person'){
             $("#chats").append("<li class='list-group-item'><a href='#' class='username' style='font-weight: bold'>" + user + "</a>" + ": " + message + "<div class='text-right'>" + humaneDate(date) + "</div>");
            // var $li = $("<li>");
            // $li.addClass("list-group-item");
            // var $date = $("<div>").text(humaneDate(date));
            // $date.addClass("text-right");
            // var $usr = $("<a href'#'>").text(user);
            // $usr.addClass("username");
            // var $msg = $("<div >").text(message);
            // $li.append($usr);
            // $li.append($date);
            // $li.append($msg);
            // $("#chats").append($li);
          // // }
          }
        }
        app.clickEventHandler();
      },
      error: function (data) {
      // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to get message');
      }
    });
  },

  addMessage: function(message){
    app.send(message);
  },

  clearMessages: function(){
    var $nodes = $('#chats').children();
      $nodes.remove();
  },

  addRoom: function(roomname){
    if (this.rooms.indexOf(roomname) === -1) {
      this.rooms.push(roomname);
      $("#roomSelect").append("<li> <a href='#' class='room'>"+roomname+"</a>");
    }

    return this.rooms;
  },

  addFriend: function(friend) {
    if (this.friends.indexOf(friend) === -1) {
      this.friends.push(friend);
      $("#friendsSelect").append("<li> <a href='#' class='friend'>"+friend+"</a>");

    }
  },

  clickEventHandler: function() {
    $("#main .username").on("click", function() {
      console.log("clickity");
      app.addFriend($(this).html());
    });

    $(".room").on("click", function() {
      app.currentRoom = $(this).html();
      console.log(app.currentRoom);

    });
  },

  sanitize: function(value){
    var html = value;
    var div = document.createElement("div");
    div.innerHTML = html;
    return div.textContent || div.innerText || "";
  }

};




$(document).ready(function(){

  app.init();

  $(".btn").on("click", function() {
    var text = $("#text").val();
    var message = {
      username: app.myUser,
      text: text,
      roomname: app.currentRoom
    };
    app.addMessage(message);
  });
  setInterval(function(){app.fetch('https://api.parse.com/1/classes/chatterbox')}, 2000);
});



