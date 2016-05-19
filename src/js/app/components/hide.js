/**
 * target.Hide
 *
 * UI element that hides another element onclick
 *
 * usage:
 *
 * `<a data-target-hide="#my-target">Click to hide #my-target</a>`
 */
(function(target, undefined) {
	
	'use strict';

	target.Hide = target.UI.extend({
	
		init: function(el, _id, target, name) {
	
			this._super.apply(this, arguments);
			
			this.targets = this.utils.qsa(
	
				this.el.getAttribute(this.utils.stripBrackets(this.config.attributes.Hide))
	
			);


			this.addDomEventHandler('click', this.onClick);
			
		},

		/**
		 * when the element is clicked,
		 * hide the target element
		 * (using css)
		 */
		onClick: function(e) {

			var _this = this;

			if (!this.isDisabled()) {
			
				if (this.NODE_NAME === 'A') {

					e.preventDefault();
				
				}
			
				this.utils.forEach.call(this.targets, function(target) {

					_this.hide(target);

				});

			}
		
		}

	});

})(window.target = window.target || {});
