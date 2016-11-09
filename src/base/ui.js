/**
 * target.UI
 *
 * Base class component object
 *
 * define default functionality that all UI components will share
 */
import utils from '../core/utils';

class UI {
		
	constructor(el, _id, name, events, config) {
	
		var _this = this;

		this.id = _id;
		this.componentType = name;

		this.config = config;
		this.events = events;

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
	
	}

	/**
	 * add an event handler to a UI element
	 * using Target's internal event buss
	 * scope callback to this object
	 * store for removal by this.destroy
	 */
	addEventHandler(eventName, cb) {

		this.eventHandlers[eventName] = this.events.subscribe(eventName, cb, {}, this);

	}

	/**
	 * attach a callback to a DOM event handler
	 * scope the callback to this object
	 * store for removal by this.destroy
	 */
	addDomEventHandler(eventName, cb, el) {

		var attachedCb = e => {

			cb.apply(this, [e]);

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

	removeEventHandler(handler) {

		this.events.remove(handler, this.eventHandlers[handler].id);

	}

	removeDomEventHandler(domHandler) {

		this.domEventHandlers[domHandler] = this.domEventHandlers[domHandler].el.removeEventListener(
		
			domHandler,
			this.domEventHandlers[domHandler].cb
		
		);

	}

	/**
	 * remove all events used by internal pub/sub
	 * remove all dom events
	 */
	destroy() {

		utils.forIn(this.eventHandlers, handler => this.removeEventHandler(handler));
		utils.forIn(this.domEventHandlers, domHandler => this.removeEventHandler(domHandler));

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
	 * request layout update from Window service
	 */
	update() {

		this.events.publish('update', this.id);
	
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

		this.update();

	}

	/**
	 * on window.resize
	 * determine whether or not a component should be disabled
	 * if so, disable it
	 * if not, enable it
	 */
	setDisabled(is) {

		var disable = false;
		
		for (let i = 0, len = this.disableLayouts.length; i < len; i++) {
		
			let layout = this.disableLayouts[i];

			if (is[layout] && !this.overrideLayouts) {

				disable = true;
				this.disable(true);
				break;
		
			}
		
		}

		if (!disable && !this.overrideLayouts) {
		
			this.enable(true);
		
		}
	
	}

	/**
	 * get "disabled" property
	 */
	get isDisabled() {
	
		return this.disabled;
	
	}

	/**
	 * set "disabled" property to true
	 * deactivates element
	 * when called via api, no arg passed
	 * therefore override
	 * so that windoe resizing doesn't
	 * override enabled/disabled state
	 * when set via api
	 */
	disable(doNotOverride) {

		this.overrideLayouts = !doNotOverride;

		this.disabled = true;

		return this;

	}

	/**
	 * set "disabled" property to false
	 * activates element
	 * when called via api, no arg passed
	 * therefore override
	 * so that windoe resizing doesn't
	 * override enabled/disabled state
	 * when set via api
	 */
	enable(doNotOverride) {

		this.overrideLayouts = !doNotOverride;

		this.disabled = false;

		return this;

	}

	/**
	 * show an element using css
	 * could be this UI element, could be another target
	 */
	show(el) {
	
		if (!el.classList.contains(this.config.activeClass)) {
	
			utils.render(() => {

				el.classList.add(this.config.activeClass);

				this.events.publish('show', el);
				
			});
	
		}
	
	}

	/**
	 * hide an element using css
	 * could be this UI element, could be another target
	 */
	hide(el) {

		if (el.classList.contains(this.config.activeClass)) {
	
			utils.render(() => {

				el.classList.remove(this.config.activeClass);

				this.events.publish('hide', el);
			
			});
	
		}
	
	}

	/**
	 * when a target element is shown,
	 * update this element's state
	 */
	onShow(el) {

		// some UI elements don't have targets
		if (this.targets && utils.contains(this.targets, el)) {

			this.show(this.el);

		}

	}

	/**
	 * when a target element is shown,
	 * update this element's state
	 */
	onHide(el) {

		// some UI elements don't have targets
		if (this.targets && utils.contains(this.targets, el)) {

			this.hide(this.el);

		}

	}

}

module.exports = UI;
