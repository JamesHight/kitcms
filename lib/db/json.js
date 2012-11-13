/* Simple JSON based key/value file store.
 * Changes are saved every 3 seconds 
 *
 * onChange event only fires for the current process
 * If you need to run more than 1 process, use the Redis adapter
 *
 * example config:
 * db: {
 *		type: 'json', 
 * 		file: 'documents.json',  // file used to store JSON in data directory
 *		flush: 3000  // Time (in milliseconds) between writing changes to disk
 * }
 */

var fs = require('fs'),
	config = require('../../config');

function JsonAdapter() {	
	this.init();

	return this;
}

JsonAdapter.prototype.init = function() {
	this.file = __dirname + '/../../data/' + (config.db.file || 'documents.json');

	// data takes the form of this.data[namespace][name] 
	// where key = namespace + '&' + name
	this.data = null;
	this.queue = [];
	this.dirty = false;
	this.load(function(err) {
		if (err)
			throw err;
	});
};

/**
 * Load data from JSON file
 **/

JsonAdapter.prototype.load = function(cb) {
	var self = this;

	fs.exists(this.file, function(exists) {		
		if (!exists) {
			self.data = {};
			return self.processQueue();
		}

		fs.readFile(self.file, 'utf8', function(err, data) {
			if (err)
				cb(err);
			
			try {
				data = JSON.parse(data);
			}
			catch(e) {
				cb(e);
			}

			self.data = data;
			self.processQueue();
			cb();
		});
	});
};

/**
 * Save data to JSON file
 **/

JsonAdapter.prototype.save = function(cb) {
	
	if (!this.data) {
		this.queue.push({
			func: 'save',
			args: arguments
		});
		return;
	}

	fs.writeFile(this.file, JSON.stringify(this.data), 'utf8', cb);
};

/**
 * Run through queue, processing delayed db calls
 **/

JsonAdapter.prototype.processQueue = function() {
	var self = this;

	if (!this.data)
		throw new Error('JSON data still not loaded');

	this.queue.forEach(function(item) {
		self[item.func].apply(self, item.args);
	});

	this.queue = [];
};

/**
 * Flag data as changed and needing to be saved
 **/

JsonAdapter.prototype.setDirty = function() {
	var self = this;

	if (this.dirty)
		return;

	this.dirty = true;

	setTimeout(function() {
		// clear dirty flag before save in case there are 
		// additional changes made during save
		self.dirty = false;
		self.save(function(err) {
			if (err) 
				throw err;
		});
	}, config.db.flush || 3000);
};


JsonAdapter.prototype.get = function(key, cb) {
	var namespace, name;

	if (!this.data) {
		this.queue.push({
			func: 'get',
			args: arguments
		});
		return;
	}

	name = key.split('&');
	namespace = name[0];
	name = name[1];

	if (this.data[namespace] && this.data[namespace][name])
		return cb(null, this.data[namespace][name]);

	cb(null, null);
};


JsonAdapter.prototype.set = function(key, value, cb) {
	var namespace, name;

	if (!this.data) {
		this.queue.push({
			func: 'set',
			args: arguments
		});
		return;
	}

	name = key.split('&');
	namespace = name[0];
	name = name[1];

	if (!this.data[namespace])
		this.data[namespace] = {};

	this.data[namespace][name] = value;
	this.setDirty();
	this.onChange(key);

	if(cb)
		cb();
};


JsonAdapter.prototype.unset = function(key, cb) {
	var namespace, name;

	if (!this.data) {
		this.queue.push({
			func: 'unset',
			args: arguments
		});
		return;
	}

	name = key.split('&');
	namespace = name[0];
	name = name[1];

	if (this.data[key]) {
		delete this.data[key];
		this.setDirty();
		this.onChange(key);
	}	

	
	if (this.data[namespace] && this.data[namespace][name])
		delete this.data[namespace][name];

	if (cb)
		cb();
}


JsonAdapter.prototype.keys = function(namespace, cb) {
	if (!this.data) {
		this.queue.push({
			func: 'keys',
			args: arguments
		});
		return;
	}
	
	if(!this.data[namespace])
		return cb(null, []);

	cb(null, Object.keys(this.data[namespace]));
};

JsonAdapter.prototype.onChange = function(key) {

};

module.exports = JsonAdapter;