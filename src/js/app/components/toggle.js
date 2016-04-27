/**
 *
 * target.Toggle
 *
 * UI element that shows/hides another element on click
 *
 * usage:
 *
 * `<a data-target-toggle="#my-target">Click to toggle #my-target</a>`
 *
 * TODO: add support for checkbox inputs
 * if element.type === checkbox
 *  bind to onchange event instead of onclick
 *
 */
;((target, undefined) => {
	
	'use strict';

	target.Toggle = class TargetToggle extends target.UI {
	
		constructor(el, _id, target, name) {
	
			super(el, _id, target, name);
			
			this.targets = this.utils.qsa(
	
				this.el.getAttribute(this.utils.stripBrackets(this.config.attributes.Toggle))
	
			);

			this.addDomEventHandler('click', this.onClick);

		}

		/**
		 * when the element is clicked
		 * toggle the target element's visibility
		 */
		onClick(e) {

			var _this = this;

			if (!this.isDisabled()) {
			
				if (this.NODE_NAME === 'A') {

					e.preventDefault();
				
				}

				this.utils.forEach.call(this.targets, (target) => {

					_this.toggle(target);

				});

			}
		
		}

		/**
		 * if the target is shown, hide it
		 * if the target is hidden, show it
		 * all using css
		 * also toggle state of toggle button itself
		 */
		toggle(el) {
		
			if (!el.classList.contains(this.config.activeClass)) {
				
				this.show(el);
		
			} else {
			
				this.hide(el);
		
			}
	
		}

	};

})(window.target = window.target || {});