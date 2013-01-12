var host = '';

if (window.location.host == 'productionhost.com') {
	host = 'http://productionhost.com';
} else {
	host = 'http://localhost';
}

// Look for games on the same IP
console.log('Requesting conroller bridge');
$.getJSON('/games', function(data) {
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
	var socket = io.connect(host + '/' + game.id + '-controller');
	initSocketEvents(socket);
}).error(function(xhr, status, error) {
	console.log('An AJAX error occured: ' + status + ', of type: ' + error);
	console.log('Error text: ' + xhr.responseText);
});

function initSocketEvents(socket) {
	socket.on('connect', function() {
		console.log('Connected to controller channel ' + socket.name);
	});
}