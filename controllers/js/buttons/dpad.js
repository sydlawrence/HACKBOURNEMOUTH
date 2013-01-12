// dpad.js

var Dpad = function(options) {

	_.extend(this, new CoreButton(options));
	this.defaults = {
		size: 100,
		handlers: {
			up: function() {
				alert("top");
			},
			right: function() {
				alert("right");
			},
			down: function() {
				alert("bottom");
			},
			left: function() {
				alert("left");
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
				obj.onclick = function() {
					that.settings.handlers[dir]();
				};
				container.appendChild(obj);
			})(buttons[dir]);
		}

		return container;
	};

};