
var Gamepad = {
	id: undefined,
	controlsEl: "controls",
	controls: [],
	sendState: function(button, state) {
		console.log("button change: "+button);
		console.log(state);
		socket.emit("message", {
			type: "controlPress",
			button:button,
			state:state
		});
	},
	setLayout: function(layout) {
		if (!layout) return;

		for (var id in layout) {
			var control;
			(function(id, layout) {
				var item = layout[id];
				item.id = id;

				switch (item.type) {
					case "button":
						control = new CoreButton(item);
						break;
					case "dpad":
						control = new Dpad(item);
						break;
					case "joy":
						control = new Joystick(item);
						break;
				}

				Gamepad.controls.push(control);
				document.getElementById(Gamepad.controlsEl).appendChild(control.build());
			})(id, layout);
		}
	}
}