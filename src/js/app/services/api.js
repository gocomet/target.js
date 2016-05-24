/**
 * target.API
 *
 * make programmatic methods accessible
 * in simplified api
 */
(function(target, undefined) {
	
	'use strict';

	target.API = window.Proto.extend({

		init: function(target) {

			this.utils = target.utils;
			this.componentFactory = target.componentFactory;

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

		}

	});

})(window.target = window.target || {});
