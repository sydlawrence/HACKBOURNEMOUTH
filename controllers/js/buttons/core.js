// core.js





var CoreButton = function(options) {
	this.setup(options);	
};

CoreButton.prototype.setup = function(options) {
	if (options === undefined) {
		options = {};
	}
	this.settings = _.clone(this.defaults);
	_.extend(this.settings, options);
	this.settings.handlers.self = this.settings;
	console.log(this.settings);
	_.extend(this, Backbone.Events);
};

CoreButton.prototype.defaults = {
	size: 100,
	color: "#00f",
	x:0,
	y:0,
	handlers: {
		touchstart: function(id) {
			console.log(this);
			Gamepad.sendState(id, true);
		},
		touchend: function(id) {
			Gamepad.sendState(id, false);
		}
	},
	id: ""
};

CoreButton.prototype._toString = function() {
	return this.build();
};

CoreButton.prototype.position = function(element) {
	element.style.top = this.settings.y + "px";
	element.style.left = this.settings.x + "px";
	element.style.position = "absolute";
}

CoreButton.prototype.build = function() {
		var button = document.createElement("button");
		button.style.backgroundColor = this.settings.color;
		button.className = "button";
		button.style.width = this.settings.size+"px";
		button.style.height = this.settings.size+"px";
		var that = this;
		button.addEventListener("touchstart",function() {
			that.settings.handlers.touchstart(that.settings.id);
		}, false);

		button.addEventListener("touchend",function() {
			that.settings.handlers.touchend(that.settings.id);
		}, false);
		this.position(button);

		return button;
};