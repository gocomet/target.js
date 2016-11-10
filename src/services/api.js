/**
 * target.API
 *
 * make programmatic methods accessible
 * in simplified api
 * mix public methods back into global "target" object
 */
import utils from '../core/utils';

class API {

	constructor(entry) {

		this.events = entry.events;
		this.componentFactory = entry.componentFactory;

		this.eventHandlers = {};

		// mixin public methods into global target object
		[
		
			'get',
			'on',
			'off',
			'show',
			'hide',
			'toggle',
			'bind'
		
		].forEach(method => entry[method] = this[method].bind(this));
	
	}

	/**
	 * normalize
	 * return one element
	 * to search for component
	 */
	normalize(el) {

		if (typeof el === 'string') {

			el = utils.qs(el);

		}

		return el;

	}

	/**
	 * normalize els
	 * return Array or NodeList
	 * of elements
	 * (to be used as targets)
	 */
	normalizeEls(els) {

		if (typeof els === 'string') {

			els = utils.qsa(els);

		} else if (els.length) {

			els = els;

		} else {

			els = [els];

		}

		return els;

	}

	/**
	 * get component by element
	 * accepts only one DOM element
	 * or css selector to return only one DOM element
	 */
	get(el) {

		el = this.normalize(el);

		let component = this.componentFactory.find(el);

		if (!component) {
			
			throw 'Target.js Error at target.get(): ' + el.toString() + ' is not a Target.js element.';
		
		}

		return component;

	}

	/**
	 * show a target (or targets) programmatically
	 */
	show(els) {

		let component = this.componentFactory.use('Show', this.normalizeEls(els));

		utils.forEach.call(component.targets, target => component.show(target));

		return this;

	}
	
	/**
	 * hide a target (or targets) programmatically
	 */
	hide(els) {

		let component = this.componentFactory.use('Hide', this.normalizeEls(els));

		utils.forEach.call(component.targets, target => component.hide(target));

		return this;

	}

	/**
	 * toggle a target (or targets) programmatically
	 */
	toggle(els) {

		let component = this.componentFactory.use('Toggle', this.normalizeEls(els));

		utils.forEach.call(component.targets, target => component.toggle(target));

		return this;

	}
	
	/**
	 * add event handler meant for our window service
	 * (resize, mobile, tablet, desktop)
	 */
	onWindowEvent(eventName, cb) {

		if (!this.eventHandlers[eventName]) {

			this.eventHandlers[eventName] = [];

		}

		this.eventHandlers[eventName].push({
			
			cb: cb,

			event: this.events.subscribe(eventName, cb)
		
		});

		return this;

	}

	/**
	 * remove event handler for our window service
	 */
	offWindowEvent(eventName, cb) {

		let handlersCopy = [];

		this.eventHandlers[eventName].forEach(handler => {
		
			if (handler.cb !== cb) {
		
				handlersCopy.push(handler);
		
			} else {

				this.events.remove(eventName, handler.event.id);
			
			}
		
		});

		this.eventHandlers[eventName] = handlersCopy;

		return this;

	}

	/**
	 * add event handler for Target component events
	 */
	onElEvent(eventName, els, cb) {

		els = this.normalizeEls(els);

		if (!this.eventHandlers[eventName]) {

			this.eventHandlers[eventName] = [];

		}

		utils.forEach.call(els, el => {

			// will return object containing id for removal
			this.eventHandlers[eventName].push({
				
				cb: cb,
				el: el,
				event: this.events.subscribe(eventName, (el => {

					return function(evEl) {

						if (evEl === el) {

							cb(el);

						}

					};

				})(el))
			
			});

		});

		return this;

	}
	
	/**
	 * remove event handler for Target events
	 */
	offElEvent(eventName, els, cb) {

		let handlersCopy = [];

		els = this.normalizeEls(els);

		this.eventHandlers[eventName].forEach(handler => {

			if (utils.contains(els, handler.el) && cb === cb) {

				this.events.remove(eventName, handler.event.id);

			} else {

				handlersCopy.push(handler);
			
			}

		});

		this.eventHandlers[eventName] = handlersCopy;

		return this;

	}

	/**
	 * normalize on handler
	 * (facade pattern)
	 * allow user to just call the .on method
	 * internally figure out which type of event we should bind
	 * because we could be binding to component events or our window service events
	 */
	on(eventName, arg2, arg3) {

		if (typeof arg2 === 'function') {

			this.onWindowEvent(eventName, arg2);

		} else {

			this.onElEvent(eventName, arg2, arg3);
		
		}

		return this;

	}
	
	/**
	 * facade for removing event handlers
	 */
	off(eventName, arg2, arg3) {

		if (typeof arg2 === 'function') {

			this.offWindowEvent(eventName, arg2);

		} else {

			this.offElEvent(eventName, arg2, arg3);
		
		}

		return this;
		
	}

	/**
	 * bind target to an element/document fragment
	 *
	 * search within the element
	 * and initialize any components
	 * declared on elements within
	 *
	 * useful for binding to elements after being rendered dynamically
	 */
	bind(el) {

		el = this.normalize(el);

		this.componentFactory.start(el);

	}

}

module.exports = API;
