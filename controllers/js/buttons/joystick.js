// dpad.js

var Joystick = function(options) {

	_.extend(this, new CoreButton(options));

	this.defaults = {
		size: 100,
		handlers: {
			move: function(id, axis) {
				Gamepad.sendState(id, axis);
			}
		}
	};

	this.setup(options);

	_.extend(options, this.defaults);
	this.settings = options;


	this.build = function() {

		var that = this;



		var container = document.createElement("div");
		container.className = "joystick";
		container.style.width = this.settings.size+"px";
		container.style.height = this.settings.size+"px";


		var button = document.createElement("div");
		button.className = "joystick-knob";

		(function() {
			var startPos = {x:0,y:0};
			var moving = false;

			var buttonSize;
			button.addEventListener("touchstart", function(e) {
				buttonSize = button.clientWidth;
				startPos.x = e.touches[0].screenX;
				startPos.y = e.touches[0].screenY;
				moving = true;
			}, false);


			button.addEventListener("touchmove", function(e) {
				if (!moving) {
					return;
				}
				var difPos = {
					x: e.touches[0].screenX - startPos.x,
					y: e.touches[0].screenY - startPos.y
				};

				var top = (parseInt(buttonSize / 2, 10) + difPos.y);
				var left = (parseInt(buttonSize / 2, 10) + difPos.x);

				if (top < 0) top = 0;
				if (left < 0) left = 0;

				if (top > buttonSize) top = buttonSize;
				if (left > buttonSize) left = buttonSize;

				top += buttonSize/2;
				left += buttonSize/2;


				var axis = {
					x:(left / (buttonSize/2)) - 2,
					y:(top / (buttonSize/2)) - 2
				};
				that.settings.handlers.move(that.settings.id, axis);

				button.style.top = top + "px";
				button.style.left = left + "px";
			}, false);

			button.addEventListener("touchend", function(e) {
				moving = false;
				button.style.top = buttonSize + "px";
				button.style.left = buttonSize + "px";

				that.settings.handlers.move(that.settings.id, {x:0, y:0});

			}, false);
		})();

		


		container.appendChild(button);
	
		return container;
	};

};