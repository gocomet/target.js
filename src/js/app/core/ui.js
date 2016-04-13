/**
 *
 * target.UI
 *
 * Base class component object
 *
 * define default functionality that all UI elements will share
 *
 */ 
;(function(target, undefined) {
	
	'use strict';

	target.UI = class TargetUI {
		
		constructor(el, _id, target, name) {
		
			this._id = _id;

			// mixin shared target.js resources
			// now all inherited classes have easy access to these
			this.config = target.config;
			this.events = target.events;
			this.utils = target.utils;

			// element variables
			this.el = el;
			this.disabled = false;

			// bind id
			this.componentName = name;
			this.el.setAttribute(`data-target-${name}-id`, this._id);
			
			// event handlers
			this.eventHandlers = {};
			this.addEventHandler('resize.window', this.setDisabled);
			this.addEventHandler('attributes.mutation', this.handleAttMutation);


			// DOM event handlers
			this.domEventHandlers = {};

			// initialize
			this.updateAtts();
		
		}

		/**
		 * add an event handler to a UI element
		 * using Target's internal event buss
		 * store a reference to it for later removal
		 */
		addEventHandler(eventName, cb) {

			this.eventHandlers[eventName] = this.events.subscribe(eventName, cb, {}, this);

		}

		/**
		 * 
		 * attach a callback to a DOM event handler
		 * scope the callback to this object
		 * store for removal on destroy
		 *
		 */
		addDomEventHandler(eventName, cb, el) {

			var _this = this;
			var attachedCb = (e) => {

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

		}

		/**
		 * remove all events used by internal pub/sub
		 * remove all dom events
		 */
		destroy() {

			var handler;
			var domHandler;

			for (handler in this.eventHandlers) {

				if (this.eventHandlers.hasOwnProperty()) {

					this.events.remove(handler, this.eventHandlers[handler].id);
					
				}

			}

			for (domHandler in this.domEventHandlers) {

				if (this.domEventHandlers.hasOwnProperty()) {

					this.domEventHandlers[domHandler].el.removeEventListener(
						domHandler,
						this.domEventHandlers[domHandler]
					);

				}

			}

		}

		/**
		 * when attributes are changed in the DOM
		 * the DOM observer watches and will run this callback
		 * ensure our element has been modified
		 * if so, update the component's properties
		 * based on the new attribute values
		 */
		handleAttMutation(target) {

			if (target === this.el) {

				this.updateAtts();

			}

		}

		/**
		 * get attributes on element
		 * set internal properties based on attributes
		 * these properties are used by other methods
		 */
		updateAtts() {

			this.disableLayouts = this.el.getAttribute(this.config.attributes.disable);

			if (this.disableLayouts) {
			
				this.disableLayouts = this.disableLayouts.split(' ');
			
			} else {
			
				this.disableLayouts = [];
			
			}

			// request layout from current window object
			this.events.publish('update.ui');

		}

		/**
		 * on window.resize
		 * determine whether or not a component should be disabled
		 * if so, disable it
		 * if not, enable it
		 */
		setDisabled(is) {

			var disable = false;
			var i, len, layout;

			for (i = 0, len = this.disableLayouts.length; i < len; i++) {
			
				layout = this.disableLayouts[i];
			
				if (is[layout]()) {
			
					disable = true;
					this.disabled = true;
					break;
			
				}
			
			}

			if (!disable) {
			
				this.disabled = false;
			
			}
		
		}

		/**
		 * get "disabled" property
		 */
		isDisabled() {
		
			return this.disabled;
		
		}

		/**
		 * show an element using css
		 * could be this UI element, could be another target
		 */
		show(el) {
		
			if (!el.classList.contains(this.config.activeClass)) {
		
				el.classList.add(this.config.activeClass);
		
			}
		
		}

		/**
		 * hide an element using css
		 * could be this UI element, could be another target
		 */
		hide(el) {
		
			if (el.classList.contains(this.config.activeClass)) {
		
				el.classList.remove(this.config.activeClass);
		
			}
		
		}

	};

})(window.target = window.target || {});