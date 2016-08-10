/**
 * target.UI
 *
 * Base class component object
 *
 * define default functionality that all UI components will share
 */ 
(function(target, undefined) {
	
	'use strict';

	//
	// TODO: add queue functionality
	//
	

	target.UI = window.Proto.extend({
		
		init: function(el, _id, target, name) {
		
			var _this = this;

			this.id = _id;
			this.componentType = name;

			// mixin shared target.js resources
			// now all inherited classes have easy access to these
			this.config = target.config;
			this.events = target.events;
			this.utils = target.utils;

			// element variables
			this.el = el;
			this.NODE_NAME = el.nodeName;
			this.disabled = false;

			// bind id
			this.el.setAttribute('data-target-' + name + '-id', this.id);
			
			// event handlers
			this.eventHandlers = {};
			this.addEventHandler('resize', this.setDisabled);
			
			if (this.config.observeDom) {

				this.addEventHandler('attributes.mutation', this.handleAttMutation);

			}

			this.addEventHandler('show', this.onShow);
			this.addEventHandler('hide', this.onHide);

			// DOM event handlers
			this.domEventHandlers = {};

			// initialize
			this.updateAtts();
		
		},

		/**
		 * add an event handler to a UI element
		 * using Target's internal event buss
		 * scope callback to this object
		 * store for removal by this.destroy
		 */
		addEventHandler: function(eventName, cb) {

			this.eventHandlers[eventName] = this.events.subscribe(eventName, cb, {}, this);

		},

		/**
		 * attach a callback to a DOM event handler
		 * scope the callback to this object
		 * store for removal by this.destroy
		 */
		addDomEventHandler: function(eventName, cb, el) {

			var _this = this;
			var attachedCb = function(e) {

				cb.apply(_this, [e]);

			};

			if (!el) {

				el = this.el;

			}

			this.domEventHandlers[eventName] = {

				cb: attachedCb,

				el: el

			};

			el.addEventListener(eventName, attachedCb, false);

		},

		removeEventHandler: function(handler) {

			this.events.remove(handler, this.eventHandlers[handler].id);

		},

		removeDomEventHandler: function(domHandler) {

			this.domEventHandlers[domHandler] = this.domEventHandlers[domHandler].el.removeEventListener(
			
				domHandler,
				this.domEventHandlers[domHandler].cb
			
			);

		},

		/**
		 * remove all events used by internal pub/sub
		 * remove all dom events
		 */
		destroy: function() {

			var _this = this;
			
			this.utils.forIn(this.eventHandlers, function(handler) {

				_this.removeEventHandler(handler);

			});

			this.utils.forIn(this.domEventHandlers, function(domHandler) {

				_this.removeEventHandler(domHandler);

			});

		},

		/**
		 * when attributes are changed in the DOM
		 * the DOM observer watches and will run this callback
		 * ensure our element has been modified
		 * if so, update the component's properties
		 * based on the new attribute values
		 */
		handleAttMutation: function(target) {

			if (target === this.el) {

				this.updateAtts();

			}

		},

		/**
		 * get attributes on element
		 * set internal properties based on attributes
		 * these properties are used by other methods
		 */
		updateAtts: function() {

			this.disableLayouts = this.el.getAttribute(this.config.attributes.disable);

			if (this.disableLayouts) {
			
				this.disableLayouts = this.disableLayouts.split(' ');
			
			} else {
			
				this.disableLayouts = [];
			
			}

			// request layout from current window object
			this.events.publish('update', this.id);

		},

		/**
		 * on window.resize
		 * determine whether or not a component should be disabled
		 * if so, disable it
		 * if not, enable it
		 */
		setDisabled: function(is) {

			var disable = false;
			var i, len, layout;

			for (i = 0, len = this.disableLayouts.length; i < len; i++) {
			
				layout = this.disableLayouts[i];

				if (is[layout]() && !this.overrideLayouts) {

					disable = true;
					this.disable(true);
					break;
			
				}
			
			}

			if (!disable && !this.overrideLayouts) {
			
				this.enable(true);
			
			}
		
		},

		/**
		 * get "disabled" property
		 */
		isDisabled: function() {
		
			return this.disabled;
		
		},

		/**
		 * set "disabled" property to true
		 * deactivates element
		 * when called via api, no arg passed
		 * therefore override
		 * so that windoe resizing doesn't
		 * override enabled/disabled state
		 * when set via api
		 */
		disable: function(doNotOverride) {

			this.overrideLayouts = !doNotOverride;

			this.disabled = true;

			return this;

		},

		/**
		 * set "disabled" property to false
		 * activates element
		 * when called via api, no arg passed
		 * therefore override
		 * so that windoe resizing doesn't
		 * override enabled/disabled state
		 * when set via api
		 */
		enable: function(doNotOverride) {

			this.overrideLayouts = !doNotOverride;

			this.disabled = false;

			return this;

		},

		/**
		 * show an element using css
		 * could be this UI element, could be another target
		 */
		show: function(el) {
		
			var _this = this;

			if (!el.classList.contains(this.config.activeClass)) {
		
				this.utils.render(function() {

					el.classList.add(_this.config.activeClass);

					_this.events.publish('show', el);
					
				});
		
			}
		
		},

		/**
		 * hide an element using css
		 * could be this UI element, could be another target
		 */
		hide: function(el) {
		
			var _this = this;

			if (el.classList.contains(this.config.activeClass)) {
		
				this.utils.render(function() {

					el.classList.remove(_this.config.activeClass);

					_this.events.publish('hide', el);
				
				});
		
			}
		
		},

		/**
		 * when a target element is shown,
		 * update this element's state
		 */
		onShow: function(el) {

			// some UI elements don't have targets
			if (this.targets && this.utils.contains(this.targets, el)) {

				this.show(this.el);

			}

		},

		/**
		 * when a target element is shown,
		 * update this element's state
		 */
		onHide: function(el) {

			// some UI elements don't have targets
			if (this.targets && this.utils.contains(this.targets, el)) {

				this.hide(this.el);

			}

		}

	});

})(window.target = window.target || {});
