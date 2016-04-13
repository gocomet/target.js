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

		onClick(e) {

			var _this = this;

			if (!this.isDisabled()) {
			
				this.utils.forEach.call(this.targets, (target) => {

					_this.toggle(target);

				});

			}
		
		}

		toggle(el) {
		
			if (!el.classList.contains(this.config.activeClass)) {
				
				this.show(el);
		
			} else {
			
				this.hide(el);
		
			}
	
		}

	};

})(window.target = window.target || {});