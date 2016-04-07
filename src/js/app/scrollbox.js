/**
 *
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
 * 
 */
;((target, undefined) => {
	
	'use strict';
	
	target.Scrollbox = class TargetScrollbox extends target.UI {
		
		constructor(el, _id, target, name) {
	
			super(el, _id, target, name);

			this.maxHeight = this.el.getAttribute(
			
				this.config.attributes.Scrollbox
			
			);
			this.maxHeight = parseInt(this.maxHeight, 10);

			if (this.el.hasChildNodes()) {
			
				this.children = this.el.childNodes;

			}
			
			this.addEventHandler('resize.window', this.onResize);
			
			this.events.publish('update.ui');

		}
		
		getMaxHeight() {
		
			if (this.maxHeight >= 0) {
		
				return this.maxHeight;
		
			} else {
		
				return document.documentElement.clientHeight + this.maxHeight;
		
			}

		}

		getContentsHeight() {
		
			var height = 0;

			this.utils.forEach.call(this.children, (child) => {
			
				height += child.offsetHeight;
			
			});

			return height;

		}

		setOverflow() {
			
			if (this.getContentsHeight() > this.getMaxHeight() && !this.isDisabled()) {
			
				this.el.style.overflowY = 'scroll';
			
			} else {

				this.el.style.overflowY = 'auto';
			
			}
		
		}

		setMaxHeight() {
			
			if (this.isDisabled()) {

				this.el.style.maxHeight = '';

			} else {

				this.el.style.maxHeight = `${this.getMaxHeight()}px`;

			}
		
		}

		onResize() {

			this.setMaxHeight();
			this.setOverflow();
			
		}

	};


})(window.target = window.target || {});