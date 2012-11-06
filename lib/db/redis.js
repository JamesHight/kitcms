/** 
 * Use Redis as a key/value store.
 *
 * example config:
 * db: {
 *		type: 'redis',
 *		server: 'localhost',
 *		port: 6379,
 *		number: 0, // Which Redis database to use 
 *		user: 'bob',
 *		password: 'foo'
 * }
 **/

var redis = require('redis'),
    config = require('../../config');

function RedisAdapter() {
	var self = this;

	this.changeChannel = 'kitcms_change';

	// Create Redis clients
	this.client = redis.createClient(config.db.port || 6379, config.db.address || 'localhost', config.db.options);
	this.subClient = redis.createClient(config.db.port || 6379, config.db.address || 'localhost', config.db.options);
	
	// Set auth credentials if present
	if (config.user)
		this.client.auth(config.user, config.password);

	// Select a db other than the default 0
	if (config.db.number)
		this.client.select(config.db.number);

	// Subscribe to document changes
	this.subClient.subscribe(this.changeChannel);

	this.subClient.on("message", function (channel, message) {
		self.onMessage(channel, message);
	});

	// Catch general errors
	this.client.on('error', function (err) {
	    self.onError(err);
	});

	this.subClient.on('error', function (err) {
	    self.onError(err);
	});

	return this;
}

/* Retrieve a document */

RedisAdapter.prototype.get = function(key, cb) {
	this.client.get(key, function(err, value) {
		var doc = null;

		if (err)
			return cb(err);

		if (value) {
			try {
				doc = JSON.parse(value);
			}
			catch(e) {
				return cb(new Error('Redis: Invalid JSON data format for key ' + key));
			}
		}
		cb(null, doc);
	});
}

/* Update or add a document */

RedisAdapter.prototype.set = function(key, doc, cb) {
	var self = this,
		value = JSON.stringify(doc);

	this.client.set(key, value, function(err) {
		self.notifyChange(key);
		if (cb)
			cb(err);
	});
}


/* Remove a document */

RedisAdapter.prototype.unset = function(key, cb) {	
	var self = this;
	this.client.del(key, function(err) {
		self.notifyChange(key);
		if (cb)
			cb(err);
	});
}

/* Get a list of all stored document keys */

RedisAdapter.prototype.keys = function(cb) {	
	this.client.keys('*', cb);
}

/* Publish a message to Redis, alerting listeners of a change to a template */

RedisAdapter.prototype.notifyChange = function(key) {
	this.client.publish(this.changeChannel, key);
};

/* Handle change messages from Redis, pass them to the onChange */

RedisAdapter.prototype.onMessage = function(channel, message) {
	if (channel == this.changeChannel)
		this.onChange(message);
};

RedisAdapter.prototype.onChange = function(key) {

};

RedisAdapter.prototype.onError = function(err) {
	console.log('Redis Error: ' + err);
};

module.exports = RedisAdapter;