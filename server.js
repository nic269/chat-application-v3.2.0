// Import all our dependencies
var express = require('express'),
	app = express(),
	http = require('http'),
	server = http.Server(app),
	session = require('express-session'),
	body_parser = require('body-parser'),
	io = require('socket.io')(server),
	colors = require('colors'); // This module to change color console.log

// set theme colors
colors.setTheme({
  silly: 'rainbow',
  input: 'grey',
  verbose: 'cyan',
  prompt: 'grey',
  info: 'green',
  data: 'grey',
  help: 'blue',
  warn: 'yellow',
  debug: 'cyan',
  error: 'red'
});

// Customization
var app_port = process.env.PORT || 7000; // Default server connect to port 7000
var session_middleware = session({
	secret: '#@chatApplication-secret$#',
	resave: false,
	saveUninitialized: false
});

var online_users = [];

// Tell express where is serve static files
app.use(express.static(__dirname + '/public'));

// Use body-parser to read request body
app.use(body_parser.json());
app.use(body_parser.urlencoded({ extended: true }));

// Define session for App and Socket.io
app.use(session_middleware);
io.use(function(socket, next) {
	session_middleware(socket.request, socket.request.res, next);
});

// ================= Mongodb ================= \\
// Import mongoose for using mongodb
var mongoose = require('mongoose');

// Define database name and collection of mongodb for chat application
// Create schema for chat application
var db_name = 'chat-app-v320';
var users_collection = 'Users',
	user_schema = mongoose.Schema({
		user_name: String,
		password: String,
		avatar_img: String
		//status: { type: Number, default: 0 }
	});
var entries_collection = 'Entries',
	entry_schema = mongoose.Schema({
		sender: String,
		avatar_img: String,
		msg: String,
		room_name: String,
		created: Date
	});
var rooms_collection = 'Rooms',
	room_schema = mongoose.Schema({
		name: String,
		creator: String,
		max_member: Number,
		member: Array
	});


// Connect mongodb to server
mongoose.connect('mongodb://localhost:27017/' + db_name);

// Create a Model from the chat_schema
var users = mongoose.model(users_collection, user_schema);
var entries = mongoose.model(entries_collection, entry_schema);
var rooms = mongoose.model(rooms_collection, room_schema);

// Allow CORS
app.all('*', function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
	res.header('Access-Control-Allow-Headers', 'Content-type,Accept,X-Access-Token,X-Key');
	
	if (req.method == 'OPTIONS') {
		res.status(200).end();
	} else {
		next();
	}
});

// ================= ROUTES ================= \\
app.get('/', function(req, res) {
	var sess = req.session;

	if(!sess.user_name) {
		res.sendFile(__dirname + '/index.html');
	} else {
		res.redirect('/chat');
	}
});

app.get('/chat', function(req, res) {
	var sess = req.session;

	if (!sess.user_name) res.redirect('/');

	res.sendFile(__dirname + '/chat.html');
});

app.get('/online-user', function(req, res) {
	var user_name, avatar_img;
	var data = [];
	var tmp = {};

	for (var key in online_users) {
		tmp = {
			user_name: key,
			avatar_img: online_users[key][0]
		};
		data.push(tmp);
	}

	res.send(data);
});

app.get('/chat-history', function(req, res) {
	console.log("Received a GET request all item in collection: " + entries_collection);
	entries
		.find({room_name: req.query.name})
		.sort({'created': -1})
		.limit(10)
		.exec(function(err, docs) {
			res.send(docs);
		});
});

app.get('/room', function(req, res) {
	console.log("Received a GET request all item in collection: " + rooms_collection);
	rooms.find(function(err, docs) {
		if (err) {
			console.log("get Room List error: " + err);
		} else {
			res.send(docs);
		}
	});
});

app.post('/room', function(req, res) {
	var data = req.body.data;

	rooms.find({name: data.name}, function(err, docs) {
		if (docs.length) {
			res.send('Room\'s name are already exists');
		} else {
			var room = new rooms(data);
			room.save(function(err, roomSaved) {
				if (err) {
					res.send(err);
				} else {
					console.log(colors.debug(roomSaved + ' has been saved to database'));
					reloadRoomList();
					res.send('done');
				}
			});
		}
	});
});

app.put('/room/:id', function(req, res) {
	var id = req.params.id;
	console.log('Received an UPDATE request for _id: ' + id);
	rooms.update({_id: id}, req.body, function() {
		res.send(req.body);
	});
});

app.delete('/room/:id', function(req, res) {
	var id = req.params.id;
	console.log('Received an DELETE request for _id: ' + id);
	rooms.find({_id: id}, function(err, docs) {
		//Remove entries in this room
		entries.find({room_name: docs[0].name}).remove().exec();
	}).then(function() {
		//Remove room from collection
		rooms.remove({_id: id}, function(err, docs) {
			res.send({_id: id});
		});
	});
});

app.post('/signup', function(req, res) {
	var user_name = req.body.user_name,
		password = req.body.password,
		re_password = req.body.re_password,
		avatar = req.body.avatar;

	var data = {
		user_name: user_name,
		password: password,
		avatar_img: avatar
	};

	users.find({user_name: user_name}, function(err, docs) {
		if (docs.length) {
			res.send('user name are exists');
		} else {
			var user = new users(data);
			user.save(function(err, userSaved) {
				if (err) {
					res.send(err);
				} else {
					console.log(colors.debug(userSaved + ' has been saved to database'));
					res.send('done');
				}
			});
		}
	});

	
	// console.log('user: ' + user_name + ' pass: ' + password + ' re-pass: ' + re_password + ' avatar: ' + avatar);
});

app.post('/login', function(req, res) {
	var sess = req.session;
	var user_name = req.body.user_name,
		password = req.body.password;

	if (sess.user_name) {
		res.send('you are already logedin');
	} else {
		users.find({user_name: user_name}, function(err, docs) {
			if (!docs.length) {
				res.send('user name doesn\'t exists ');
			} else if (docs[0].password != password) {
				res.send('wrong password');
			} else {
				sess.user_name = docs[0].user_name;
				sess.avatar_img = docs[0].avatar_img;

				res.send('done');
			}
		});
	}
});

app.get('/login', function(req, res) {
	var sess = req.session;

	if (sess.user_name) res.redirect('/');

	res.sendFile(__dirname + '/login.html');
});

app.get('/logout', function(req, res) {
	var sess = req.session;
	if (sess.user_name) {
		sess.destroy();
		res.send({ status: 'done', user_name: sess.user_name});
	} else {
		res.send('done');
	}
});

app.get('/setup-db', function(req, res) {
	res.writeHead(200, { "Content-Type": "text/plain" });
	var data = [{
		sender: 'Nic',
		avatar_img: 'images/avatar/1.jpg',
		msg: 'Hi, Everybody!!!',
		room_name: 'world',
		created: new Date()
	}, {
		sender: 'Admin',
		avatar_img: 'images/avatar/2.jpg',
		msg: 'I\'m Admin',
		room_name: 'world',
		created: new Date()
	}, {
		sender: 'Admin',
		avatar_img: 'images/avatar/2.jpg',
		msg: 'Hi all',
		room_name: 'world',
		created: new Date()
	}];

	data.forEach(function(item) {
		var entry = new entries(item);
		entry.save(function(err, entrySaved) {
			console.log(colors.debug(entrySaved + ' has been saved to database'));
		});
	});

	res.end('done');

});

// ================= SOCKET.IO ================= \\
io.sockets.on('connection', function(socket) {
	console.log(socket.id + ' has connected');
	socket.sess = socket.request.session;
	socket.user_name = socket.sess.user_name;
	socket.avatar_img = socket.sess.avatar_img;

	if (socket.user_name) { // check session user_name (if not, user haven't login yet)
		if(!online_users[socket.user_name]) {
			online_users[socket.user_name] = [];
			online_users[socket.user_name].unshift(socket.avatar_img);
			online_users[socket.user_name].push(socket.id);
			//notify user join to world chat, because default room chat is 'world'
			reloadNotice(socket, 'join', 'world');

			console.log('user name: ' + socket.user_name + ' join with avatar: ' + online_users[socket.user_name][0]);
		} else {
			online_users[socket.user_name].push(socket.id);
		}

		reloadOnlineList();
		reloadRoomList();

		socket.emit('setClientInfo', {user_name: socket.user_name, avatar_img: socket.avatar_img});
	}

	socket.on('onDisconnect', function(user_name) {
		if ((user_name == socket.user_name) && (user_name in online_users)) { //check exist user_name and user_name exist in online_users
			delete online_users[socket.user_name];
			reloadOnlineList();
			//notify user left to world chat, because default room chat is 'world'
			reloadNotice(socket, 'left', 'world');

			socket.user_name = '';
			socket.avatar_img = '';
			socket.room_joined = '';
			
			socket.emit('onDisconnect', 'done');

		}
	});

	socket.on('newMessage', function(data) {
		if (socket.user_name) {
			data = {
				sender: socket.user_name,
				avatar_img: socket.avatar_img,
				msg: data.msg,
				room_name: data.room_name,
				created: new Date().toISOString()
			};

			io.emit('newMessage', data);

			var entry = new entries(data);
			entry.save(function(err, entrySaved) {
				console.log(colors.debug(entrySaved + ' has been saved to database'));
			});

			console.log(colors.debug(socket.user_name + ' said: ' + data.msg));
		}
	});

	socket.on('changeToDefaultRoom', function(old_room) {
		io.emit('changeToDefaultRoom', old_room);
	});

	socket.on('reloadRoomList', function() {
		reloadRoomList();
	});

	socket.on('Notice', function(data) {
		reloadNotice(socket, data.type, data.room_name);
	});
});

function reloadNotice(socket, type, room_name) {
	if (type === 'join') {
		io.emit('Notice', {user_name: socket.user_name, type: 'join', room_name: room_name});
	} else if (type === 'left') {
		io.emit('Notice', {user_name: socket.user_name, type: 'left', room_name: room_name});
	}
}

function reloadOnlineList() {
	io.emit('reloadOnlineList');
}

function reloadRoomList() {
	io.emit('reloadRoomList');
}

// Server running and listening app_port
server.listen(app_port, function() {
	console.log(colors.info('Server listening on port: %s'), app_port);
});