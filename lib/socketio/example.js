var exampleIO;

module.exports = function(io) {
	// namespace socket.io event listeners
	exampleIO = io.of('/example');
	exampleIO.on('connection', onConnection);
}

function onConnection(socket) {
	console.log('example socket connected');

	exampleIO.emit('Hello', { foo: 'bar'});

	exampleIO.on('disconnect', onDisconnect);
	exampleIO.on('message', onMessage);

	function onDisconnect() {
		console.log('example socket disconnected');
	}

	function onMessage(from, message) {
		console.log('Message, from: ' + from);
		console.log(message);
	}
}