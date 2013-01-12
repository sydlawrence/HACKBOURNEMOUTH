var GamepadJoyJoy = (function() {
  
  function GamepadJoyJoy() {
    this.gamepads = {};

    this.socket = io.connect('http://localhost');

    socket.on('controllerConnected', function (id) {
      console.log(id);
      var gamepad = new Gamepad(id, this);
      this.trigger('controllerConnected', gamepad);
    });

    socket.on('controllerDisconnected', function (id) {
      console.log(id);
      var gamepad = gamepads[id];
      delete gamepads[id];
      this.trigger('controllerDisconnected', gamepad);
    });
    
    socket.on('buttonChange', function (data) {
      var gamepad = gamepads[data.id];
      gamepad.buttonChange(data.buttonID, data.state);
    });

  }
  
  GamepadJoyJoy.prototype.simulateActivity = function() {
    var gamepad1 = new Gamepad();
    this.trigger('controllerConnected', gamepad1);
    
    var gamepad2 = new Gamepad();
    this.trigger('controllerConnected', gamepad2);

    var that = this;
    setTimeout(function() {
      that.trigger('controllerDisconnected', gamepad1);
    }, 100);
    setTimeout(function() {
      that.trigger('controllerDisconnected', gamepad2);
    }, 200);
  }

  var Gamepad = (function() {

    function Gamepad(id, parent) {
      this.id = id;
      this.parent = parent;
      this.state = {};
    }
    
    Gamepad.prototype.buttonChange = function(buttonID, state) {      
      var button = this.buttons[buttonID]
  
      gamepad.trigger(data.buttonID, state);
      parent.trigger('buttonChange', {button: buttonID, state: state});

      this.state[buttonID] = state;
    }
    
    Gamepad.prototype.setLayout = function(buttons, backgroundImage) {
      this.buttons = buttons;
      this.state = {};
      this.parent.socket.send('layout', layout);

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