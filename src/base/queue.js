/**
 * target.queue
 *
 * queue functionality can be added to UI components
 */ 
(function(target, undefined) {
	
	'use strict';

	target.Queue = window.Proto.extend({
		
		init: function() {
		
			this.items = [];
		
		},

		push: function(cb) {

			this.items.push(cb);

		},

		next: function() {

			var cb;

			if (this.items.length) {

				cb = this.items.shift();

				cb();

			}

		}

	});

})(window.target = window.target || {});
