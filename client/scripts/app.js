// YOUR CODE HERE:
var app = {

  rooms: [],
  friends: [],
  currentUser: '',
  currentRoom: '',

  init: function(){},

  send: function(){

    var message = {
      username: 'anon',
      text: 'Why HELLO Andrew',
      roomname: 'theROOM'
    };

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
        console.log(data);
        for(var i = 0; i < data["results"].length; i++){
          var user = data["results"][i]["username"];
          var message = data["results"][i]["text"];
          var date = data["results"][i]["createdAt"];
          var roomname = data["results"][i]["roomname"];

          app.addRoom(roomname);

          if(data["results"][i]["username"] === 'anon' || data["results"][i]["username"] === 'person'){
            $("#chats").append("<li class='list-group-item'><a href='#' class='friend' style='font-weight: bold'>" + user + "</a>" + ": " + message + "<div class='text-right'>" + humaneDate(date) + "</div>");
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

  addMessage: function(data){

    var user = data["username"];
    var message = ["text"];
    var date = new Date();
    var roomname = data["roomname"];

    $("#chats").append("<li class='list-group-item'><a href='#' class='friend' style='font-weight: bold'>" + user + "</a>" + ": " + message + "<div class='text-right'>" + humaneDate(date) + "</div>");
  },

  clearMessages: function(){
    var $nodes = $('#chats').children();
      $nodes.remove();
  },

  addRoom: function(roomname){
    if (this.rooms.indexOf(roomname) === -1) {
      this.rooms.push(roomname);
      // $("#roomSelect").append("<li> <a href='#' class="+roomname.split(' ').join()+"Class>"+roomname+"</a>");
      $("#roomSelect").append("<li> <a href='#' class="+roomname+"Class>"+roomname+"</a>");

    }

    return this.rooms;
  },

  addFriend: function(friend) {
    if (this.rooms.indexOf(friend) === -1) {
      this.friends.push(friend);
    }
  },

  clickEventHandler: function() {
    $("#chats li a").on("click", function() {
      console.log("clickity");
      console.log(this);
      app.addFriend($(this).html());
    });
  }

};


$(document).ready(function(){

  // setInterval(function(){


  setInterval(function(){app.fetch('https://api.parse.com/1/classes/chatterbox')}, 2000);
});



