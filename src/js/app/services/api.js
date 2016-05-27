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

			this.eventHandlers = [];

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
				
				throw 'Error at Target.API.get(): ' + el.toString() + ' is not a Target.js element.';
			
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
		 * add event handler for Target events
		 */
		on: function(eventName, els, cb) {

			var _this = this;

			els = this.normalizeEls(els);

			this.utils.forEach.call(els, function(el) {

				// will return object containing id for removal
				_this.eventHandlers.push({
					
					eventName: eventName,
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
		off: function(eventName, els, cb) {

			var _this = this;

			els = this.normalizeEls(els);

			this.utils.forEach.call(els, function(el) {

				_this.utils.forEach.call(_this.eventHandlers, function(handler) {

					if (handler.eventName === eventName && handler.el === el) {

						_this.events.remove(handler.eventName, handler.event.id);

					}

				});
				
			});

			return this;

		}

	});

})(window.target = window.target || {});
