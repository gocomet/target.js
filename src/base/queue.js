/**
 * Queue
 *
 * queue functionality to be mixed into UI components
 */ 

class Queue {
	
	constructor(items) {
	
		if (items) {

			this.items = items;
		
		} else {

			this.items = [];

		}
	
	}

	push(cb) {

		this.items.push(cb);

	}

	next() {

		if (this.items.length) {

			let cb = this.items.shift();

			cb();

		}

	}

}

module.exports = Queue;
