// core.js





var CoreButton = function(options) {
	this.setup(options);	
};

CoreButton.prototype.setup = function(options) {
	if (options === undefined) {
		options = {};
	}
	this.settings = this.defaults;
	_.extend(this.settings, options);
	this.settings.handlers.self = this.settings;
	_.extend(this, Backbone.Events);
}

CoreButton.prototype.defaults = {
	size: 100,
	handlers: {
		touchstart: function() {
			console.log(this);
			Gamepad.sendState(this.self.id, true);
		},
		touchend: function() {
			Gamepad.sendState(this.self.id, false);
		}
	},
	id: ""
};

CoreButton.prototype._toString = function() {
	return this.build();
};

CoreButton.prototype.build = function() {
		var button = document.createElement("button");
		button.className = "button";
		button.style.width = this.settings.size+"px";
		button.style.height = this.settings.size+"px";
		var that = this;
		button.addEventListener("touchstart",function() {
			that.settings.handlers.touchstart();
		}, false);

		button.addEventListener("touchend",function() {
			that.settings.handlers.touchend();
		}, false);

		return button;
};