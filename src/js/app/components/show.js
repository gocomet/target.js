/**
 * target.Show
 *
 * UI element that shows another element onclick
 *
 * usage:
 *
 * `<a data-target-show="#show-this">Click to show #show-this</a>`
 */
(function(target, undefined) {
	
	'use strict';

	target.Show = target.UI.extend({
	
		init: function(el, _id, target, name) {
	
			this._super.apply(this, arguments);

			this.targets = this.utils.qsa(
	
				this.el.getAttribute(this.utils.stripBrackets(this.config.attributes.Show))
	
			);

			this.addDomEventHandler('click', this.onClick);

		},

		/**
		 * when the element is clicked,
		 * show the target element
		 * (using css)
		 */
		onClick: function(e) {

			var _this = this;

			if (!this.isDisabled()) {
			
				if (this.NODE_NAME === 'A') {

					e.preventDefault();
				
				}
			
				this.utils.forEach.call(this.targets, function(target) {

					_this.show(target);

				});

			}
		
		}

	});

})(window.target = window.target || {});
