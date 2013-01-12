var host = '';

if (window.location.host == 'dev.wemakeawesomesh.it:5000') {
	host = 'http://dev.wemakeawesomesh.it:5000';
} else {
	host = 'http://10.0.2.101:5000';
}

var socket;

// Look for games on the same IP
console.log('Requesting conroller bridge');
$.getJSON(host+'/games', function(data) {
	var games = data.games;

	if (games.length === 0) {
		console.log('No games found');
		return;
	}

	console.log(games.length + ' games found');

	// Loop through each game
	// $.each(games, function(key, val) {
	// 	console.log(key, val);
	// });

	

	// For now, assume there is only one game
	var game = games[0];

	// Connect to controller channel for game
	console.log('Connecting to controller channel /' + game.id + '-controller');
	socket = io.connect(host + '/' + game.id + '-controller');
	initSocketEvents(socket);


	socket.on("message", function (data) {
		alert("received message");
		if (Gamepad.id === undefined) {
			Gamepad.id = data.id;
		} else if (Gamepad.id !== data.id) {
			return;
		}
		if (data.type === "layout")
			Gamepad.setLayout(data.layout);
	});


}).error(function(xhr, status, error) {
	console.log('An AJAX error occured: ' + status + ', of type: ' + error);
	console.log('Error text: ' + xhr.responseText);
});

function initSocketEvents(socket) {
	socket.on('connect', function() {
		console.log('Connected to controller channel ' + socket.name);
	});
}
