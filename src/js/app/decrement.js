/**
 *
 * target.Decrement
 *
 * decrements the value of a target input
 *
 * usage:
 *
 * `<a data-target-decrement="#qty" data-target-min="0">-1 to #qty</a>`
 *
 */
;((target, undefined) => {
	
	'use strict';

	target.Decrement = class TargetDecrement extends target.UI {
	
		constructor(el, _id, target) {
	
			super(el, _id, target);

			this.targets = this.utils.qsa(
	
				this.el.getAttribute(this.utils.stripBrackets(this.config.attributes.Decrement))
	
			);

			this.setLimits();

			this.addDomEventHandler('click', this.onClick);

		}

		setLimits() {

			this.max = this.el.getAttribute(this.config.attributes.max);
			this.min = this.el.getAttribute(this.config.attributes.min);

			if (this.min === null) {
			
				this.min = 0;
			
			} else {
			
				this.min = parseInt(this.min, 10);
			
			}
			
			if (this.max !== null) {
			
				this.max = parseInt(this.max, 10);
			
			}

		}

		decrement(target) {

			var curVal 	= parseInt(target.value, 10);
			var val 	= curVal - 1;
		
			val = Math.max(val, this.min);
		
			target.value = val;
		
		}

		onClick(e) {

			var _this = this;

			if (!this.isDisabled()) {
			
				this.utils.forEach.call(this.targets, (target) => {

					_this.decrement(target);

				});

			}
		
		}

	};

})(window.target = window.target || {});