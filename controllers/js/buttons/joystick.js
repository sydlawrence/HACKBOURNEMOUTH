// dpad.js

var Joystick = function(options) {

	_.extend(this, new CoreButton(options));

	this.defaults = {
		size: 100,
		handlers: {
			move: function() {
				console.log("move");
			},
			click: function() {
				alert("click");
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
		button.onclick = function() {
			that.settings.handlers.click();
		};

		console.log("hello");


		(function() {
			var startPos = {x:0,y:0};
			var moving = false;

			var buttonSize;
			button.addEventListener("touchstart", function(e) {
				buttonSize = button.clientWidth;
				startPos.x = e.screenX;
				startPos.y = e.screenY;
				moving = true;
			}, false);


			button.addEventListener("touchmove", function(e) {
				if (!moving) {
					return;
				}
				var difPos = {
					x: e.screenX - startPos.x,
					y: e.screenY - startPos.y
				};

				console.log(difPos);
				console.log(buttonSize);
				console.log(parseInt(buttonSize / 2, 10) + parseInt(difPos.y, 10) + "px");

				var top = (parseInt(buttonSize / 2, 10) + difPos.y);
				var left = (parseInt(buttonSize / 2, 10) + difPos.x);
				if (top < 0) top = 0;
				if (left < 0) left = 0;

				if (top > buttonSize) top = buttonSize;
				if (left > buttonSize) left = buttonSize;


				button.style.top = top + "px";
				button.style.left = left + "px";
			}, false);

			button.addEventListener("touchend", function(e) {
				moving = false;
				button.style.top = parseInt(buttonSize / 2, 10) + "px";
				button.style.left = parseInt(buttonSize / 2, 10) + "px";
			}, false);
		})();

		


		container.appendChild(button);
	
		return container;
	};

};