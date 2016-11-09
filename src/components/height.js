/**
 * target.Height
 *
 * sets the height of an element programmatically
 *
 * defaults to window height (cross-browser)
 *
 * updates on window.resize
 *
 * usage:
 * `<div data-target-height="window">Is always window height</div>`
 *
 * or
 *
 * `<div data-target-height="-100">is always window height - 100px</div>`
 */
(function(target, undefined) {
	
	'use strict';
	
	target.Height = target.UI.extend({
		
		init: function(el, _id, target, name) {
	
			this._super.apply(this, arguments);

			this.initHeight();
			
			this.addEventHandler('resize', this.setHeight);
			this.addEventHandler('resize' + this.id, this.setHeight);
			
			this.events.publish('update', this.id);

		},

		/**
		 * create initial height settings
		 * based on attributes
		 */
		initHeight: function() {

			this.height = this.el.getAttribute(
			
				this.config.attributes.Height
			
			);

			if (!this.height || this.height === 'window') {

				this.height = 0;

			} else {

				this.height = parseInt(this.height, 10);

			}
		
		},
		
		/**
		 * get the user-declared max height threshold
		 */
		getHeight: function() {

			if (this.height > 0) {
		
				return this.height;
		
			} else {
		
				return this.windowHeight + this.height;
		
			}

		},

		/**
		 * on window.resize
		 * if enabled, set element height
		 * else reset height
		 */
		setHeight: function(is, w, h) {
			
			this.windowHeight = h;

			if (this.isDisabled()) {

				this.el.style.height = '';

			} else {

				this.el.style.height = this.getHeight() + 'px';

			}
		
		}

	});

})(window.target = window.target || {});
