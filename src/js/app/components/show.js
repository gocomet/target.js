/**
 *
 * target.Show
 *
 * UI element that shows another element onclick
 *
 * usage:
 *
 * `<a data-target-show="#show-this">Click to show #show-this</a>`
 *
 */
;((target, undefined) => {
	
	'use strict';

	target.Show = class TargetShow extends target.UI {
	
		constructor(el, _id, target, name) {
	
			super(el, _id, target, name);

			this.targets = this.utils.qsa(
	
				this.el.getAttribute(this.utils.stripBrackets(this.config.attributes.Show))
	
			);

			this.addDomEventHandler('click', this.onClick);

		}

		/**
		 * when the element is clicked,
		 * show the target element
		 * (using css)
		 */
		onClick(e) {

			var _this = this;

			if (!this.isDisabled()) {
			
				this.utils.forEach.call(this.targets, (target) => {

					_this.show(target);

				});

			}
		
		}

	};

})(window.target = window.target || {});