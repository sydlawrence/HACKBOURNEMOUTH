// dpad.js

var Dpad = function(options) {

	var state = {
		up:0,
		right:0,
		down:0,
		left:0,
		centre:0
	};

	_.extend(this, new CoreButton(options));
	this.defaults = {
		size: 100,
		handlers: {
			stateChange: function(id) {
				Gamepad.sendState(id, state);
			}
		}
	};
	this.setup(options);

	this.build = function() {

		var that = this;

		var container = document.createElement("div");
		container.className = "dpad";
		container.style.width = this.settings.size+"px";
		container.style.height = this.settings.size+"px";

		var buttons = ["up", "right", "down", "left", "centre"];
		for (var dir in buttons) {
			(function(dir){
				var obj = document.createElement("button");
				obj.className = "dpad-"+dir;

				obj.addEventListener("touchstart",function() {
					state[dir] = 1;
					that.settings.handlers.stateChange(that.settings.id);
				}, false);

				obj.addEventListener("touchend",function() {
					state[dir] = 0;
					that.settings.handlers.stateChange(that.settings.id);
				}, false);

				container.appendChild(obj);
			})(buttons[dir]);
		}

		return container;
	};

};