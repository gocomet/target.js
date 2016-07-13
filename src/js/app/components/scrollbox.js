/**
 * target.Scrollbox
 *
 * creates a box that automatically gets scrollbars
 * when it gets too tall
 * and loses them when it isn't
 *
 * usage:
 *
 * `<div data-target-scrollbox="500">This will scroll when it's 501px tall</div>`
 *
 * or
 *
 * `<div data-target-scrollbox="-500">This will scroll when it's taller than window.height - 500px</div>` 
 */
(function(target, undefined) {
	
	'use strict';
	
	target.Scrollbox = target.UI.extend({
		
		init: function(el, _id, target, name) {
	
			this._super.apply(this, arguments);

			this.maxHeight = this.el.getAttribute(
			
				this.config.attributes.Scrollbox
			
			);
			this.maxHeight = parseInt(this.maxHeight, 10);

			if (this.el.hasChildNodes()) {
			
				this.children = this.el.childNodes;

			}
			
			this.addEventHandler('resize', this.onResize);
			this.addEventHandler('resize' + this.id, this.onResize);
			
			this.events.publish('update', this.id);

		},
		
		/**
		 * get the user-declared max height threshold
		 */
		getMaxHeight: function() {
		
			if (this.maxHeight >= 0) {
		
				return this.maxHeight;
		
			} else {
		
				return document.documentElement.clientHeight + this.maxHeight;
		
			}

		},

		/**
		 * get the total height of all the contents
		 * within our scrollbox element
		 */
		getContentsHeight: function() {
		
			var height = 0;

			this.utils.forEach.call(this.children, function(child) {
			
				height += child.offsetHeight;
			
			});

			return height;

		},

		/**
		 * determine if we need to add a scrollbar to our element
		 * if so, add it
		 * if not, remove it
		 */
		setOverflow: function() {
			
			if (this.getContentsHeight() > this.getMaxHeight() && !this.isDisabled()) {
			
				this.el.style.overflowY = 'scroll';
			
			} else {

				this.el.style.overflowY = 'auto';
			
			}
		
		},

		/**
		 * determine whether or not we need to set a maxHeight property
		 * on element
		 * if so, set it
		 * if not, remove it
		 */
		setMaxHeight: function() {
			
			if (this.isDisabled()) {

				this.el.style.maxHeight = '';

			} else {

				this.el.style.maxHeight = this.getMaxHeight() + 'px';

			}
		
		},

		/**
		 * on window.resize
		 * determine if we need a max height on our element
		 * determine if we need a scrollbar on our element
		 * if so, set them
		 */
		onResize: function() {

			this.setMaxHeight();
			this.setOverflow();
			
		}

	});

})(window.target = window.target || {});
