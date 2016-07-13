/**
 * target.Scroll
 *
 * show an element when it scrolls into view
 *
 * calculate an offset on the element by the attribute value, if it exists
 */
(function(target, undefined) {
	
	'use strict';
	
	target.Scroll = target.UI.extend({
		
		init: function(el, _id, target, name) {
	
			this._super.apply(this, arguments);
			
			this.getOffset();

			this.addEventHandler('resize', this.onResize);
			this.addEventHandler('resize' + this.id, this.onResize);
			this.addEventHandler('scroll', this.onScroll);
			
			this.events.publish('update', this.id);

		},

		getOffset: function() {

			// TODO: add declarative settings
			// this.offset = this.el.getAttribute(
			// 	this.config.attributes.Scroll
			// );
			// if (this.offset) {
			// 	this.offset = parseInt(this.offset, 10);
			// } else {
			// 	this.offset = 0;
			// }

			this.top = 0;

		},
		
		calculateThreshold: function(h) {

			var rect = this.el.getBoundingClientRect();

			this.threshold = rect.top + this.top - (h * 0.6);

		},

		onScroll: function(top) {

			this.top = top;

			if (this.top >= this.threshold) {

				this.show(this.el);

			} else {

				this.hide(this.el);

			}

		},

		/**
		 * on window.resize
		 * calculate or recalculate
		 * when our element should be shown or hidden
		 */
		onResize: function(is, w, h) {

			this.calculateThreshold(h);
			
		}

	});

})(window.target = window.target || {});
