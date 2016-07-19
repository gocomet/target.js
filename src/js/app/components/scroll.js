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

			this.offset = this.el.getAttribute(
			
				this.utils.stripBrackets(this.config.attributes.Scroll)
			
			);

			if (this.offset) {
			
				this.offset = parseInt(this.offset, 10);
			
			} else {
			
				this.offset = 0;
			
			}

			this.top = 0;

		},
		
		calculateThreshold: function(h) {

			var rect = this.el.getBoundingClientRect();

			this.threshold = rect.top + this.top - (h * 0.6);

		},

		onScroll: function(top) {

			this.top = top;

			// if we're past threshold,
			// or at bottom of document
			// show el
			if (this.top >= this.threshold + this.offset || this.top >= this.docH - this.windowH) {

				this.show(this.el);

			} else {

				this.hide(this.el);

			}

		},

		getDocHeight: function() {
			
			var body = document.body;
			var html = document.documentElement;
			var height = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
			
			return height;
		
		},

		/**
		 * on window.resize
		 * calculate or recalculate
		 * when our element should be shown or hidden
		 */
		onResize: function(is, w, h) {

			this.docH = this.getDocHeight();

			this.windowH = h;

			this.calculateThreshold(h);
			
		}

	});

})(window.target = window.target || {});
