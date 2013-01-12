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
	_.extend(this, Backbone.Events);
}

CoreButton.prototype.defaults = {
	size: 100,
	handlers: {
		click: function() {
			alert("click");
		}
	}
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
		button.onclick = function() {
			that.settings.handlers.click();
		};

		return button;
};