$(function() {
	var cache = {}, // cache for documents loaded from server
		changed = false, // flag if current document has changed
		busy = false, // flag if we are currently loading, saving, or deleting
		current, // pointer to current document $(<li>)
		editor, // CodeMirror instance
		uploader; // File-Uploader instance

	/**
	 * Add a new <li> to the key list in the correct alphabetical order
	 **/
	function addToList(newLi) {
		var key = newLi.attr('data-value').toString(),
			added = false;

		// Find out where the new key falls in the list alphabetically
		$('#keys li').each(function() {
			var li = $(this),
				value = li.attr('data-value').toString();
			if (value > key) {
				newLi.insertBefore(li);
				added = true;
				return false;
			}
		});

		// We didn't find a slot, so append it to the end
		if (!added)
			newLi.appendTo($('#keys ul'));
	}

	function connectionError() {
		alert('Error connecting to server.');
	}

	function onChange() {
		// Flag document as changed if we aren't in 
		// the process of loading a document and it 
		// hasn't already been flagged.
		if (current && !changed && !busy) {
			current.addClass('changed');
			changed = true;
			// Update control states
			$('#save').addClass('active');
			$('#reload').addClass('active');
		}
	}

	function newDoc() {
		// Disable action if it does marked as active or another process is happening
		if (!$('#new').hasClass('active') || busy)
			return;

		var key = prompt('New document key:'), // Get the name of the new document key
			newLi;

		if (key && key.length) {
			if (cache.hasOwnProperty(key)) 
				return alert('That key already exists.');

			newLi = $('<li>').attr('data-value', key).text(key);

			// Store current doc before creating new doc
			if (current) {
				cache[current.attr('data-value')] = editor.getValue();
				current.removeClass('selected');
			}

			// Add a new cache entry
			cache[key] = '';
			editor.setValue('');

			addToList(newLi);

			current = newLi;
			current.addClass('selected changed');

			// Update control states
			$('#save').addClass('active');
			$('#reload').removeClass('active');
			$('#move').addClass('active');
			$('#remove').addClass('active');
			if (key.substr(0, 1) == '/')
				$('#view').addClass('active');
			else
				$('#view').removeClass('active');
		}
	}

	function save() {
		// Disable action if it does marked as active or another process is happening
		if (!$('#save').hasClass('active') || busy)
			return;

		var key = current.attr('data-value'),
			value = editor.getValue() || '';

		// Flag as saving
		busy = true;

		$.post('/admin/set', {key: key, value: value}, function() {
			current.removeClass('changed');
			changed = false;
			$('#save').removeClass('active');
			$('#reload').removeClass('active');
			busy = false;
		}).error(function() {
			connectionError();
			busy = false;
		});
	}

	function reload() {
		// Disable action if it does marked as active or another process is happening
		if (!$('#reload').hasClass('active') || busy)
			return;

		if (!confirm('Reload document and lose changes?'))
			return;

		var key = current.attr('data-value');
		busy = true;

		$.getJSON('/admin/get', {key: key}, function(data) {
			if (data === null)
				return alert('Database out of sync with client. Please reload this page.');

			cache[key] = data;
			editor.setValue(data);
			current.removeClass('changed');
			changed = false;
			$('#save').removeClass('active');
			$('#reload').removeClass('active');
			busy = false;
		}).error(function() {						
			connectionError();
			busy = false;
		});
	}

	function move() {
		if (!$('#move').hasClass('active') || busy)
			return;

		// Get the new name of the current document
		var key = prompt('Rename ' + current.attr('data-value') + ' to:'), 
			oldKey;

		if (key && key.length) {
			if (cache.hasOwnProperty(key)) 
				return alert('That key already exists.');

			busy = true;
			oldKey = current.attr('data-value').toString();

			// Remove old entry
			$.post('/admin/unset', {key: oldKey}, function() {
				cache[key] = cache[oldKey];
				delete cache[oldKey];
				current.remove();

				$.post('/admin/set', {key: key, value: cache[key]}, function() {
					current.attr('data-value', key);
					current.text(key);
					addToList(current);
					busy = false;

					if (key.substr(0, 1) == '/')
						$('#view').addClass('active');
					else
						$('#view').removeClass('active');
				}).error(function() {
					connectionError();
					busy = false;
				});
			}).error(function() {
				connectionError();
				busy = false;
			});	
		}

	}

	function remove() {
		if (!$('#remove').hasClass('active') || busy)
			return;

		if (!confirm('Delete ' + current.attr('data-value') + '?'))
			return;
		
		var key = current.attr('data-value');
		busy = true;

		$.post('/admin/unset', {key: key}, function() {
			current.remove();
			current = null;
			changed = false;
			$('#save').removeClass('active');
			$('#reload').removeClass('active');
			$('#move').removeClass('active');
			$('#remove').removeClass('active');
			$('#view').removeClass('active');
			editor.setValue('');
			busy = false;
		}).error(function() {
			connectionError();
			busy = false;
		});
	}

	function view() {
		if (!$('#view').hasClass('active') || busy)
			return;
		window.open(current.attr('data-value'),'_blank');
	}

	function importJson() {
		
	}

	function listClick(e) {
		// Disable if another process is happening
		if (busy)
			return;

		var target = $(e.target),
			value = $(e.target).attr('data-value');

		load($(e.target).attr('data-value'));
	}

	function load(key) {
		busy = true;
		if (current) {
			cache[current.attr('data-value')] = editor.getValue();
			current.removeClass('selected');
		}

		if (cache.hasOwnProperty(key)) {
			editor.setValue(cache[key]);
			busy = false;

		}
		else {
			$.getJSON('/admin/get', {key: key}, function(data) {
				if (data === null)
					return alert('Database out of sync with client. Please reload this page.');

				cache[key] = data;
				editor.setValue(data);
				busy = false;
			}).error(function() {
				connectionError();
				busy = false;
			});
		}

		current = $('#keys li[data-value="' + key + '"]');
		current.addClass('selected');
		changed = current.hasClass('changed');
		if(changed) {
			$('#save').addClass('active');
			$('#reload').addClass('active');
		}
		else {
			$('#save').removeClass('active');
			$('#reload').removeClass('active');
		}
		$('#move').addClass('active');
		$('#remove').addClass('active');
		if (key.substr(0, 1) == '/')
			$('#view').addClass('active');
		else
			$('#view').removeClass('active');
	}

	// Initialize editor
	editor = CodeMirror.fromTextArea(document.getElementById('text'), {
						mode: 'text/html', 
						tabMode: 'indent',
						lineNumbers: true,
						autofocus: true,
						onChange: onChange,
						extraKeys: {
							'Ctrl-N': newDoc,
							'Ctrl-S': save
						}
					});

	// Connect toolbar buttons
	$('#new').click(function(e) {
		e.preventDefault();
		newDoc();
	});
	$('#save').click(function(e) {
		e.preventDefault();
		save();
	});
	$('#reload').click(function(e) {
		e.preventDefault();
		reload();
	});
	$('#move').click(function(e) {
		e.preventDefault();
		move();
	});
	$('#remove').click(function(e) {
		e.preventDefault();
		remove();
	});	
	$('#view').click(function(e) {
		e.preventDefault();
		view();
	});		

	// Simulate :hover for #import
	$('.file-upload input').mouseenter(function() {
		$('#import').addClass('hover');
	}).mouseleave(function() {
		$('#import').removeClass('hover');
	});

	// Listen for clicks on list of keys
	$('#keys').on('click', 'li', listClick);
});