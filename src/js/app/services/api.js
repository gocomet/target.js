/**
 * target.API
 *
 * make programmatic methods accessible
 * in simplified api
 * mix public methods back into global "target" object
 */
(function(target, undefined) {
	
	'use strict';

	target.API = window.Proto.extend({

		init: function(target) {

			var _this = this;

			this.utils = target.utils;
			this.events = target.events;
			this.componentFactory = target.componentFactory;

			this.eventHandlers = {};

			// mixin public methods into global target object
			['get', 'on', 'off', 'show', 'hide', 'toggle'].forEach(function(method) {
				target[method] = _this[method].bind(_this);
			});
		
		},

		/**
		 * normalize
		 * return one element
		 * to search for component
		 */
		normalize: function(el) {

			if (typeof el === 'string') {

				el = this.utils.qs(el);

			}

			return el;

		},

		/**
		 * normalize els
		 * return Array or NodeList
		 * of elements
		 * (to be used as targets)
		 */
		normalizeEls: function(els) {

			if (typeof els === 'string') {

				els = this.utils.qsa(els);

			} else if (els.length) {

				els = els;

			} else {

				els = [els];

			}

			return els;

		},

		/**
		 * get component by element
		 * accepts only one DOM element
		 * or css selector to return only one DOM element
		 */
		get: function(el) {

			var component;

			el = this.normalize(el);

			component = this.componentFactory.find(el);

			if (!component) {
				
				throw 'Target.js Error at target.api.get(): ' + el.toString() + ' is not a Target.js element.';
			
			}

			return component;

		},

		/**
		 * show a target (or targets) programmatically
		 */
		show: function(els) {

			var component = this.componentFactory.use('Show', this.normalizeEls(els));

			this.utils.forEach.call(component.targets, function(target) {

				component.show(target);

			});

			return this;

		},

		/**
		 * hide a target (or targets) programmatically
		 */
		hide: function(els) {

			var component = this.componentFactory.use('Hide', this.normalizeEls(els));

			this.utils.forEach.call(component.targets, function(target) {

				component.hide(target);

			});

			return this;

		},

		/**
		 * toggle a target (or targets) programmatically
		 */
		toggle: function(els) {

			var component = this.componentFactory.use('Toggle', this.normalizeEls(els));

			this.utils.forEach.call(component.targets, function(target) {

				component.toggle(target);

			});

			return this;

		},

		/**
		 * add event handler meant for our window service
		 * (resize, mobile, tablet, desktop)
		 */
		onWindowEvent: function(eventName, cb) {

			if (!this.eventHandlers[eventName]) {

				this.eventHandlers[eventName] = [];

			}

			this.eventHandlers[eventName].push({
				
				cb: cb,

				event: this.events.subscribe(eventName, cb)
			
			});

			return this;

		},

		/**
		 * remove event handler for our window service
		 */
		offWindowEvent: function(eventName, cb) {

			var _this = this;
			var handlersCopy = [];

			this.eventHandlers[eventName].forEach(function(handler) {
			
				if (handler.cb !== cb) {
			
					handlersCopy.push(handler);
			
				} else {

					_this.events.remove(eventName, handler.event.id);
				
				}
			
			});

			this.eventHandlers[eventName] = handlersCopy;

			return this;

		},

		/**
		 * add event handler for Target component events
		 */
		onElEvent: function(eventName, els, cb) {

			var _this = this;

			els = this.normalizeEls(els);

			if (!this.eventHandlers[eventName]) {

				this.eventHandlers[eventName] = [];

			}

			this.utils.forEach.call(els, function(el) {

				// will return object containing id for removal
				_this.eventHandlers[eventName].push({
					
					cb: cb,
					el: el,
					event: _this.events.subscribe(eventName, (function(el) {

						return function(evEl) {

							if (evEl === el) {

								cb(el);

							}

						};

					})(el))
				
				});

			});

			return this;

		},

		/**
		 * remove event handler for Target events
		 */
		offElEvent: function(eventName, els, cb) {

			var _this = this;
			var handlersCopy = [];

			els = this.normalizeEls(els);

			this.eventHandlers[eventName].forEach(function(handler) {

				if (_this.utils.contains(els, handler.el) && cb === cb) {

					_this.events.remove(eventName, handler.event.id);

				} else {

					handlersCopy.push(handler);
				}

			});

			this.eventHandlers[eventName] = handlersCopy;

			return this;

		},

		/**
		 * normalize on handler
		 * (facade pattern)
		 * allow user to just call the .on method
		 * internally figure out which type of event we should bind
		 * because we could be binding to component events or our window service events
		 */
		on: function(eventName, arg2, arg3) {

			if (typeof arg2 === 'function') {

				this.onWindowEvent(eventName, arg2);

			} else {

				this.onElEvent(eventName, arg2, arg3);
			
			}

			return this;

		},

		/**
		 * facade for removing event handlers
		 */
		off: function(eventName, arg2, arg3) {

			if (typeof arg2 === 'function') {

				this.offWindowEvent(eventName, arg2);

			} else {

				this.offElEvent(eventName, arg2, arg3);
			
			}

			return this;
			
		}
	});

})(window.target = window.target || {});
