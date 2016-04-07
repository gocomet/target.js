/**
 *
 * target.Increment
 *
 * UI element that increments the value of an input
 *
 * usage:
 *
 * `<a data-target-increment="#qty" data-target-max="99">+1 to #qty</a>`
 *
 */
;((target, undefined) => {
	
	'use strict';

	target.Increment = class TargetIncrement extends target.UI {
	
		constructor(el, _id, target) {
	
			super(el, _id, target);

			this.targets = this.utils.qsa(
	
				this.el.getAttribute(this.utils.stripBrackets(this.config.attributes.Increment))
	
			);

			this.setLimits();

			this.addDomEventHandler('click', this.onClick);

		}

		setLimits() {

			this.max = this.el.getAttribute(this.config.attributes.max);
			this.min = this.el.getAttribute(this.config.attributes.min);

			if (this.min === null) {
		
				this.min = 0;
			
			}

			if (this.max !== null) {
			
				this.max = parseInt(this.max, 10);
			
			}

		}

		increment(target) {

			var curVal = parseInt(target.value, 10);
			var val = curVal + 1;
			
			if (this.max !== null) {
				
				val = Math.min(val, this.max);
			
			}
			
			target.value = val;
		
		}

		onClick(e) {

			var _this = this;

			if (!this.isDisabled()) {
			
				this.utils.forEach.call(this.targets, (target) => {

					_this.increment(target);

				});

			}
		
		}

	};

})(window.target = window.target || {});