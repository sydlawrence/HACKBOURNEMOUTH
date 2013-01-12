// TODO
// - Assign controllers to players
// - Transmit control system from viewer
// - Attach to controller input events

var util = require('util');

var UUID = require('node-uuid');
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

var clientsByIp = {};
var gamesByIp = {};

var init = function() {
	initExpress();
};

var initExpress = function() {
	server.listen(process.env.PORT || 5000);

	app.configure(function(){
		app.use(express.methodOverride());
		app.use(express.bodyParser());
		app.use(express.static(__dirname + '/public'));
		app.use(express.errorHandler({
			dumpExceptions: true,
			showStack: true
		}));
	});

	app.get('/', function(req, res) {
		res.sendfile(__dirname + '/index.html');
	});

	app.get('/handshake', function(req, res) {
		var gameIp = req.ip;

		if (req.headers['x-forwarded-for']) {
			util.log('Forwarded IP: ' + req.headers['x-forwarded-for']);
			gameIp = req.headers['x-forwarded-for'];
		}

		// Set unique game id
		var gameId = UUID();

		// Set up new game
		var game = new Game(gameId, io);
		game.init();

		if (!gamesByIp[gameIp]) {
			gamesByIp[gameIp] = [];
		}

		// Add new game for IP
		gamesByIp[gameIp].push(game);

		res.send(game.id);
	});

	app.get('/games', function(req, res) {
		var controllerIp = req.ip;
		util.log("controller attempting to connect: "+controllerIp);

		if (req.headers['x-forwarded-for']) {
			util.log('Forwarded IP: ' + req.headers['x-forwarded-for']);
			controllerIp = req.headers['x-forwarded-for'];
		}

		var games = findGamesByIp(controllerIp);
		res.send(JSON.stringify({games: games}));
	});
};

var findGamesByIp = function(ip) {
	if (gamesByIp[ip]) {
		var games = [];
		var i = gamesByIp[ip].length;
		
		while (i--) {
			var game = gamesByIp[ip][i];
			games.push({
				id: game.id
			});
		}

		return games;
	}

	return false;
};

var Game = function(id, io) {
	this.id = id;
	this.controllers = [];
	this.io = io;

	this.init = function() {
		this.initSocketEvents();
	};

	this.initSocketEvents = function() {
		util.log('Setting up viewer connection on channel /' + this.id);
		var viewers = this.io.of('/' + this.id + '-viewer');

		viewers.on('connection', function (socket) {
			var viewerIp = socket.handshake.address.address;

			// Viewer has connected
			util.log('Viewer connected from IP ' + viewerIp);

			socket.on('disconnect', function (socket) {
				// Viewer has disconnected
				util.log('Viewer disconnected');
			});

			socket.on('message', function(data) {
				data.id = socket.id;
				controllers.emit('message', data);
			});
		});

		util.log('Setting up controller connection on channel /' + this.id);
		var controllers = this.io.of('/' + this.id + '-controller');

		controllers.on('connection', function (socket) {
			var controllerIp = socket.handshake.address.address;

			// Controller has connected
			util.log('Controller connected from IP ' + controllerIp);
			viewers.emit('message', {type: 'controllerConnected', id: socket.id});

			socket.on('disconnect', function (socket) {
				// Controller has disconnected
				util.log('Controller disconnected');
				viewers.emit('message', {type: 'controllerDisconnected', id: socket.id});
			});

			socket.on('message', function(data) {
				data.id = socket.id;
				viewers.emit('message', data);
			});
		});
	};
};

init();