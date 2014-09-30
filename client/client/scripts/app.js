// YOUR CODE HERE:
  var app = {
    init: function() {
      app.handleSubmit();
      // // test();
      // setInterval.call()
      app.currentRoom = 'lobby';
      app.rooms = [];
      app.friends = [];
      app.data = [];
      app.roomsLength = 0;
      setInterval(function() {
        while (app.roomsLength < app.rooms.length) {
          // debugger;
          app.addRoom(app.rooms[app.roomsLength]);
          app.roomsLength++;
        }
        app.fetch();
      }, 1000);
      app.mode = "TEST";
      app.mode = "GO";
    },
    send: function(message) {
      // debugger;
      if(app.mode !== "TEST") {
        $.ajax({
          type: 'POST',
          url: 'http://127.0.0.1:3000/classes/messages',
          data: JSON.stringify(message),
          contentType: 'application/jsonp',
          success: app.addMessage(message)
          // dataType: jsonp
        });
      } else {
        app.addMessage(message);
      }
    },
    fetch: function() {
      $.ajax({
        url: 'http://127.0.0.1:3000/classes/messages',
        success: app.handleData,
        data: {'order': '-createdAt'}
      });
    },
    clearMessages: function() {
      $('#chats').empty();
    },
    addMessage: function(message) {
      var user = _.escape(message.username);
      var msg = _.escape(message.text);
      var room = _.escape(message.roomname);
      if (app.rooms.indexOf(room) === -1) {
        app.rooms.push(room);
      }
      if (room === app.currentRoom || app.currentRoom === 'lobby') {
        var userSpan = "<div";
        if (app.friends.indexOf(user) !== -1) {
          userSpan += " class ='friend'"
        }
        userSpan += "><span class='username'>" + user + "</span>: ";
        var msgSpan = "<span class='msg'>"+msg+"</span>";

        $('#chats').append(userSpan+msgSpan+"</div>");
      }
      // this.send(message); s
      $('.username').click(function() {
        // console.log('clicked');
        app.addFriend($(this).text());
      });
    },
    addRoom: function(room) {
      $('#roomSelect').append("<div class='room'>"+room+"</div>");
      $('.room').on('click', function() {
        app.currentRoom = $(this).text();
      });
    },
    addFriend: function(friend) {
      if (app.friends.indexOf(friend) === -1) {
        app.friends.push(friend);
      }
    },
    handleSubmit: function() {
      $('#send').click(function() {
        // console.log("submitted");
        var name = document.getElementById('nameField');
        var inputMessage = document.getElementById('inputField');
        var room = document.getElementById('roomField');
        // debugger;
        app.send({
          username: name.value,
          text: inputMessage.value,
          roomname: room.value
        });
      });
    },
    handleData: function(data) {
      $('#chats').empty();
      if(data.results !== app.data) {
        for (var i = data.results.length - 1; i >= 0; i--) {
          app.addMessage(data.results[i]);
        }
        $('#chats').scrollTop($('#chats')[0].scrollHeight);
        // debugger;
        app.data = data.results.splice(0);
      }
    }
  };



$(document).ready(function() {
  app.init();
})




// var message = 'THIS IS WRONG!';
