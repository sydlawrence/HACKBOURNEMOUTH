var GamepadJoyJoy = (function() {
  
  function GamepadJoyJoy() {
    this.gamepads = {};
    this.count = 0;
    
    var that = this;
    if (window.location.host == 'dev.wemakeawesomesh.it:5000') {
			host = 'http://dev.wemakeawesomesh.it:5000';
		} else {
			host = 'http://10.0.2.74';
		}
    console.log('Requesting controller bridge');
		$.get('/handshake', function(data) {
			console.log('Connecting to viewer channel /' + data + '-viewer');
			that.socket = io.connect(host + '/' + data + '-viewer');
			that.initSocketEvents();
		}).error(function(xhr, status, error) {
			console.log('An AJAX error occured: ' + status + ', of type: ' + error);
			console.log('Error text: ' + xhr.responseText);
		});
  }
  
  GamepadJoyJoy.prototype.initSocketEvents = function() {
    console.log('initing socket events');
    var that = this;
    
    this.socket.on("message", function (data) {   
      if (data.type === "controllerConnected") {
        var gamepad = new Gamepad(data.id, that);
        that.gamepads[data.id] = gamepad;
        that.trigger('controllerConnected', gamepad);
      }
      if (data.type === "controllerDisconnected") {
         var gamepad = that.gamepads[data.id];
         delete that.gamepads[data.id];
         that.trigger('controllerDisconnected', gamepad);
      }
      if (data.type === "controlPress") {
          var gamepad = that.gamepads[data.id];
          gamepad.buttonChange(data.button, data.state);
      }
      
    });

  }

  var Gamepad = (function() {

    function Gamepad(id, parent) {
      this.id = id;
      this.parent = parent;
      this.state = {};
    }
    
    Gamepad.prototype.buttonChange = function(buttonID, state) {      
      var button = this.buttons[buttonID]
  
      this.trigger(buttonID, state);
      this.parent.trigger('buttonChange', {button: buttonID, state: state});

      this.state[buttonID] = state;
    }
    
    Gamepad.prototype.setLayout = function(buttons, backgroundImage) {
      this.buttons = buttons;
      this.state = {};
      
      this.parent.socket.emit('message', {type: 'layout', layout: layout});

      var defaults = {
        button: false,
        dpad: {up: false, down: false, left: false, right: false},
        joy: {x: 0, y: 0}
      };
      for (var i=0; i < buttons.length; i++) {
        this.state[i] = defaults[buttons[i].type];
      };
      
    }

    return Gamepad;
  })();
  _.extend(Gamepad.prototype, Backbone.Events);

  return GamepadJoyJoy;
})();


_.extend(GamepadJoyJoy.prototype, Backbone.Events);